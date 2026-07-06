"use client";

import MatchScoreDisplay from "@/components/matchmaking/MatchScoreDisplay";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useInterests } from "@/hooks/useInterests";
import { toggleFavoriteRemote } from "@/lib/firebase/services/favorite.service";
import { sendInterest } from "@/lib/firebase/services/interest.service";
import { canAccess } from "@/lib/onboarding/access";
import { DEFAULT_PROFILE_PHOTO } from "@/lib/constants";
import type { MatchScoreResult } from "@/lib/matchmaking/calculateMatchScore";
import type { OnboardingStatus, SearchProfile } from "@/lib/types";
import { formatBodyType, formatMaritalStatus } from "@/lib/utils";
import { Bookmark, Heart, MapPin, Ruler, ShieldCheck, Weight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProfileCardProps {
  profile: SearchProfile;
  matchResult?: MatchScoreResult;
  onboardingStatus?: OnboardingStatus;
}

export default function ProfileCard({
  profile,
  matchResult,
  onboardingStatus = "basic_registered",
}: ProfileCardProps) {
  const { session } = useAuth();
  const { favoriteIds } = useFavorites(session?.user.id);
  const { sentTo } = useInterests(session?.user.id);
  const [busy, setBusy] = useState(false);

  const favorited = favoriteIds.includes(profile.id);
  const interested = sentTo(profile.id);

  const canSendInterest = canAccess(onboardingStatus, "send_interest");
  const canSaveFavorites = canAccess(onboardingStatus, "save_favorites");
  const showMatchScore = canAccess(onboardingStatus, "ai_compatibility_score") && matchResult;

  const handleFavorite = async () => {
    if (!session || !canSaveFavorites || busy) return;
    setBusy(true);
    try {
      await toggleFavoriteRemote(session.user.id, profile.id, favoriteIds);
    } finally {
      setBusy(false);
    }
  };

  const handleInterest = async () => {
    if (!session || !canSendInterest || interested || busy) return;
    setBusy(true);
    try {
      await sendInterest(session.user.id, profile.id, {
        toUserName: profile.name,
        toUserPhoto: profile.photos[0],
        fromUserName: session.user.name,
        fromUserPhoto: session.profile.photos[0],
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass glass-hover overflow-hidden rounded-[14px] shadow-sm transition-all hover:shadow-md">
      <Link href={`/search/profile?id=${profile.id}`} className="group block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={profile.photos[0] || DEFAULT_PROFILE_PHOTO}
            alt={profile.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepest/80 via-deepest/25 to-transparent" />
          {showMatchScore && <MatchScoreDisplay result={matchResult} overlay />}
          {profile.verified && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-display text-lg font-bold text-white">
              {profile.name}, {profile.age}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </div>
          </div>
        </div>

        <div className="p-4">
          {showMatchScore && (
            <MatchScoreDisplay result={matchResult} className="mb-3" showBadge={false} />
          )}
          <p className="text-xs text-muted">
            {profile.religion}
            {onboardingStatus !== "basic_registered" && (
              <> &middot; {profile.education}</>
            )}
          </p>
          {onboardingStatus !== "basic_registered" && (profile.heightCm > 0 || profile.weightKg > 0) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
              {profile.heightCm > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" />
                  {profile.heightCm} cm
                </span>
              )}
              {profile.weightKg > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5" />
                  {profile.weightKg} kg
                </span>
              )}
              {profile.bodyType && <span>{formatBodyType(profile.bodyType)}</span>}
            </div>
          )}
          {onboardingStatus !== "basic_registered" && (
            <p className="mt-2 line-clamp-2 text-sm text-muted">{profile.bio}</p>
          )}

          {onboardingStatus !== "basic_registered" && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge>{profile.occupation}</Badge>
              <Badge variant="accent">{formatMaritalStatus(profile.maritalStatus)}</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="border-t border-accent/8 px-4 pb-4">
        <div className="mt-4 flex gap-2">
          {canSaveFavorites && (
            <Button
              size="sm"
              variant={favorited ? "secondary" : "outline"}
              onClick={() => void handleFavorite()}
              disabled={busy}
              className="shrink-0"
            >
              <Bookmark className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
            </Button>
          )}
          <Button
            size="sm"
            variant={interested ? "secondary" : "primary"}
            className="flex-1"
            disabled={!canSendInterest || busy}
            onClick={() => void handleInterest()}
          >
            <Heart className={`h-4 w-4 ${interested ? "fill-current" : ""}`} />
            {!canSendInterest
              ? "Complete profile to send interest"
              : interested
                ? "Interest Sent"
                : "Send Interest"}
          </Button>
        </div>
      </div>
    </div>
  );
}
