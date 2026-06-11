import Button from "@/components/ui/Button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-[#3d0f1f] px-8 py-16 text-center text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10 pattern-dots" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Heart className="h-7 w-7 fill-accent text-accent" />
          </div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to Find Your Life Partner?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join UK Matrimony today — registration is free and takes less than 5 minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button variant="accent" size="lg" className="shadow-lg shadow-accent/30">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white hover:text-primary"
              >
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
