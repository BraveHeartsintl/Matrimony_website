"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SplitHeadline from "@/components/ui/SplitHeadline";
import TextCTA from "@/components/ui/TextCTA";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { Award, Lock, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trustBadges = [
  { icon: ShieldCheck, label: "GDPR" },
  { icon: Shield, label: "Secure" },
  { icon: Lock, label: "Private" },
  { icon: Award, label: "Trusted" },
];

export default function Hero() {
  const { stats } = usePlatformContent();

  const heroStats = [
    { value: stats.members, label: "Members" },
    { value: stats.matches, label: "Matches" },
    { value: stats.verified, label: "Verified" },
  ];

  return (
    <section className="hero-section relative min-h-screen overflow-hidden">
      <Image
        src="/images/hero/wedding-ceremony.jpg"
        alt="Traditional Indian wedding ceremony"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />

      {/* Readability veil — darker on the left so the couple stays visible */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-deepest/85 via-deepest/45 to-deepest/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-deepest/70 via-transparent to-deepest/35"
        aria-hidden="true"
      />

      <Container className="relative flex min-h-screen flex-col justify-center py-24 lg:py-32">
        <div
          className="hero-glass animate-fade-in-up w-full max-w-2xl rounded-2xl p-7 sm:p-9 lg:p-11"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="font-display text-2xl tracking-wide text-gold sm:text-3xl">
            {SITE_NAME}
          </p>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            Serving UK&apos;s Indian singles across the United Kingdom
          </p>

          <div className="mt-6">
            <SplitHeadline
              as="h1"
              className="text-3xl leading-tight sm:text-4xl lg:text-5xl"
              primary="Find Your Perfect Match"
              muted="in the UK's Indian Community"
            />
          </div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/88 sm:text-lg">
            {SITE_TAGLINE}. Join {stats.members} verified members and start your
            journey to a lifelong partnership.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/register">
              <Button size="lg">Register Free</Button>
            </Link>
            <TextCTA href="#featured-profiles">Browse Profiles</TextCTA>
          </div>

          <p className="mt-4 text-sm text-white/55">
            Free registration · No credit card required · Cancel anytime
          </p>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/15 pt-7">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="hero-glass-chip rounded-xl px-4 py-3"
              >
                <p className="font-display text-xl text-gold sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="hero-glass-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                title={label}
              >
                <Icon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span className="text-[0.65rem] font-medium uppercase tracking-wider text-white/70">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
