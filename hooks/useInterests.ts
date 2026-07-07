"use client";

import {
  isSameMemberId,
  subscribeInterests,
} from "@/lib/firebase/services/interest.service";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import type { Interest } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

function matchesProfile(interest: Interest, userId: string, profileId: string): boolean {
  const resolved = resolveProfileId(profileId);
  return (
    (isSameMemberId(interest.fromUserId, userId) &&
      resolveProfileId(interest.toUserId) === resolved) ||
    (isSameMemberId(interest.toUserId, userId) &&
      resolveProfileId(interest.fromUserId) === resolved)
  );
}

export function useInterests(userId: string | undefined) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setInterests([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeInterests(userId, (data) => {
      setInterests(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const sentTo = useCallback(
    (profileId: string) =>
      interests.some(
        (i) =>
          isSameMemberId(i.fromUserId, userId ?? "") &&
          resolveProfileId(i.toUserId) === resolveProfileId(profileId)
      ),
    [interests, userId]
  );

  const interestById = useCallback(
    (interestId: string): Interest | undefined => interests.find((i) => i.id === interestId),
    [interests]
  );

  const interestForProfile = useCallback(
    (profileId: string): Interest | undefined => {
      if (!userId) return undefined;
      return interests.find((i) => matchesProfile(i, userId, profileId));
    },
    [interests, userId]
  );

  const receivedCount = interests.filter((i) => isSameMemberId(i.toUserId, userId ?? "")).length;

  return { interests, loading, sentTo, interestForProfile, interestById, receivedCount };
}
