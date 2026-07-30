"use client";

import OnboardingStepIndicator from "@/components/onboarding/OnboardingStepIndicator";
import SiteLogo from "@/components/layout/SiteLogo";

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
          <SiteLogo href="/" size="sm" />
        </header>

        <div className="flex flex-1 items-start justify-center p-4 py-8 lg:p-8">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}
