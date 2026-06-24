"use client";

import OnboardingStepIndicator from "@/components/onboarding/OnboardingStepIndicator";
import { Heart } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

interface OnboardingShellProps {
  steps: readonly string[];
  currentStep: number;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function OnboardingShell({
  steps,
  currentStep,
  title,
  subtitle,
  children,
}: OnboardingShellProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <OnboardingStepIndicator
        steps={steps}
        currentStep={currentStep}
        title={title}
        subtitle={subtitle}
      />

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-accent/10 px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            <span className="font-display text-lg font-bold">{SITE_NAME}</span>
          </Link>
        </header>

        <div className="flex flex-1 items-start justify-center p-4 py-8 lg:p-8">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}
