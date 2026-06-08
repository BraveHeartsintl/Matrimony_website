import Button from "@/components/ui/Button";
import { Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-accent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            Trusted UK Matrimony Platform
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Find Your Perfect Match in the United Kingdom
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Join thousands of UK singles who have found meaningful relationships through our
            secure, verified matrimony platform. Your journey to forever starts here.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register">
              <Button variant="accent" size="lg">
                Register Free
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Browse Profiles
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <span>50,000+ UK Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>GDPR Compliant & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
