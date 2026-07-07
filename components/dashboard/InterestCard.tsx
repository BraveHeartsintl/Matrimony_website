"use client";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  acceptInterest,
  declineInterest,
  isInterestReceived,
} from "@/lib/firebase/services/interest.service";
import type { Interest } from "@/lib/types";
import { formatInterestStatus, formatRelativeTime, interestStatusBadgeVariant } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface EnrichedInterest extends Interest {
  otherUserId: string;
  otherProfileId: string;
  otherUserName: string;
  otherUserPhoto: string;
}

interface InterestCardProps {
  interest: EnrichedInterest;
  currentUserId: string;
  highlight?: boolean;
}

export default function InterestCard({
  interest,
  currentUserId,
  highlight = false,
}: InterestCardProps) {
  const [busy, setBusy] = useState(false);
  const isReceived = isInterestReceived(interest, currentUserId);
  const canRespond = isReceived && interest.status === "pending";
  const profileHref = `/search/profile?id=${encodeURIComponent(interest.otherProfileId)}&interest=${encodeURIComponent(interest.id)}`;

  return (
    <div
      className={`flex flex-col gap-3 rounded-[6px] p-4 transition-colors ${
        highlight
          ? "border-2 border-accent/40 bg-accent/5 shadow-sm"
          : "glass-subtle hover:border-accent/25 hover:bg-surface/80"
      }`}
    >
      <div className="flex items-center gap-4">
        <Link href={profileHref} className="flex min-w-0 flex-1 items-center gap-4">
          <Avatar src={interest.otherUserPhoto} name={interest.otherUserName} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{interest.otherUserName}</p>
            <p className={`text-xs ${isReceived ? "font-medium text-accent" : "text-muted"}`}>
              {isReceived ? "Sent you interest — review & approve" : "You sent interest — waiting"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatRelativeTime(interest.createdAt)}
            </p>
          </div>
        </Link>
        <Badge variant={interestStatusBadgeVariant(interest.status)}>
          {formatInterestStatus(interest.status)}
        </Badge>
      </div>

      {canRespond ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="lg"
            className="flex-1"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void acceptInterest(interest.id).finally(() => setBusy(false));
            }}
          >
            <Check className="h-4 w-4" />
            Approve Interest
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void declineInterest(interest.id).finally(() => setBusy(false));
            }}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </div>
      ) : (
        <Link href={profileHref}>
          <Button size="sm" variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      )}
    </div>
  );
}
