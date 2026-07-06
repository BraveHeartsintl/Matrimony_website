"use client";

import { subscribeInterests } from "@/lib/firebase/services/interest.service";
import type { Interest } from "@/lib/types";
import { useEffect, useState } from "react";

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

  const sentTo = (profileId: string) =>
    interests.some((i) => i.fromUserId === userId && i.toUserId === profileId);

  const receivedCount = interests.filter((i) => i.toUserId === userId).length;

  return { interests, loading, sentTo, receivedCount };
}
