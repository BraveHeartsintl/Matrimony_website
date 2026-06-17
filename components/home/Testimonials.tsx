import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah & David",
    location: "London",
    image: "/images/success-stories/success-sarah-david-london.png",
    text: "We found each other on UK Matrimony after just three months. The verification process gave us confidence, and the matching filters helped us connect on shared values.",
  },
  {
    name: "Anita & Raj",
    location: "Manchester",
    image: "/images/success-stories/success-anita-raj-manchester.png",
    text: "As professionals living in the UK, we wanted a platform that understood our cultural background. UK Matrimony made it easy to find someone who truly gets us.",
  },
  {
    name: "Emma & James",
    location: "Birmingham",
    image: "/images/success-stories/success-emma-james-birmingham.png",
    text: "The privacy controls and secure messaging made us feel safe throughout our journey. We're now happily married and recommend this platform to everyone.",
  },
];

export default function Testimonials() {
  return (
    <Section variant="base">
      <Container>
        <SectionLabel>Success Stories</SectionLabel>
        <SplitHeadline primary="Real Couples" muted="Real Love" />
        <p className="mt-4 text-muted">
          Hear from members who found their life partner with us
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} hover className="group relative overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={t.image}
                  alt={`${t.name} — UK Matrimony success story from ${t.location}`}
                  fill
                  className="object-cover img-bw transition-all duration-300 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <Quote className="h-8 w-8 text-muted-foreground" />
                <p className="mt-4 text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-accent">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
