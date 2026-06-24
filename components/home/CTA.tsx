import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { SITE_STATS } from "@/lib/constants";
import Link from "next/link";

export default function CTA() {
  return (
    <Section variant="deepest">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[16px] border border-white/15 bg-white/8 px-8 py-12 text-center backdrop-blur-sm">
          <SectionLabel>Get Started</SectionLabel>
          <SplitHeadline primary="Ready to Find" muted="Your Life Partner?" />
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Join {SITE_STATS.members} Brit Asian singles on the UK&apos;s dedicated matrimony
            platform. Registration is free and takes less than 5 minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Register Free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Member Login
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            GDPR compliant · ICO registered · Secure UK data hosting
          </p>
        </div>
      </Container>
    </Section>
  );
}
