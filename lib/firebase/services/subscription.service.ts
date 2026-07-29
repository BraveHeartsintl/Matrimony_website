import { getFirebaseDb, getFirebaseFunctions } from "@/lib/firebase/config";
import { timestampToIso } from "@/lib/firebase/converters";
import type { SubscriptionPlan } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export interface UserSubscription {
  planId: string;
  status: "active" | "cancelled" | "expired";
  renewsAt?: string;
  billing?: "monthly" | "yearly";
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "subscriptions", userId));
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  return {
    planId: String(data.planId ?? "free"),
    status: (data.status as UserSubscription["status"]) ?? "active",
    renewsAt: timestampToIso(data.renewsAt),
    billing: data.billing as UserSubscription["billing"],
  };
}

interface CreateCheckoutSessionResponse {
  url: string;
}

/**
 * Starts a Stripe Checkout session for a paid plan. The plan/billing is only
 * a hint to the backend — the Firebase Cloud Function resolves the actual
 * Stripe Price ID server-side, so the amount charged can never be tampered
 * with from the client. Returns the Stripe-hosted URL to redirect to.
 */
export async function startCheckout(
  planId: "silver" | "gold",
  billing: "monthly" | "yearly"
): Promise<string> {
  const createCheckoutSession = httpsCallable<
    { planId: string; billing: string },
    CreateCheckoutSessionResponse
  >(getFirebaseFunctions(), "createCheckoutSession");

  const { data } = await createCheckoutSession({ planId, billing });
  return data.url;
}

/**
 * Opens the Stripe Billing Portal so an existing subscriber can update their
 * payment method, view invoices, or cancel. Returns the Stripe-hosted URL.
 */
export async function openBillingPortal(): Promise<string> {
  const createPortalSession = httpsCallable<void, CreateCheckoutSessionResponse>(
    getFirebaseFunctions(),
    "createPortalSession"
  );

  const { data } = await createPortalSession();
  return data.url;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Browse limited profiles", "Send 3 interests/month", "Basic search"],
  },
  {
    id: "silver",
    name: "Silver",
    priceMonthly: 14.99,
    priceYearly: 149.99,
    features: ["Unlimited interests", "See who viewed you", "Advanced filters", "Priority support"],
    popular: true,
  },
  {
    id: "gold",
    name: "Gold",
    priceMonthly: 29.99,
    priceYearly: 249.99,
    features: ["Everything in Silver", "Direct messaging", "Profile boost", "Verified badge priority"],
  },
];

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === planId);
}
