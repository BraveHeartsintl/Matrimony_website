import Button from "@/components/ui/Button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-8 py-12 text-center text-white">
        <h2 className="font-display text-3xl font-bold">Ready to Find Your Life Partner?</h2>
        <p className="mt-3 text-white/80">
          Join UK Matrimony today — registration is free and takes less than 5 minutes.
        </p>
        <div className="mt-8">
          <Link href="/register">
            <Button variant="accent" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
