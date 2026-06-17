import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import Link from "next/link";

export default function CTA() {
  return (
    <Section variant="deepest">
      <Container>
        <div className="glass-strong mx-auto max-w-3xl rounded-[12px] border border-accent/20 px-8 py-12 text-center">
          <SectionLabel>Get Started</SectionLabel>
          <SplitHeadline primary="Ready to Find" muted="Your Life Partner?" />
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Join UK Matrimony today — registration is free and takes less than 5 minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
