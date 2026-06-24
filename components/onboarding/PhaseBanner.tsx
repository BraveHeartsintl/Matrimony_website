"use client";

import Button from "@/components/ui/Button";
import { getNextOnboardingRoute, getPhaseCtaMessage } from "@/lib/onboarding/access";
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

  if (dismissed || !message || status === "verified" || status === "verification_pending") {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-accent/20 bg-accent-soft px-4 py-3">
      <p className="text-sm text-foreground">{message}</p>
      <div className="flex items-center gap-2">
        {nextRoute && (
          <Link href={nextRoute}>
            <Button size="sm">Continue</Button>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded p-1 text-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
