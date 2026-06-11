import Card from "@/components/ui/Card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & David",
    location: "London",
    text: "We found each other on UK Matrimony after just three months. The verification process gave us confidence, and the matching filters helped us connect on shared values.",
  },
  {
    name: "Anita & Raj",
    location: "Manchester",
    text: "As professionals living in the UK, we wanted a platform that understood our cultural background. UK Matrimony made it easy to find someone who truly gets us.",
  },
  {
    name: "Emma & James",
    location: "Birmingham",
    text: "The privacy controls and secure messaging made us feel safe throughout our journey. We're now happily married and recommend this platform to everyone.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-background to-card px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Success Stories</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Real Couples, Real Love
          </h2>
          <p className="mt-3 text-muted">Hear from members who found their life partner with us</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="card-hover relative">
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="mt-4 text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-muted">{t.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
