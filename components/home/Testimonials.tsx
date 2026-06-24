import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Priya & Arjun",
    location: "London",
    community: "Hindu",
    image: "/images/success-stories/success-sarah-david-london.png",
    text: "We both grew up in London with Indian heritage and wanted someone who understood our culture and British upbringing. UK Matrimony made that possible — we matched within two months and married last summer.",
  },
  {
    name: "Simran & Harpreet",
    location: "Leicester",
    community: "Sikh",
    image: "/images/success-stories/success-anita-raj-manchester.png",
    text: "Our families were involved from the start, which mattered to us. The platform's verification and privacy controls gave both families confidence. We couldn't be happier with our Anand Karaj.",
  },
  {
    name: "Fatima & Omar",
    location: "Birmingham",
    community: "Muslim",
    image: "/images/success-stories/success-emma-james-birmingham.png",
    text: "As British Muslims, we needed a halal platform that respected our values. UK Matrimony connected us with serious, like-minded people. Alhamdulillah, we found each other here.",
  },
];

export default function Testimonials() {
  return (
    <Section variant="base">
      <Container>
        <SectionLabel>Success Stories</SectionLabel>
        <SplitHeadline primary="Real Couples" muted="Real Weddings" />
        <p className="mt-4 text-muted">
          Hear from Brit Asian couples who found their life partner through UK Matrimony
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} hover className="group relative overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={t.image}
                  alt={`${t.name} — UK Matrimony success story from ${t.location}`}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d1228]/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  {t.community}
                </span>
              </div>
              <div className="p-8">
                <Quote className="h-8 w-8 text-muted-foreground" />
                <p className="mt-4 text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-accent">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}, UK</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
