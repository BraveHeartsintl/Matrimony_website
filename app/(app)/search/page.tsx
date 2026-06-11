"use client";

import FilterPanel, { type SearchFilters } from "@/components/search/FilterPanel";
import ProfileCard from "@/components/search/ProfileCard";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import { useMemo, useState } from "react";

const DEFAULT_FILTERS: SearchFilters = {
  ageMin: 18,
  ageMax: 60,
  location: "",
  religion: "",
  education: "",
  maritalStatus: "",
};

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const results = useMemo(() => {
    return MOCK_PROFILES.filter((p) => {
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      if (filters.location && p.location !== filters.location) return false;
      if (filters.religion && p.religion !== filters.religion) return false;
      if (filters.education && p.education !== filters.education) return false;
      if (filters.maritalStatus && p.maritalStatus !== filters.maritalStatus) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary/5 via-card to-accent/5 p-6 border border-border">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Search Profiles</h1>
        <p className="mt-1 text-muted">Find compatible matches across the United Kingdom</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            resultCount={results.length}
          />
        </div>

        <div className="lg:col-span-3">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <p className="text-lg font-medium">No profiles found</p>
              <p className="mt-1 text-sm text-muted">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
