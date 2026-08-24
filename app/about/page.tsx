import AboutStats from "@/components/about/AboutStats";
import PublicLayout from "@/components/layout/PublicLayout";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { SITE_TAGLINE } from "@/lib/constants";
import { Heart, Shield, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about UK Matrimony — the UK's trusted matchmaking platform for UK's Indian singles seeking meaningful, lifelong partnerships.",
};

const values = [
  {
    icon: Heart,
    title: "Meaningful Connections",
    description:
      "We believe every UK's Indian deserves a genuine, lasting relationship built on trust, respect, shared culture, and family values.",
  },
  {
    icon: Shield,
    title: "Safety & Privacy First",
    description:
      "Fully GDPR compliant with ICO registration, manual profile verification, and robust privacy controls ",
  },
  {
    icon: Users,
    title: "UK's Indian Community",
    description:
      "Built specifically for British Asian singles across England, Scotland, Wales, and Northern Ireland — understanding both heritage and modern British life.",
  },
  {
    icon: Target,
    title: "Purpose-Driven Matchmaking",
    description:
      "We focus exclusively on matrimony — helping you find a life partner with family involvement and cultural respect.",
  },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <Section variant="deepest" className="!py-24">
        <Container className="max-w-3xl text-center">
          <SectionLabel>About Us</SectionLabel>
          <SplitHeadline primary="UK's Indian Matchmaking" muted="" />
          <p className="mt-6 text-lg text-muted">{SITE_TAGLINE} since 2020.</p>
        </Container>
      </Section>

      <Section variant="base">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionLabel>Our Mission</SectionLabel>
              {/* <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Our Mission
              </h2> */}
              <p className="mt-4 leading-relaxed text-muted">
                UK Matrimony was founded with a clear mission: to provide a safe, respectful, and
                effective platform where British Asian singles and their families can find meaningful,
                lifelong partnerships. We understand that finding a life partner is one of the most
                important decisions you will ever make — and we are committed to supporting you every
                step of the way.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Our platform combines modern technology with traditional values, offering advanced
                search filters by faith, city, education, and profession, alongside profile verification,
                privacy controls, and a dedicated UK-based support team. Whether you are Hindu, Sikh,
                Muslim, or Christian — we help UK&apos;s Indian families connect with confidence.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/25 shadow-[0_20px_60px_rgba(0,0,0,0.35)] lg:aspect-[5/4]">
              <Image
                src="/images/hero/wedding-ceremony.jpg"
                alt="A groom in a gold sherwani and red turban placing a floral garland on a bride during a traditional Indian wedding ceremony"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deepest/45 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="surface">
        <Container>
          <div className="text-center">
            <SectionLabel>Our Values</SectionLabel>
            <SplitHeadline primary="What We" muted="Stand For" />
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} hover>
                <v.icon className="h-8 w-8 text-accent" />
                <h3 className="mt-3 text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="base">
        <Container className="max-w-3xl text-center">
          <SectionLabel>By The Numbers</SectionLabel>
          <SplitHeadline primary="Trusted by" muted="Thousands" />
          <AboutStats />
        </Container>
      </Section>
    </PublicLayout>
  );
}
