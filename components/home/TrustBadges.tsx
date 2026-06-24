import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { Heart, Lock, ShieldCheck, Sparkles } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Verified Profiles",
    desc: "Every profile is manually reviewed and ID-verified for authenticity",
  },
  {
    icon: Lock,
    title: "100% Privacy",
    desc: "You control who sees your photos, contact details, and personal information",
  },
  {
    icon: Sparkles,
    title: "Best Matches",
    desc: "Smart filters and compatibility scoring to surface the most suitable partners",
  },
  {
    icon: Heart,
    title: "Trusted by Thousands",
    desc: "50,000+ Brit Asian members across England, Scotland, Wales & Northern Ireland",
  },
];

export default function TrustBadges() {
  return (
    <Section variant="surface">
      <Container>
        <SectionLabel>Why UK Matrimony</SectionLabel>
        <SplitHeadline primary="Built on Trust" muted="Privacy & Safety" />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <Card key={badge.title} hover>
              <div className="flex h-12 w-12 items-center justify-center rounded-[6px] glass-subtle">
                <badge.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{badge.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{badge.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
