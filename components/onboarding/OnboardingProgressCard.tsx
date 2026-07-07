"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getNextOnboardingRoute, getOptionalVerificationRoute, getOnboardingStatusLabel } from "@/lib/onboarding/access";
import { ONBOARDING_PHASES } from "@/lib/constants";
import type { OnboardingStatus } from "@/lib/types";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OnboardingProgressCardProps {
  status: OnboardingStatus;
}

function phaseComplete(phaseId: number, status: OnboardingStatus): boolean {
  if (phaseId === 1) return true;
  if (phaseId === 2) {
    return ["profile_completed", "verification_pending", "verified", "rejected"].includes(status);
  }
  if (phaseId === 3) return status === "verified";
  return false;
}

function phaseActive(phaseId: number, status: OnboardingStatus): boolean {
  if (status === "verified") return false;
  if (phaseId === 2) return status === "basic_registered";
  if (phaseId === 3) {
    return status === "rejected" || status === "verification_pending";
  }
  return false;
}

export default function OnboardingProgressCard({ status }: OnboardingProgressCardProps) {
  if (status === "verified") return null;

  const nextRoute = getNextOnboardingRoute(status);
  const optionalVerifyRoute = getOptionalVerificationRoute(status);

  return (
    <Card className="mb-8" padding="lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-label">Your Progress</p>
          <h2 className="mt-1 font-display text-xl font-bold">
            Complete your profile journey
          </h2>
          <p className="mt-1 text-sm text-muted">
            Current status:{" "}
            <span className="font-medium text-accent">
              {getOnboardingStatusLabel(status)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {nextRoute && (
            <Link href={nextRoute}>
              <Button>Continue Setup</Button>
            </Link>
          )}
          {optionalVerifyRoute && (
            <Link href={optionalVerifyRoute}>
              <Button variant="outline">Verify Identity (optional)</Button>
            </Link>
          )}
        </div>
      </div>

      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {ONBOARDING_PHASES.map((phase) => {
          const done = phaseComplete(phase.id, status);
          const active = phaseActive(phase.id, status);
          return (
            <li
              key={phase.id}
              className={cn(
                "rounded-[8px] border px-4 py-3",
                active
                  ? "border-accent bg-accent-soft"
                  : done
                    ? "border-accent/30 bg-surface"
                    : "border-accent/10 bg-surface/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    done
                      ? "bg-accent text-white"
                      : active
                        ? "bg-accent text-white"
                        : "bg-accent/10 text-muted"
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : phase.id}
                </span>
                <span className="text-sm font-semibold">{phase.label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
