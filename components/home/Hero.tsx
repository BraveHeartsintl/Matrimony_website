import Button from "@/components/ui/Button";
import { Shield, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522673605300-5194acf4ebd4?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#3d0f1f] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 opacity-[0.07] pattern-dots" />
      <div className="absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            Trusted UK Matrimony Platform
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Find Your Perfect Match in the{" "}
            <span className="text-accent">United Kingdom</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Join thousands of UK singles who have found meaningful relationships through our
            secure, verified matrimony platform. Your journey to forever starts here.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register">
              <Button variant="accent" size="lg" className="shadow-lg shadow-accent/25">
                Register Free
              </Button>
            </Link>
            <Link href="#featured-profiles">
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white hover:text-primary"
              >
                Browse Profiles
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold">50,000+</p>
                <p className="text-sm text-white/60">UK Members</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold">GDPR</p>
                <p className="text-sm text-white/60">Compliant & Secure</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="grid grid-cols-3 gap-4">
            {HERO_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20 ${
                  i === 1 ? "mt-8" : i === 2 ? "mt-4" : ""
                }`}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={src}
                    alt="Happy couple"
                    fill
                    className="object-cover"
                    sizes="200px"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-md">
            <p className="text-center text-sm font-medium">
              <span className="text-accent font-bold">5,000+</span> Success Stories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
