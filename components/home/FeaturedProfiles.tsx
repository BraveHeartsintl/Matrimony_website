import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import { MapPin } from "lucide-react";
import Link from "next/link";

const featured = MOCK_PROFILES.slice(0, 4);

export default function FeaturedProfiles() {
  return (
    <section className="bg-card px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Featured Profiles</h2>
          <p className="mt-3 text-muted">Discover verified members from across the UK</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((profile) => (
            <Card key={profile.id} padding="sm" className="text-center">
              <div className="mx-auto">
                <Avatar src={profile.photos[0]} name={profile.name} size="xl" />
              </div>
              <h3 className="mt-3 font-semibold">
                {profile.name}, {profile.age}
              </h3>
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </div>
              <p className="mt-1 text-xs text-muted">{profile.occupation}</p>
              {profile.verified && (
                <Badge variant="success" className="mt-2">
                  Verified
                </Badge>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="text-sm font-medium text-primary hover:underline"
          >
            Register to view all profiles &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
