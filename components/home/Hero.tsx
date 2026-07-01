import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SplitHeadline from "@/components/ui/SplitHeadline";
import StatBlock from "@/components/ui/StatBlock";
import TextCTA from "@/components/ui/TextCTA";
import { SITE_STATS, SITE_TAGLINE } from "@/lib/constants";
import { Shield, ShieldCheck, Lock, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop";

const heroStats = [
  { value: SITE_STATS.members, label: "Members", description: "Brit Asian singles in the UK" },
  { value: SITE_STATS.matches, label: "Matches", description: "Successful connections made" },
  { value: SITE_STATS.verified, label: "Verified", description: "Profile authenticity rate" },
];

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
  return (
    <section className="hero-section relative min-h-screen overflow-hidden accent-glow">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3d1228]/88 via-[#5c1a38]/78 to-[#3d1228]/94" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3d1228]/40 via-transparent to-[#c9956c]/10" />
      </div>

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
            Serving Brit Asian singles across the United Kingdom
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

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {SITE_TAGLINE}. Join {SITE_STATS.members} verified members from London to
              Leicester, Manchester to Birmingham — and start your journey to a lifelong
              partnership today.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/register">
                <Button size="lg">Register Free</Button>
              </Link>
              <TextCTA href="#featured-profiles">Browse Profiles</TextCTA>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
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
