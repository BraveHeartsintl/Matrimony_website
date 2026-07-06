"use client";

import { fetchPublicPlatformContent } from "@/lib/firebase/services/platform.service";
import { SITE_STATS, UK_REGIONS } from "@/lib/constants";
import { DEFAULT_TESTIMONIALS } from "@/lib/mock/testimonials";
import type { PlatformContent } from "@/lib/types/platform";
import { useEffect, useState } from "react";

const INITIAL: PlatformContent = {
  stats: {
    members: SITE_STATS.members,
    matches: SITE_STATS.matches,
    verified: SITE_STATS.verified,
    cities: SITE_STATS.cities,
    successStories: DEFAULT_TESTIMONIALS.length,
  },
  regions: UK_REGIONS.map((r) => ({
    city: r.city,
    members: parseInt(r.members.replace(/[^0-9]/g, ""), 10) || 0,
  })),
  testimonials: DEFAULT_TESTIMONIALS,
};

export function usePlatformContent() {
  const [content, setContent] = useState<PlatformContent>(INITIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchPublicPlatformContent();
        setContent(data);
      } catch {
        setContent(INITIAL);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { ...content, loading };
}
