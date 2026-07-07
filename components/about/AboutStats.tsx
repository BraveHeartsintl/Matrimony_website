"use client";

import StatBlock from "@/components/ui/StatBlock";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import { SITE_TAGLINE } from "@/lib/constants";

export default function AboutStats() {
  const { stats } = usePlatformContent();

  return (
    <>
      <p className="mt-4 text-muted">
        With over {stats.members} registered UK's Indian members and {stats.matches} successful
        matches, UK Matrimony is one of the fastest-growing matrimony platforms in the United
        Kingdom.
      </p>
      <div className="mt-12 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
        <StatBlock
          value={stats.members}
          label="Members"
          description="UK's Indian singles in the UK"
        />
        <StatBlock value={stats.matches} label="Matches" description="Successful connections" />
        <StatBlock value={stats.verified} label="Verified" description="Profile authenticity rate" />
      </div>
      <p className="sr-only">{SITE_TAGLINE}</p>
    </>
  );
}
