"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { useAuth } from "@/context/AuthContext";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import { formatRegionMembers } from "@/lib/platform-format";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function UKCoverage() {
  const { regions } = usePlatformContent();
  const { session } = useAuth();

  return (
    <Section variant="surface">
      <Container>
        <FadeIn>
          <SectionLabel>UK Coverage</SectionLabel>
          <SplitHeadline primary="Members Across" muted="the United Kingdom" />
          <p className="mt-4 max-w-xl text-muted">
            From London to Glasgow, Birmingham to Bradford — connect with verified UK's Indian
            singles in every major UK city.
          </p>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region, i) => {
            const href = session
              ? `/search?location=${encodeURIComponent(region.city)}`
              : `/register?location=${encodeURIComponent(region.city)}`;

            return (
              <FadeIn key={region.city} delay={i * 60} direction="scale">
                <Link
                  href={href}
                  className="glass glass-hover flex items-center justify-between rounded-[10px] px-5 py-4 transition-colors"
                  aria-label={
                    session
                      ? `Browse profiles in ${region.city}`
                      : `Register to browse profiles in ${region.city}`
                  }
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground">{region.city}</span>
                  </div>
                  <span className="text-xs font-medium text-muted">
                    {formatRegionMembers(region.members)}
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
