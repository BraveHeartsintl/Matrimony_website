import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { UK_REGIONS } from "@/lib/constants";
import { MapPin } from "lucide-react";

export default function UKCoverage() {
  return (
    <Section variant="surface">
      <Container>
        <FadeIn>
          <SectionLabel>UK Coverage</SectionLabel>
          <SplitHeadline primary="Members Across" muted="the United Kingdom" />
          <p className="mt-4 max-w-xl text-muted">
            From London to Glasgow, Birmingham to Bradford — connect with verified Brit Asian
            singles in every major UK city.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UK_REGIONS.map((region, i) => (
            <FadeIn key={region.city} delay={i * 60} direction="scale">
              <div className="glass glass-hover flex items-center justify-between rounded-[10px] px-5 py-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-medium text-foreground">{region.city}</span>
                </div>
                <span className="text-xs font-medium text-muted">{region.members}</span>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={100}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Also serving Cardiff, Belfast, Coventry, Sheffield, Bristol, Nottingham & more
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}
