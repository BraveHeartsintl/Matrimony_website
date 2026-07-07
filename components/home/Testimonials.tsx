"use client";

import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import { Quote } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
  const { testimonials } = usePlatformContent();

  if (testimonials.length === 0) return null;

  return (
    <Section variant="base">
      <Container>
        <FadeIn>
          <SectionLabel>Success Stories</SectionLabel>
          <SplitHeadline primary="Real Couples" muted="Real Weddings" />
          <p className="mt-4 text-muted">
            Hear from UK's Indian couples who found their life partner through UK Matrimony
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 120} direction={i === 1 ? "scale" : "up"}>
              <Card hover className="group relative h-full overflow-hidden p-0">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={`${t.name} — UK Matrimony success story from ${t.location}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deepest/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full glass-pill px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
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
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
