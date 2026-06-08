import Card from "@/components/ui/Card";
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
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted">Three simple steps to find your life partner</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-accent">Step {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
