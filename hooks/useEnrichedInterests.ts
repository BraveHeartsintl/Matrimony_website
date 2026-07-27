"use client";

import type { EnrichedInterest } from "@/components/dashboard/InterestCard";
import { useInterests } from "@/hooks/useInterests";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";
import { isInterestReceived, isSameMemberId } from "@/lib/firebase/services/interest.service";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import { getProfilePhotoUrl } from "@/lib/profile-photos";
import { useMemo } from "react";

export function useEnrichedInterests(userId: string | undefined) {
  const { interests, loading: interestsLoading } = useInterests(userId);
  const { profiles: allProfiles, loading: profilesLoading } = useSearchProfiles(userId);

  const profilesByUserId = useMemo(
    () => new Map(allProfiles.map((p) => [p.userId, p])),
    [allProfiles]
  );

  const interestsEnriched = useMemo((): EnrichedInterest[] => {
    if (!userId) return [];
    return interests.map((interest) => {
      const isReceived = isInterestReceived(interest, userId);
      const otherUserId = isSameMemberId(interest.fromUserId, userId)
        ? interest.toUserId
        : interest.fromUserId;
      const resolvedOtherId = resolveProfileId(otherUserId);
      const other =
        profilesByUserId.get(otherUserId) ??
        profilesByUserId.get(resolvedOtherId) ??
        allProfiles.find((p) => p.id === otherUserId || p.id === resolvedOtherId);
      return {
        ...interest,
        otherUserId,
        otherProfileId: other?.id ?? resolvedOtherId,
        otherUserName:
          other?.name ??
          (isReceived ? interest.fromUserName : interest.toUserName) ??
          "Member",
        otherUserPhoto:
          getProfilePhotoUrl(other ?? {}) ??
          (isReceived ? interest.fromUserPhoto : interest.toUserPhoto) ??
          "",
      };
    });
  }, [interests, userId, profilesByUserId, allProfiles]);

  const received = useMemo(
    () => interestsEnriched.filter((i) => isInterestReceived(i, userId ?? "")),
    [interestsEnriched, userId]
  );

  const sent = useMemo(
    () => interestsEnriched.filter((i) => !isInterestReceived(i, userId ?? "")),
    [interestsEnriched, userId]
  );

  const pendingReceived = useMemo(
    () => received.filter((i) => i.status === "pending"),
    [received]
  );

  return {
    interestsEnriched,
    received,
    sent,
    pendingReceived,
    loading: interestsLoading || profilesLoading,
  };
}
