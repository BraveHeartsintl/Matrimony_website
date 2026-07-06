"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import Link from "next/link";

export default function MatchStats() {
  const { stats } = usePlatformContent();

  return (
    <section className="relative overflow-hidden border-y border-accent/15 bg-gradient-to-r from-accent-soft via-gold-soft to-accent-soft py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(177,139,103,0.12)_0%,transparent_70%)]" />
      <Container className="relative text-center">
        <FadeIn direction="scale">
          <div className="glass-floating mx-auto max-w-3xl rounded-[20px] px-8 py-12 lg:px-16 lg:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Your story is waiting to happen
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground lg:text-5xl">
              Over {stats.matches} Brit Asian Matches
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Real couples. Real families. Real weddings — all starting with a single profile on
              UK Matrimony.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg">Get Started — Register Free</Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
