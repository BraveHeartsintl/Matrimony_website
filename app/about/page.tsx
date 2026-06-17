import PublicLayout from "@/components/layout/PublicLayout";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import StatBlock from "@/components/ui/StatBlock";
import { Heart, Shield, Target, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

const values = [
  {
    icon: Heart,
    title: "Meaningful Connections",
    description:
      "We believe every person deserves a genuine, lasting relationship built on trust, respect, and shared values.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Your privacy and security are paramount. We are fully GDPR compliant with robust verification and moderation.",
  },
  {
    icon: Users,
    title: "UK Community",
    description:
      "Built specifically for the UK market, connecting singles across England, Scotland, Wales, and Northern Ireland.",
  },
  {
    icon: Target,
    title: "Purpose-Driven",
    description:
      "Unlike casual dating apps, we focus exclusively on matrimony — helping you find a life partner, not just a date.",
  },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <Section variant="deepest" className="!py-24">
        <Container className="max-w-3xl text-center">
          <SectionLabel>About Us</SectionLabel>
          <SplitHeadline primary="About UK Matrimony" muted="since 2020" />
          <p className="mt-6 text-lg text-muted">
            Helping UK singles find their perfect life partner since 2020.
          </p>
        </Container>
      </Section>

      <Section variant="base">
        <Container className="max-w-3xl">
          <SectionLabel>Our Mission</SectionLabel>
          <h2 className="font-display text-2xl font-bold text-foreground">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-muted">
            UK Matrimony was founded with a simple mission: to provide a safe, respectful, and
            effective platform where British singles can find meaningful, lifelong partnerships. We
            understand that finding a life partner is one of the most important decisions you will
            ever make, and we are committed to supporting you every step of the way.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Our platform combines modern technology with traditional values, offering advanced search
            filters, profile verification, privacy controls, and a dedicated support team — all
            designed with the UK community in mind.
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
          <p className="mt-4 text-muted">
            With over 50,000 registered members and thousands of successful matches, UK Matrimony
            is one of the fastest-growing matrimony platforms in the United Kingdom.
          </p>
          <div className="mt-12 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
            <StatBlock value="50K+" label="Members" description="Registered UK singles" />
            <StatBlock value="5K+" label="Stories" description="Successful matches" />
            <StatBlock value="98%" label="Satisfaction" description="Member satisfaction rate" />
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
