"use client";

import { subscribeFavorites } from "@/lib/firebase/services/favorite.service";
import { useEffect, useState } from "react";

export function useFavorites(userId: string | undefined) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeFavorites(userId, (ids) => {
      setFavoriteIds(ids);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  return { favoriteIds, loading, isFavorite: (profileId: string) => favoriteIds.includes(profileId) };
}
