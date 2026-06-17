import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SplitHeadline from "@/components/ui/SplitHeadline";
import StatBlock from "@/components/ui/StatBlock";
import TextCTA from "@/components/ui/TextCTA";
import { Shield, ShieldCheck, Lock, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop";

const heroStats = [
  { value: "50K+", label: "Members", description: "Active UK singles" },
  { value: "5K+", label: "Stories", description: "Successful matches" },
  { value: "98%", label: "Verified", description: "Profile authenticity" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "GDPR" },
  { icon: Shield, label: "Secure" },
  { icon: Lock, label: "Private" },
  { icon: Award, label: "Trusted" },
];

const partnerLogos = ["GDPR Compliant", "SSL Secured", "ICO Registered", "Verified Platform"];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden accent-glow">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover img-bw"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/85 via-[#0f0f0f]/75 to-[#0f0f0f]/95" />
        <div className="absolute inset-0 bg-accent/5" />
      </div>

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

      <Container className="relative flex min-h-screen flex-col justify-center py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <SplitHeadline
              as="h1"
              primary="Find Your Perfect Match"
              muted="in the United Kingdom"
            />

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Join thousands of UK singles who have found meaningful relationships through our
              secure, verified matrimony platform. Your journey to forever starts here.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/register">
                <Button size="lg">Register Free</Button>
              </Link>
              <TextCTA href="#featured-profiles">Browse Profiles</TextCTA>
            </div>
          </div>

          <div className="flex flex-col items-start gap-7 lg:col-span-2 lg:items-end">
            {heroStats.map((stat) => (
              <StatBlock
                key={stat.label}
                value={stat.value}
                label={stat.label}
                description={stat.description}
                align="right"
                className="w-full max-w-xs lg:ml-auto"
              />
            ))}

            <div className="mt-4 flex gap-4 lg:justify-end">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass-accent flex h-16 w-16 flex-col items-center justify-center rounded-full"
                  title={label}
                >
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="mt-1 text-[0.6rem] uppercase tracking-wider text-accent/70">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10">
          <div className="accent-divider mb-10" />
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {partnerLogos.map((logo) => (
              <span
                key={logo}
                className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-accent"
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
