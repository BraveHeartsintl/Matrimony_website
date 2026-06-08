import PublicLayout from "@/components/layout/PublicLayout";
import Card from "@/components/ui/Card";
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
      <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold">About UK Matrimony</h1>
          <p className="mt-4 text-lg text-white/80">
            Helping UK singles find their perfect life partner since 2020.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold">Our Mission</h2>
          <p className="mt-4 text-muted leading-relaxed">
            UK Matrimony was founded with a simple mission: to provide a safe, respectful, and
            effective platform where British singles can find meaningful, lifelong partnerships. We
            understand that finding a life partner is one of the most important decisions you will
            ever make, and we are committed to supporting you every step of the way.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Our platform combines modern technology with traditional values, offering advanced search
            filters, profile verification, privacy controls, and a dedicated support team — all
            designed with the UK community in mind.
          </p>
        </div>
      </section>

      <section className="bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-2xl font-bold">Our Values</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title}>
                <v.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold">Trusted by Thousands</h2>
          <p className="mt-4 text-muted">
            With over 50,000 registered members and thousands of successful matches, UK Matrimony
            is one of the fastest-growing matrimony platforms in the United Kingdom.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">5K+</p>
              <p className="text-sm text-muted">Success Stories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
