import Stripe from "stripe";
import { stripeSecretKey } from "./planConfig";

let stripeClient: Stripe | undefined;

/**
 * Lazily-constructed singleton. Must only be called from inside a function
 * handler (after secrets are bound), never at module load time.
 */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey.value(), {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeClient;
}
