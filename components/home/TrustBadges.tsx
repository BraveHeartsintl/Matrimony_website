import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { Lock, ShieldCheck, Star, Users } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Verified Profiles",
    desc: "Manual profile verification for authenticity",
  },
  {
    icon: Lock,
    title: "Privacy Controls",
    desc: "You control who sees your photos and contact info",
  },
  {
    icon: Users,
    title: "UK Community",
    desc: "Members from England, Scotland, Wales & NI",
  },
  {
    icon: Star,
    title: "Premium Support",
    desc: "Dedicated customer support for all members",
  },
];

export default function TrustBadges() {
  return (
    <Section variant="surface">
      <Container>
        <SectionLabel>Why Choose Us</SectionLabel>
        <SplitHeadline primary="Built on Trust" muted="& Safety" />

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
