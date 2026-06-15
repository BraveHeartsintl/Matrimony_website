"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { SearchProfile } from "@/lib/types";
import { formatBodyType, formatMaritalStatus } from "@/lib/utils";
import { Heart, MapPin, Ruler, ShieldCheck, Weight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfileCardProps {
  profile: SearchProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [interested, setInterested] = useState(false);

  return (
    <div className="card-hover overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={profile.photos[0]}
          alt={profile.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {profile.verified && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-display text-lg font-bold">
            {profile.name}, {profile.age}
          </h3>
          <div className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted">{profile.religion} &middot; {profile.education}</p>
        {(profile.heightCm > 0 || profile.weightKg > 0) && (
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
            {profile.bodyType && (
              <span>{formatBodyType(profile.bodyType)}</span>
            )}
          </div>
        )}
        <p className="mt-2 line-clamp-2 text-sm text-muted">{profile.bio}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge>{profile.occupation}</Badge>
          <Badge variant="accent">{formatMaritalStatus(profile.maritalStatus)}</Badge>
        </div>

        <Button
          size="sm"
          variant={interested ? "secondary" : "primary"}
          className="mt-4 w-full"
          onClick={() => setInterested(!interested)}
        >
          <Heart className={`h-4 w-4 ${interested ? "fill-white" : ""}`} />
          {interested ? "Interest Sent" : "Send Interest"}
        </Button>
      </div>
    </div>
  );
}
