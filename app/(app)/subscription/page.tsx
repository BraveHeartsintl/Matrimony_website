"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { SUBSCRIPTION_PLANS } from "@/lib/mock/plans";
import { Check } from "lucide-react";
import { useState } from "react";

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Choose Your Plan</h1>
        <p className="mt-2 text-muted">Unlock premium features to find your match faster</p>

        <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billing === "monthly" ? "bg-primary text-white" : "text-muted"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billing === "yearly" ? "bg-primary text-white" : "text-muted"
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

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-primary">
                  {price === 0 ? "Free" : `£${price.toFixed(2)}`}
                </span>
                {price > 0 && <span className="text-sm text-muted">{period}</span>}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 w-full"
                variant={plan.popular ? "primary" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.id === "free"}
              >
                {plan.id === "free" ? "Current Plan" : "Subscribe"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Payment Coming Soon">
        <p className="text-sm text-muted">
          Stripe payment integration will be available in Phase 2. You selected the{" "}
          <strong>{SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)?.name}</strong> plan (
          {billing} billing).
        </p>
        <Button className="mt-4 w-full" onClick={() => setModalOpen(false)}>
          Got it
        </Button>
      </Modal>
    </div>
  );
}
