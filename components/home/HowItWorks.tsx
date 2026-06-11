import Card from "@/components/ui/Card";
import { Heart, Search, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Register for free and build a detailed profile with photos, preferences, and personal details.",
    color: "from-primary to-primary-dark",
  },
  {
    icon: Search,
    title: "Search & Connect",
    description:
      "Use advanced filters to find compatible matches across the UK and send interests to profiles you like.",
    color: "from-rose-500 to-primary",
  },
  {
    icon: Heart,
    title: "Start Your Journey",
    description:
      "Chat with mutual matches, get to know each other, and take the next step towards a lifelong partnership.",
    color: "from-accent to-amber-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Simple Process</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted">Three simple steps to find your life partner</p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-14 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {steps.map((step, i) => (
            <Card key={step.title} className="card-hover relative text-center">
              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
              >
                <step.icon className="h-8 w-8" />
              </div>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
