"use client";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { SearchProfile } from "@/lib/types";
import { Heart, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ProfileCardProps {
  profile: SearchProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [interested, setInterested] = useState(false);

  return (
    <Card padding="sm" className="flex flex-col">
      <div className="flex items-start gap-4">
        <Avatar src={profile.photos[0]} name={profile.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">
              {profile.name}, {profile.age}
            </h3>
            {profile.verified && <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </div>
          <p className="mt-0.5 text-xs text-muted">{profile.religion} &middot; {profile.education}</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted">{profile.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{profile.occupation}</Badge>
        <Badge variant="accent">{profile.maritalStatus.replace("_", " ")}</Badge>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant={interested ? "secondary" : "primary"}
          className="flex-1"
          onClick={() => setInterested(!interested)}
        >
          <Heart className={`h-4 w-4 ${interested ? "fill-white" : ""}`} />
          {interested ? "Interest Sent" : "Send Interest"}
        </Button>
      </div>
    </Card>
  );
}
