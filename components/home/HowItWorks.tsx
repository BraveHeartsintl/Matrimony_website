import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { Heart, Search, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Register for free and build a detailed profile with photos, preferences, and personal details.",
  },
  {
    icon: Search,
    title: "Search & Connect",
    description:
      "Use advanced filters to find compatible matches across the UK and send interests to profiles you like.",
  },
  {
    icon: Heart,
    title: "Start Your Journey",
    description:
      "Chat with mutual matches, get to know each other, and take the next step towards a lifelong partnership.",
  },
];

export default function HowItWorks() {
  return (
    <Section variant="surface">
      <Container>
        <SectionLabel>Simple Process</SectionLabel>
        <SplitHeadline primary="How It Works" muted="in three simple steps" />
        <p className="mt-4 max-w-xl text-muted">
          Three simple steps to find your life partner
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} hover className="relative text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[6px] glass-subtle">
                <step.icon className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-accent">
                Step {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
