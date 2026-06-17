"use client";

import ActiveFilters from "@/components/search/ActiveFilters";
import FilterPanel from "@/components/search/FilterPanel";
import ProfileCard from "@/components/search/ProfileCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import {
  DEFAULT_SEARCH_FILTERS,
  filterProfiles,
  filtersFromPreferences,
  normalizeFilters,
  type SearchFilters,
} from "@/lib/search-filters";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function filtersEqual(a: SearchFilters, b: SearchFilters): boolean {
  return JSON.stringify(normalizeFilters(a)) === JSON.stringify(normalizeFilters(b));
}

export default function SearchPage() {
  const { session } = useAuth();
  const [draft, setDraft] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [applied, setApplied] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!session || initialized) return;
    const fromPrefs = filtersFromPreferences(session.profile);
    setDraft(fromPrefs);
    setApplied(fromPrefs);
    setInitialized(true);
  }, [session, initialized]);

  const previewResults = useMemo(() => filterProfiles(MOCK_PROFILES, draft), [draft]);
  const results = useMemo(() => filterProfiles(MOCK_PROFILES, applied), [applied]);
  const hasPendingChanges = !filtersEqual(draft, applied);

  const applyFilters = () => {
    const normalized = normalizeFilters(draft);
    setDraft(normalized);
    setApplied(normalized);
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    const resetTo = session ? filtersFromPreferences(session.profile) : DEFAULT_SEARCH_FILTERS;
    setDraft(resetTo);
    setApplied(resetTo);
    setMobileFiltersOpen(false);
  };

  const updateApplied = (filters: SearchFilters) => {
    setApplied(filters);
    setDraft(filters);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-[6px] glass p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Search Profiles</h1>
            <p className="mt-1 text-muted">Find compatible matches across the United Kingdom</p>
          </div>
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
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="hidden lg:col-span-1 lg:block">
          <FilterPanel
            draft={draft}
            onDraftChange={setDraft}
            onApply={applyFilters}
            onReset={resetFilters}
            previewCount={previewResults.length}
            appliedCount={results.length}
            hasPendingChanges={hasPendingChanges}
          />
        </div>

        <div className="lg:col-span-3">
          <ActiveFilters
            filters={applied}
            onChange={updateApplied}
            onClearAll={resetFilters}
          />

          {session && initialized && !filtersEqual(applied, DEFAULT_SEARCH_FILTERS) && (
            <p className="mb-4 rounded-[6px] glass-subtle px-3 py-2 text-xs text-accent">
              Filters pre-filled from your partner preferences. Adjust and click Apply Filters.
            </p>
          )}

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl glass py-16 text-center">
              <p className="text-lg font-medium">No profiles found</p>
              <p className="mt-1 text-sm text-muted">Try adjusting your search filters</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">
                Showing <span className="font-medium text-foreground">{results.length}</span> of{" "}
                {MOCK_PROFILES.length} profiles
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
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
            />
          </div>
        </div>
      )}
    </div>
  );
}
