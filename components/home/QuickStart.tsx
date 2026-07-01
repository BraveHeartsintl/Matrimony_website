import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import { SITE_STATS } from "@/lib/constants";
import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function QuickStart() {
  return (
    <Section variant="surface" className="!py-16 lg:!py-20">
      <Container>
        <FadeIn>
          <div className="glass-floating glass-shimmer overflow-hidden rounded-[16px]">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                  Get Started Today
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-foreground lg:text-4xl">
                  Find your Special Someone
                </h2>
                <p className="mt-4 max-w-md text-muted">
                  Create your free matrimony profile in under 5 minutes. Join{" "}
                  {SITE_STATS.members} Brit Asian singles already searching for their life
                  partner on the UK&apos;s dedicated matchmaking platform.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Free Profile
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Member Login
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="glass-subtle border-t border-accent/10 p-8 lg:border-l lg:border-t-0 lg:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.1em] text-accent">
                  What you get for free
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "Create and publish your matrimony profile",
                    "Browse verified Brit Asian profiles across the UK",
                    "Send interests to profiles you like",
                    "Receive match recommendations based on your preferences",
                  ].map((item, i) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-muted"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
