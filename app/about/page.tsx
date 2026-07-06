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

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about UK Matrimony — the UK's trusted matchmaking platform for Brit Asian singles seeking meaningful, lifelong partnerships.",
};

const values = [
  {
    icon: Heart,
    title: "Meaningful Connections",
    description:
      "We believe every Brit Asian deserves a genuine, lasting relationship built on trust, respect, shared culture, and family values.",
  },
  {
    icon: Shield,
    title: "Safety & Privacy First",
    description:
      "Fully GDPR compliant with ICO registration, manual profile verification, and robust privacy controls — your data stays in the UK.",
  },
  {
    icon: Users,
    title: "Brit Asian Community",
    description:
      "Built specifically for British Asian singles across England, Scotland, Wales, and Northern Ireland — understanding both heritage and modern British life.",
  },
  {
    icon: Target,
    title: "Purpose-Driven Matchmaking",
    description:
      "Unlike casual dating apps, we focus exclusively on matrimony — helping you find a life partner with family involvement and cultural respect.",
  },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <Section variant="deepest" className="!py-24">
        <Container className="max-w-3xl text-center">
          <SectionLabel>About Us</SectionLabel>
          <SplitHeadline primary="About UK Matrimony" muted="Brit Asian Matchmaking" />
          <p className="mt-6 text-lg text-muted">{SITE_TAGLINE} since 2020.</p>
        </Container>
      </Section>

      <Section variant="base">
        <Container className="max-w-3xl">
          <SectionLabel>Our Mission</SectionLabel>
          <h2 className="font-display text-2xl font-bold text-foreground">Our Mission</h2>
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
            Muslim, or Christian — we help Brit Asian families connect with confidence.
          </p>
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
