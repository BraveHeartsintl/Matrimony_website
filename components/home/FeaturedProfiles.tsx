import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import { MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featured = MOCK_PROFILES.slice(0, 4);

export default function FeaturedProfiles() {
  return (
    <section id="featured-profiles" className="scroll-mt-20 bg-card px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Discover</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Featured Profiles</h2>
          <p className="mt-3 text-muted">Verified members from across the United Kingdom</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((profile) => (
            <div
              key={profile.id}
              className="card-hover group overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={profile.photos[0]}
                  alt={profile.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {profile.verified && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-display text-lg font-bold">
                    {profile.name}, {profile.age}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted">{profile.occupation}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge>{profile.religion}</Badge>
                  <Badge variant="accent">{profile.education}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/register">
            <Button size="lg" variant="primary">
              Register to View All Profiles
            </Button>
          </Link>
          <p className="mt-3 text-sm text-muted">
            Already a member?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
