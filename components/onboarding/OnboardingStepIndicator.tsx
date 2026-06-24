"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OnboardingStepIndicatorProps {
  steps: readonly string[];
  currentStep: number;
  title?: string;
  subtitle?: string;
}

export default function OnboardingStepIndicator({
  steps,
  currentStep,
  title = "Get Started",
  subtitle = "Join in under 60 seconds",
}: OnboardingStepIndicatorProps) {
  return (
    <>
      <div className="hidden w-80 flex-col justify-between bg-gradient-to-br from-deepest via-[#5c1a38] to-deepest p-8 text-white lg:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">
            {title}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold">{subtitle}</h2>
          <ul className="mt-10 space-y-4">
            {steps.map((label, i) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    i < currentStep
                      ? "border-gold bg-gold text-deepest"
                      : i === currentStep
                        ? "border-gold bg-transparent text-gold"
                        : "border-white/30 text-white/50"
                  )}
                >
                  {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    i <= currentStep ? "text-white" : "text-white/50"
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/50">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-3 lg:hidden">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                i <= currentStep ? "bg-accent" : "bg-accent/20"
              )}
            />
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 w-6",
                  i < currentStep ? "bg-accent" : "bg-accent/20"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
