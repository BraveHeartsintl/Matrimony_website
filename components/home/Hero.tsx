"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SplitHeadline from "@/components/ui/SplitHeadline";
import StatBlock from "@/components/ui/StatBlock";
import TextCTA from "@/components/ui/TextCTA";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import { SITE_TAGLINE } from "@/lib/constants";
import { Award, Lock, Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";

const trustBadges = [
  { icon: ShieldCheck, label: "GDPR" },
  { icon: Shield, label: "Secure" },
  { icon: Lock, label: "Private" },
  { icon: Award, label: "Trusted" },
];

const partnerLogos = [
  "ICO Registered",
  "GDPR Compliant",
  "SSL Secured",
  "UK Data Centre",
];

export default function Hero() {
  const { stats } = usePlatformContent();

  const heroStats = [
    { value: stats.members, label: "Members", description: "UK's Indian singles in the UK" },
    { value: stats.matches, label: "Matches", description: "Successful connections made" },
    { value: stats.verified, label: "Verified", description: "Profile authenticity rate" },
  ];

  return (
    <section className="hero-section relative min-h-screen overflow-hidden accent-glow">
      <div className="absolute inset-0 bg-gradient-to-b from-deepest via-navy-royal to-deepest" />
      <div className="absolute inset-0 bg-gradient-to-r from-deepest/60 via-transparent to-gold/10" />

      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
      <div className="hero-orb hero-orb-3" aria-hidden="true" />

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-90" />

      <Container className="relative flex min-h-screen flex-col justify-center py-24 lg:py-32">
        <div
          className="glass-pill mb-8 inline-flex w-fit animate-fade-in-up items-center gap-2 rounded-full px-4 py-1.5"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            🇬🇧
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">
            Serving UK's Indian singles across the United Kingdom
          </span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          <div
            className="animate-fade-in-left lg:col-span-3"
            style={{ animationDelay: "0.2s" }}
          >
            <SplitHeadline
              as="h1"
              primary="Find Your Perfect Match"
              muted="in the UK's Indian Community"
            />

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              {SITE_TAGLINE}. Join {stats.members} verified members from London to Leicester,
              Manchester to Birmingham — and start your journey to a lifelong partnership today.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/register">
                <Button size="lg">Register Free</Button>
              </Link>
              <TextCTA href="#featured-profiles">Browse Profiles</TextCTA>
            </div>

            <p className="mt-4 text-sm text-white/60">
              Free registration · No credit card required · Cancel anytime
            </p>
          </div>

          <div
            className="animate-fade-in-right flex flex-col items-start gap-7 lg:col-span-2 lg:items-end"
            style={{ animationDelay: "0.35s" }}
          >
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-dark w-full max-w-xs rounded-[10px] px-5 py-4 lg:ml-auto"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <StatBlock
                  value={stat.value}
                  label={stat.label}
                  description={stat.description}
                  align="right"
                />
              </div>
            ))}

            <div className="mt-4 flex gap-4 lg:justify-end">
              {trustBadges.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="glass-dark animate-float flex h-16 w-16 flex-col items-center justify-center rounded-full"
                  style={{ animationDelay: `${i * 0.4}s` }}
                  title={label}
                >
                  <Icon className="h-5 w-5 text-gold" />
                  <span className="mt-1 text-[0.6rem] uppercase tracking-wider text-white/60">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="animate-fade-in-up mt-16 pt-10"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="accent-divider mb-10" />
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {partnerLogos.map((logo) => (
              <span
                key={logo}
                className="text-xs font-medium uppercase tracking-[0.15em] text-white/40 transition-colors duration-300 hover:text-gold"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
