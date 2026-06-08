import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { SearchProfile } from "@/lib/types";
import { Heart, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface SuggestedMatchCardProps {
  profile: SearchProfile;
}

export default function SuggestedMatchCard({ profile }: SuggestedMatchCardProps) {
  return (
    <div className="group flex min-w-[220px] flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:min-w-[240px]">
      <div className="relative mx-auto">
        <div className="rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
          <div className="rounded-full bg-card p-0.5">
            <Avatar src={profile.photos[0]} name={profile.name} size="xl" />
          </div>
        </div>
        {profile.verified && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-0.5">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h4 className="font-semibold">
          {profile.name}, {profile.age}
        </h4>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3" />
          {profile.location}
        </div>
        <Badge className="mt-2" variant="accent">
          {profile.religion}
        </Badge>
      </div>

      <Link href="/search" className="mt-4">
        <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
          <Heart className="h-3.5 w-3.5" />
          View Profile
        </Button>
      </Link>
    </div>
  );
}
