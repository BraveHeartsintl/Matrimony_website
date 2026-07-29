"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import {
  SUBSCRIPTION_PLANS,
  getUserSubscription,
  openBillingPortal,
  startCheckout,
} from "@/lib/firebase/services/subscription.service";
import { Check, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SubscriptionContent() {
  const { session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [currentPlanId, setCurrentPlanId] = useState("free");
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [checkoutNotice, setCheckoutNotice] = useState<"success" | "cancel" | null>(null);

  const refreshSubscription = async (userId: string) => {
    setLoading(true);
    const sub = await getUserSubscription(userId);
    setCurrentPlanId(sub?.planId ?? "free");
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;
    void refreshSubscription(session.user.id);
  }, [session]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success" || checkout === "cancel") {
      setCheckoutNotice(checkout);
      // Stripe writes the new plan via webhook asynchronously — re-check shortly after returning.
      if (checkout === "success" && session) {
        void refreshSubscription(session.user.id);
      }
      router.replace("/subscription");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setError("");
    setModalOpen(true);
  };

  const confirmPlan = async () => {
    if (!session || (selectedPlan !== "silver" && selectedPlan !== "gold")) return;
    setRedirecting(true);
    setError("");
    try {
      const url = await startCheckout(selectedPlan, billing);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
      setRedirecting(false);
    }
  };

  const handleManageBilling = async () => {
    setError("");
    setRedirecting(true);
    try {
      const url = await openBillingPortal();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal.");
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Choose Your Plan</h1>
        <p className="mt-2 text-muted">Unlock premium features to find your match faster</p>

        {checkoutNotice === "success" && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent">
            Payment received — your plan will update within a few seconds.
          </p>
        )}
        {checkoutNotice === "cancel" && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-muted/10 px-4 py-2 text-sm text-muted">
            Checkout was cancelled — no charge was made.
          </p>
        )}

        <div className="mt-6 inline-flex rounded-lg glass p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billing === "monthly" ? "bg-accent text-white" : "text-muted"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billing === "yearly" ? "bg-accent text-white" : "text-muted"
            }`}
          >
            Yearly
            <span className="ml-1 text-xs text-accent">Save 25%</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const period = billing === "monthly" ? "/month" : "/year";
          const isCurrent = currentPlanId === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${plan.popular ? "border-accent" : ""}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-accent">
                  {price === 0 ? "Free" : `£${price.toFixed(2)}`}
                </span>
                {price > 0 && <span className="text-sm text-muted">{period}</span>}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 w-full"
                variant={plan.popular ? "primary" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || plan.id === "free"}
              >
                {isCurrent ? "Current Plan" : plan.id === "free" ? "Free Tier" : "Subscribe"}
              </Button>
            </Card>
          );
        })}
      </div>

      {currentPlanId !== "free" && (
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => void handleManageBilling()} disabled={redirecting}>
            {redirecting ? "Opening billing portal…" : "Manage billing / cancel subscription"}
          </Button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Plan Change">
        <p className="text-sm text-muted">
          You&apos;ll be redirected to Stripe to securely subscribe to{" "}
          <strong>{SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.name}</strong> (
          {billing} billing).
        </p>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <Button className="mt-4 w-full" onClick={() => void confirmPlan()} disabled={redirecting}>
          {redirecting ? "Redirecting to Stripe…" : "Continue to Payment"}
        </Button>
      </Modal>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <SubscriptionContent />
    </Suspense>
  );
}
