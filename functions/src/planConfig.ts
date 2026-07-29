import { defineSecret, defineString } from "firebase-functions/params";

/**
 * Secrets — set with `firebase functions:secrets:set STRIPE_SECRET_KEY` /
 * `STRIPE_WEBHOOK_SECRET`. Never hard-code these or put them in `.env` files
 * that get committed.
 */
export const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
export const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

/**
 * Where to send the browser back to after Stripe Checkout / the Billing
 * Portal. Configure per-environment with:
 *   firebase functions:config:env:set APP_URL="https://ukmatrimony.co.uk"
 * (or via `firebase deploy --only functions` params prompt).
 */
export const appUrl = defineString("APP_URL", {
  default: "http://localhost:3000",
});

/**
 * Stripe Price IDs are environment params rather than secrets (they aren't
 * sensitive), but they still only ever live server-side — the client only
 * ever sends a `planId` + `billing` pair and the actual price is resolved
 * here, so nobody can tamper with what gets charged.
 */
const priceSilverMonthly = defineString("STRIPE_PRICE_SILVER_MONTHLY");
const priceSilverYearly = defineString("STRIPE_PRICE_SILVER_YEARLY");
const priceGoldMonthly = defineString("STRIPE_PRICE_GOLD_MONTHLY");
const priceGoldYearly = defineString("STRIPE_PRICE_GOLD_YEARLY");

export type PlanId = "silver" | "gold";
export type BillingCycle = "monthly" | "yearly";

export const PAID_PLAN_IDS: readonly PlanId[] = ["silver", "gold"];
export const BILLING_CYCLES: readonly BillingCycle[] = ["monthly", "yearly"];

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (PAID_PLAN_IDS as readonly string[]).includes(value);
}

export function isBillingCycle(value: unknown): value is BillingCycle {
  return typeof value === "string" && (BILLING_CYCLES as readonly string[]).includes(value);
}

/**
 * NOTE: `.value()` reads the resolved param at call time and must only be
 * invoked from inside a function handler (not at module load), so this is
 * intentionally a function rather than a module-level constant.
 */
function getPriceMap(): Record<PlanId, Record<BillingCycle, string>> {
  return {
    silver: {
      monthly: priceSilverMonthly.value(),
      yearly: priceSilverYearly.value(),
    },
    gold: {
      monthly: priceGoldMonthly.value(),
      yearly: priceGoldYearly.value(),
    },
  };
}

export function resolvePriceId(planId: PlanId, billing: BillingCycle): string {
  const priceId = getPriceMap()[planId][billing];
  if (!priceId) {
    throw new Error(`No Stripe Price ID configured for plan "${planId}" (${billing}).`);
  }
  return priceId;
}

/** Reverse lookup used by the webhook to translate a Stripe Price back into our plan model. */
export function planFromPriceId(priceId: string): { planId: PlanId; billing: BillingCycle } | undefined {
  const map = getPriceMap();
  for (const planId of PAID_PLAN_IDS) {
    for (const billing of BILLING_CYCLES) {
      if (map[planId][billing] === priceId) {
        return { planId, billing };
      }
    }
  }
  return undefined;
}
