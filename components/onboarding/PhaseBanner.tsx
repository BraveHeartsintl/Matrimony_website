"use client";

import Button from "@/components/ui/Button";
import { getNextOnboardingRoute, getOptionalVerificationRoute, getPhaseCtaMessage } from "@/lib/onboarding/access";
import type { OnboardingStatus } from "@/lib/types";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PhaseBannerProps {
  status: OnboardingStatus;
}

export default function PhaseBanner({ status }: PhaseBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const message = getPhaseCtaMessage(status);
  const nextRoute = getNextOnboardingRoute(status);
  const optionalVerifyRoute = getOptionalVerificationRoute(status);

  if (dismissed || !message || status === "verified" || status === "verification_pending") {
    return null;
  }

  return (
    <div className="mb-6 rounded-[6px] border border-accent/20 bg-accent-soft px-3 py-3 sm:px-4">
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-sm leading-snug text-foreground">{message}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1.5 text-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {(nextRoute || optionalVerifyRoute) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {nextRoute && (
            <Link href={nextRoute}>
              <Button size="sm">Continue</Button>
            </Link>
          )}
          {optionalVerifyRoute && (
            <Link href={optionalVerifyRoute}>
              <Button size="sm" variant="outline">
                Verify Identity
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
