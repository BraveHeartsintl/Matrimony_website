"use client";

import Button from "@/components/ui/Button";
import { getNextOnboardingRoute } from "@/lib/onboarding/access";
import type { OnboardingStatus } from "@/lib/types";
import Link from "next/link";
import { Lock } from "lucide-react";

interface LockedFeatureProps {
  status: OnboardingStatus;
  feature: string;
  children: React.ReactNode;
  className?: string;
}

export default function LockedFeature({
  status,
  feature,
  children,
  className,
}: LockedFeatureProps) {
  const nextRoute = getNextOnboardingRoute(status);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[12px] bg-background/60 p-6 text-center backdrop-blur-[2px]">
        <Lock className="h-8 w-8 text-accent" />
        <p className="text-sm font-medium text-foreground">
          {feature} is locked
        </p>
        {nextRoute && (
          <Link href={nextRoute}>
            <Button size="sm">Unlock now</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
