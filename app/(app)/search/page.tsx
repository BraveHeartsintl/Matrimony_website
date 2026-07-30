"use client";

import ActiveFilters from "@/components/search/ActiveFilters";
import FilterPanel from "@/components/search/FilterPanel";
import ProfileCard from "@/components/search/ProfileCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";
import { calculateMatchScore } from "@/lib/matchmaking/calculateMatchScore";
import { canAccess } from "@/lib/onboarding/access";
import { applyClientSearchFilters } from "@/lib/firebase/services/search.service";
import {
  DEFAULT_SEARCH_FILTERS,
  initialSearchFilters,
  normalizeFilters,
  type SearchFilters,
} from "@/lib/search-filters";
import { partnerGenderFilterForProfile } from "@/lib/matchmaking";
import { SlidersHorizontal, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const LIMITED_MATCH_COUNT = 5;

function filtersEqual(a: SearchFilters, b: SearchFilters): boolean {
  return JSON.stringify(normalizeFilters(a)) === JSON.stringify(normalizeFilters(b));
}

function SearchPageContent() {
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const status = session?.profile.onboardingStatus ?? "basic_registered";
  const canUseFilters =
    canAccess(status, "advanced_search_limited") || canAccess(status, "advanced_search_full");
  const canSeeMatchScore = canAccess(status, "ai_compatibility_score");
  const isLimitedBrowse = status === "basic_registered";

  const [draft, setDraft] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [applied, setApplied] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { profiles: allProfiles, loading, error, reload } = useSearchProfiles(session?.user.id);

  const filterMode = canAccess(status, "advanced_search_full")
    ? "full"
    : canAccess(status, "advanced_search_limited")
      ? "limited"
      : "none";

  useEffect(() => {
    if (!session || initialized) return;

    const location = searchParams.get("location")?.trim() ?? "";

    if (filterMode === "none") {
      const browseFilters: SearchFilters = {
        ...DEFAULT_SEARCH_FILTERS,
        gender: partnerGenderFilterForProfile(session.profile),
        ...(location ? { location } : {}),
      };
      setDraft(browseFilters);
      setApplied(browseFilters);
      setInitialized(true);
      return;
    }

    const browseFilters = initialSearchFilters(session.profile, filterMode, location);
    setDraft(browseFilters);
    setApplied(browseFilters);
    setInitialized(true);
  }, [session, initialized, searchParams, filterMode]);

  const previewResults = useMemo(
    () => applyClientSearchFilters(allProfiles, draft),
    [allProfiles, draft]
  );

  const results = useMemo(() => {
    const filtered = applyClientSearchFilters(allProfiles, applied);
    return isLimitedBrowse ? filtered.slice(0, LIMITED_MATCH_COUNT) : filtered;
  }, [allProfiles, applied, isLimitedBrowse]);

  const scoredResults = useMemo(
    () =>
      session && canSeeMatchScore
        ? results.map((profile) => ({
            profile,
            match: calculateMatchScore(session.profile, profile),
          }))
        : results.map((profile) => ({ profile, match: undefined })),
    [results, session, canSeeMatchScore]
  );
  const hasPendingChanges = !filtersEqual(draft, applied);

  const applyFilters = () => {
    const normalized = normalizeFilters(draft);
    setDraft(normalized);
    setApplied(normalized);
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    if (!session) {
      setDraft(DEFAULT_SEARCH_FILTERS);
      setApplied(DEFAULT_SEARCH_FILTERS);
      setMobileFiltersOpen(false);
      return;
    }

    const resetTo =
      filterMode === "none"
        ? {
            ...DEFAULT_SEARCH_FILTERS,
            gender: partnerGenderFilterForProfile(session.profile),
          }
        : initialSearchFilters(session.profile, filterMode);

    setDraft(resetTo);
    setApplied(resetTo);
    setMobileFiltersOpen(false);
  };

  const updateApplied = (filters: SearchFilters) => {
    setApplied(filters);
    setDraft(filters);
  };

  const preferredGenderLabel = (() => {
    if (!session) return "";
    const gender = partnerGenderFilterForProfile(session.profile);
    if (!gender) return "";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  })();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-[6px] glass p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Search Profiles</h1>
            <p className="mt-1 text-muted">Find compatible matches across the United Kingdom</p>
            {isLimitedBrowse && (
              <p className="mt-2 text-sm text-accent">
                Showing up to {LIMITED_MATCH_COUNT} preview matches. Complete your profile for full
                search and compatibility scores.
              </p>
            )}
          </div>
          {canUseFilters && (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasPendingChanges && (
                <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-white">
                  !
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="hidden lg:col-span-1 lg:block">
          {canUseFilters ? (
            <FilterPanel
              draft={draft}
              onDraftChange={setDraft}
              onApply={applyFilters}
              onReset={resetFilters}
              previewCount={previewResults.length}
              appliedCount={results.length}
              hasPendingChanges={hasPendingChanges}
              filterMode={filterMode}
            />
          ) : (
            <div className="sticky top-4 rounded-[14px] border border-accent/10 bg-surface p-6 text-center">
              <Lock className="mx-auto h-8 w-8 text-accent" />
              <p className="mt-3 text-sm font-medium">Advanced filters locked</p>
              <p className="mt-1 text-xs text-muted">
                Complete your profile to unlock search filters.
              </p>
              <Link href="/onboarding/profile">
                <Button size="sm" className="mt-4">
                  Complete Profile
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {canUseFilters && (
            <ActiveFilters
              filters={applied}
              onChange={updateApplied}
              onClearAll={resetFilters}
            />
          )}

          {session &&
            initialized &&
            canUseFilters &&
            !filtersEqual(applied, DEFAULT_SEARCH_FILTERS) && (
              <p className="mb-4 rounded-[6px] glass-subtle px-3 py-2 text-xs text-accent">
                {preferredGenderLabel
                  ? `Pre-filled for ${preferredGenderLabel.toLowerCase()} matches based on who you're looking for. Adjust filters and click Apply.`
                  : "Filters pre-filled from your partner preferences. Adjust and click Apply Filters."}
              </p>
            )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-xl glass py-16 text-center">
              <p className="text-lg font-medium">Could not load profiles</p>
              <p className="mt-1 text-sm text-muted">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => void reload()}>
                Retry
              </Button>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl glass py-16 text-center">
              <p className="text-lg font-medium">No profiles found</p>
              <p className="mt-1 text-sm text-muted">
                {allProfiles.length === 0
                  ? "No profiles are visible yet. Check back soon as new members join."
                  : "Try adjusting your search filters"}
              </p>
              {canUseFilters && allProfiles.length > 0 && (
                <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">
                Showing <span className="font-medium text-foreground">{results.length}</span>
                {isLimitedBrowse ? " preview matches" : ` of ${allProfiles.length} profiles`}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {scoredResults.map(({ profile, match }) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    matchResult={match}
                    onboardingStatus={status}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && canUseFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[6px] border-t border-border glass p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Search Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm text-muted"
              >
                Close
              </button>
            </div>
            <FilterPanel
              draft={draft}
              onDraftChange={setDraft}
              onApply={applyFilters}
              onReset={resetFilters}
              previewCount={previewResults.length}
              appliedCount={results.length}
              hasPendingChanges={hasPendingChanges}
              filterMode={filterMode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted">
          Loading search…
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
