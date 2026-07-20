"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  const { stats } = usePlatformContent();

  return (
    <section className="cta-banner relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero/christian-wedding.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="cta-banner-veil absolute inset-0" />
      </div>

      <Container className="relative z-10 py-16 sm:py-20 lg:py-28">
        <FadeIn direction="scale">
          <div className="cta-glass auth-glass-shine mx-auto w-full max-w-3xl rounded-[1.25rem] px-6 py-10 text-center sm:rounded-[1.5rem] sm:px-10 sm:py-12 lg:px-16 lg:py-16">
            <div className="relative z-[1]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Get Started
              </p>

              <div className="mt-4">
                <SplitHeadline
                  as="h2"
                  className="text-3xl leading-tight sm:text-4xl lg:text-5xl"
                  primary="Ready to Find"
                  muted="Your Life Partner?"
                />
              </div>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
                Join {stats.members} UK&apos;s Indian singles on the UK&apos;s dedicated
                matrimony platform. Registration is free and takes less than 5 minutes.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link href="/register" className="sm:inline-flex">
                  <Button size="lg" className="w-full sm:w-auto">
                    Register Free
                  </Button>
                </Link>
                <Link href="/login" className="sm:inline-flex">
                  <Button
                    variant="outline"
                    size="lg"
                    className="cta-ghost-btn w-full sm:w-auto"
                  >
                    Member Login
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-xs tracking-wide text-white/55">
                GDPR compliant · ICO registered · Secure UK data hosting
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
