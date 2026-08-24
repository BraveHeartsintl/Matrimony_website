"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import Image from "next/image";
import Link from "next/link";

export default function MatchStats() {
  const { session } = useAuth();
  const { stats } = usePlatformContent();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero/wedding-ceremony.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_28%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,16,48,0.58)_0%,rgba(0,16,48,0.42)_45%,rgba(0,16,48,0.64)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(0,16,48,0.22)_0%,rgba(0,16,48,0.5)_100%)]" />
      </div>
      <Container className="relative z-10 py-16 text-center lg:py-24">
        <FadeIn direction="scale">
          <div className="glass-floating mx-auto max-w-3xl rounded-[20px] px-5 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Your story is waiting to happen
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground lg:text-5xl">
              Over {stats.members} UK&apos;s Indian Matches
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Real couples. Real families. Real weddings — all starting with a single profile on
              UK Matrimony.
            </p>
            <div className="mt-8">
              {session ? (
                <Link href="/search">
                  <Button size="lg">Find Your Match — Search Profiles</Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg">Get Started — Register Free</Button>
                </Link>
              )}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
