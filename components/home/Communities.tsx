import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import TextCTA from "@/components/ui/TextCTA";
import { COMMUNITIES } from "@/lib/constants";
import Link from "next/link";

export default function Communities() {
  return (
    <Section variant="base">
      <Container>
        <FadeIn>
          <SectionLabel>Communities</SectionLabel>
          <SplitHeadline primary="Browse by" muted="Faith & Culture" />
          <p className="mt-4 max-w-xl text-muted">
            Whether you are looking within your faith or cultural community, we help Brit Asian
            families find compatible matches across the United Kingdom.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITIES.map((community, i) => (
            <FadeIn key={community.name} delay={i * 80} direction={i % 2 === 0 ? "up" : "scale"}>
              <Link href={`/register?religion=${encodeURIComponent(community.religion)}`}>
                <Card hover className="h-full transition-all duration-300 hover:border-accent/40">
                  <h3 className="text-lg font-semibold text-foreground">{community.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{community.description}</p>
                  <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.1em] text-accent">
                    Register Free →
                  </span>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={100}>
          <div className="mt-12 text-center">
            <TextCTA href="/register">Create Your Profile — It&apos;s Free</TextCTA>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
