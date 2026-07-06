"use client";

import { applyClientSearchFilters, fetchSearchProfiles } from "@/lib/firebase/services/search.service";
import type { SearchFilters } from "@/lib/search-filters";
import type { SearchProfile } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useSearchProfiles(excludeUserId?: string, filters?: SearchFilters) {
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await fetchSearchProfiles(excludeUserId);
      if (filters) {
        data = applyClientSearchFilters(data, filters);
      }
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profiles");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [excludeUserId, filters]);

  useEffect(() => {
    void load();
  }, [load]);

  return { profiles, loading, error, reload: load };
}
