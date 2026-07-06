"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import {
  SUBSCRIPTION_PLANS,
  getUserSubscription,
  updateUserSubscriptionPlan,
} from "@/lib/firebase/services/subscription.service";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const { session } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [currentPlanId, setCurrentPlanId] = useState("free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;
    void (async () => {
      setLoading(true);
      const sub = await getUserSubscription(session.user.id);
      setCurrentPlanId(sub?.planId ?? "free");
      setLoading(false);
    })();
  }, [session]);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  const confirmPlan = async () => {
    if (!session || !selectedPlan) return;
    setSaving(true);
    try {
      await updateUserSubscriptionPlan(session.user.id, selectedPlan, billing);
      setCurrentPlanId(selectedPlan);
      setModalOpen(false);
    } finally {
      setSaving(false);
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Plan Change">
        <p className="text-sm text-muted">
          Update your Firestore subscription to{" "}
          <strong>{SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.name}</strong> (
          {billing} billing). Payment processing will be added in a future release.
        </p>
        <Button className="mt-4 w-full" onClick={() => void confirmPlan()} disabled={saving}>
          {saving ? "Saving…" : "Confirm"}
        </Button>
      </Modal>
    </div>
  );
}
