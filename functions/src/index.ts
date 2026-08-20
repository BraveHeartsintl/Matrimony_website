import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall, onRequest, type CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import type Stripe from "stripe";

import {
  appUrl,
  isBillingCycle,
  isPlanId,
  planFromPriceId,
  resolvePriceId,
  stripeSecretKey,
  stripeWebhookSecret,
  type BillingCycle,
  type PlanId,
} from "./planConfig";
import { getStripeClient } from "./stripeClient";

export { sendVerificationEmail } from "./verificationEmail";

initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

// Re-export after initializeApp so analyzers can load Veriff modules safely.
export { createVeriffSession, veriffWebhook } from "./veriff";

const db = getFirestore();
const subscriptionsCollection = () => db.collection("subscriptions");

function requireUid(request: CallableRequest): string {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in to do this.");
  }
  return uid;
}

/**
 * Finds (or creates) the Stripe Customer for a Firebase user and persists
 * `stripeCustomerId` on their subscription doc via the Admin SDK — this is
 * the only writer of that field, so the client can never spoof it.
 */
async function getOrCreateStripeCustomerId(stripe: Stripe, uid: string): Promise<string> {
  const subDoc = await subscriptionsCollection().doc(uid).get();
  const existing = subDoc.data()?.stripeCustomerId as string | undefined;
  if (existing) return existing;

  const userRecord = await getAuth().getUser(uid);
  const customer = await stripe.customers.create({
    email: userRecord.email,
    name: userRecord.displayName ?? undefined,
    metadata: { firebaseUid: uid },
  });

  await subscriptionsCollection().doc(uid).set(
    { stripeCustomerId: customer.id, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  return customer.id;
}

/**
 * Creates a Stripe Checkout Session for a subscription. The client only
 * supplies `planId`/`billing`; the Price ID is resolved server-side so a
 * tampered request can never change what gets charged.
 */
export const createCheckoutSession = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    const uid = requireUid(request);
    const { planId, billing } = (request.data ?? {}) as { planId?: unknown; billing?: unknown };

    if (!isPlanId(planId)) {
      throw new HttpsError("invalid-argument", "planId must be one of: silver, gold.");
    }
    if (!isBillingCycle(billing)) {
      throw new HttpsError("invalid-argument", "billing must be one of: monthly, yearly.");
    }

    const stripe = getStripeClient();
    const priceId = resolvePriceId(planId as PlanId, billing as BillingCycle);
    const customerId = await getOrCreateStripeCustomerId(stripe, uid);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: uid,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { firebaseUid: uid, planId, billing },
      },
      allow_promotion_codes: true,
      success_url: `${appUrl.value()}/subscription?checkout=success`,
      cancel_url: `${appUrl.value()}/subscription?checkout=cancel`,
    });

    if (!session.url) {
      throw new HttpsError("internal", "Stripe did not return a checkout URL.");
    }

    return { url: session.url };
  }
);

/**
 * Creates a Stripe Billing Portal session so a subscriber can update their
 * payment method, view invoices, or cancel — all on Stripe-hosted pages.
 */
export const createPortalSession = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    const uid = requireUid(request);
    const subDoc = await subscriptionsCollection().doc(uid).get();
    const customerId = subDoc.data()?.stripeCustomerId as string | undefined;

    if (!customerId) {
      throw new HttpsError(
        "failed-precondition",
        "No billing account found for this user yet. Subscribe to a paid plan first."
      );
    }

    const stripe = getStripeClient();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl.value()}/subscription`,
    });

    return { url: portalSession.url };
  }
);

function mapStripeStatus(status: Stripe.Subscription.Status): "active" | "cancelled" | "expired" {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
      return "active";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "expired";
    default:
      return "expired";
  }
}

async function findUidForCustomer(stripe: Stripe, customerId: string): Promise<string | undefined> {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return undefined;
  return (customer as Stripe.Customer).metadata?.firebaseUid;
}

async function resolveUidForSubscription(subscription: Stripe.Subscription, uidHint?: string): Promise<string | undefined> {
  if (uidHint) return uidHint;
  if (subscription.metadata?.firebaseUid) return subscription.metadata.firebaseUid;
  return findUidForCustomer(getStripeClient(), subscription.customer as string);
}

/** Single source of truth for writing Stripe subscription state into Firestore. */
async function syncSubscriptionFromStripe(subscription: Stripe.Subscription, uidHint?: string): Promise<void> {
  const uid = await resolveUidForSubscription(subscription, uidHint);
  if (!uid) {
    logger.error("Could not resolve Firebase uid for Stripe subscription", { subscriptionId: subscription.id });
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  const planInfo = priceId ? planFromPriceId(priceId) : undefined;

  await subscriptionsCollection().doc(uid).set(
    {
      planId: planInfo?.planId ?? subscription.metadata?.planId ?? "free",
      billing: planInfo?.billing ?? subscription.metadata?.billing ?? null,
      status: mapStripeStatus(subscription.status),
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: Timestamp.fromMillis(subscription.current_period_end * 1000),
      renewsAt: Timestamp.fromMillis(subscription.current_period_end * 1000),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session): Promise<void> {
  const uid = session.client_reference_id ?? undefined;
  if (!uid) {
    logger.error("checkout.session.completed missing client_reference_id", { sessionId: session.id });
    return;
  }
  if (!session.subscription) return;

  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await syncSubscriptionFromStripe(subscription, uid);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const uid = await resolveUidForSubscription(subscription);
  if (!uid) return;

  await subscriptionsCollection().doc(uid).set(
    {
      planId: "free",
      billing: null,
      status: "cancelled",
      stripeSubscriptionId: subscription.id,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function handlePaymentFailed(stripe: Stripe, invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription) return;
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription.id;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await syncSubscriptionFromStripe(subscription);
}

/**
 * Stripe webhook endpoint. Signature verification is the only thing that
 * authenticates these requests — never trust the payload otherwise, and
 * never derive the Firebase uid from anything a client could have supplied
 * directly to this endpoint.
 */
export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret], cors: false },
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const stripe = getStripeClient();

    let event: Stripe.Event;
    try {
      if (typeof signature !== "string") throw new Error("Missing stripe-signature header");
      event = stripe.webhooks.constructEvent(req.rawBody, signature, stripeWebhookSecret.value());
    } catch (err) {
      logger.error("Stripe webhook signature verification failed", err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await syncSubscriptionFromStripe(event.data.object as Stripe.Subscription);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case "invoice.payment_failed":
          await handlePaymentFailed(stripe, event.data.object as Stripe.Invoice);
          break;
        default:
          logger.info(`Unhandled Stripe event type: ${event.type}`);
      }
      res.status(200).json({ received: true });
    } catch (err) {
      logger.error("Error handling Stripe webhook event", { type: event.type, err });
      res.status(500).send("Webhook handler failed");
    }
  }
);
