import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { Crown, MessageCircle, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    subtitle: "Create your matrimony profile",
    description:
      "Register for free and build a detailed profile with photos, family background, preferences, and what you are looking for in a life partner.",
  },
  {
    icon: MessageCircle,
    title: "Connect",
    subtitle: "Select & connect with matches",
    description:
      "Browse verified Brit Asian profiles across the UK. Use advanced filters by city, faith, education, and profession — then send interests to profiles you like.",
  },
  {
    icon: Crown,
    title: "Interact",
    subtitle: "Start meaningful conversations",
    description:
      "Become a premium member to unlock messaging, view contact details, and start conversations with mutual matches who share your values.",
  },
];

export default function HowItWorks() {
  return (
    <Section variant="surface">
      <Container>
        <SectionLabel>How It Works</SectionLabel>
        <SplitHeadline primary="Three Simple Steps" muted="to find your life partner" />
        <p className="mt-4 max-w-xl text-muted">
          From profile creation to your first conversation — we make Brit Asian matchmaking
          straightforward, secure, and respectful.
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
              <p className="mt-1 text-sm font-medium text-accent/80">{step.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
