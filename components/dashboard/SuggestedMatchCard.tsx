import MatchScoreDisplay from "@/components/matchmaking/MatchScoreDisplay";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getProfilePhotoUrl } from "@/lib/profile-photos";
import type { MatchScoreResult } from "@/lib/matchmaking/calculateMatchScore";
import type { SearchProfile } from "@/lib/types";
import { Heart, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface SuggestedMatchCardProps {
  profile: SearchProfile;
  matchResult?: MatchScoreResult;
}

export default function SuggestedMatchCard({ profile, matchResult }: SuggestedMatchCardProps) {
  return (
    <div className="group flex min-w-[220px] flex-col rounded-[6px] glass p-4 transition-colors hover:border-border-hover sm:min-w-[240px]">
      <div className="relative mx-auto">
        <Avatar src={getProfilePhotoUrl(profile)} name={profile.name} size="xl" />
        {profile.verified && (
          <div className="absolute -bottom-1 -right-1 rounded-full glass p-0.5">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h4 className="font-semibold text-foreground">
          {profile.name}, {profile.age}
        </h4>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3" />
          {profile.location}
        </div>
        <Badge className="mt-2" variant="accent">
          {profile.religion}
        </Badge>
        {matchResult && <MatchScoreDisplay result={matchResult} className="mt-3 text-left" />}
      </div>

      <Link href={`/search/profile?id=${profile.id}`} className="mt-4">
        <Button size="sm" variant="outline" className="w-full">
          <Heart className="h-3.5 w-3.5" />
          View Profile
        </Button>
      </Link>
    </div>
  );
}
