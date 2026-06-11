import { MARITAL_STATUSES } from "@/lib/constants";
import type { Profile, SearchProfile } from "@/lib/types";

export interface SearchFilters {
  ageMin: number;
  ageMax: number;
  gender: string;
  location: string;
  religion: string;
  education: string;
  maritalStatus: string;
  verifiedOnly: boolean;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  ageMin: 18,
  ageMax: 60,
  gender: "",
  location: "",
  religion: "",
  education: "",
  maritalStatus: "",
  verifiedOnly: false,
};

export function filtersFromPreferences(profile: Profile): SearchFilters {
  const { preferences } = profile;
  return {
    ageMin: preferences.ageMin || 18,
    ageMax: preferences.ageMax || 60,
    gender: "",
    location: preferences.locations.length === 1 ? preferences.locations[0] : "",
    religion: preferences.religions.length === 1 ? preferences.religions[0] : "",
    education: "",
    maritalStatus: "",
    verifiedOnly: false,
  };
}

export function normalizeFilters(filters: SearchFilters): SearchFilters {
  const ageMin = Math.min(filters.ageMin, filters.ageMax);
  const ageMax = Math.max(filters.ageMin, filters.ageMax);
  return { ...filters, ageMin, ageMax };
}

export function filterProfiles(
  profiles: SearchProfile[],
  filters: SearchFilters
): SearchProfile[] {
  const f = normalizeFilters(filters);

  return profiles.filter((p) => {
    if (p.age < f.ageMin || p.age > f.ageMax) return false;
    if (f.gender && p.gender !== f.gender) return false;
    if (f.location && p.location !== f.location) return false;
    if (f.religion && p.religion !== f.religion) return false;
    if (f.education && p.education !== f.education) return false;
    if (f.maritalStatus && p.maritalStatus !== f.maritalStatus) return false;
    if (f.verifiedOnly && !p.verified) return false;
    return true;
  });
}

export function isDefaultFilters(filters: SearchFilters): boolean {
  const d = DEFAULT_SEARCH_FILTERS;
  return (
    filters.ageMin === d.ageMin &&
    filters.ageMax === d.ageMax &&
    !filters.gender &&
    !filters.location &&
    !filters.religion &&
    !filters.education &&
    !filters.maritalStatus &&
    !filters.verifiedOnly
  );
}

export interface ActiveFilterChip {
  key: keyof SearchFilters;
  label: string;
}

export function getActiveFilterChips(filters: SearchFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  const d = DEFAULT_SEARCH_FILTERS;

  if (filters.ageMin !== d.ageMin || filters.ageMax !== d.ageMax) {
    chips.push({ key: "ageMin", label: `Age ${filters.ageMin}–${filters.ageMax}` });
  }
  if (filters.gender) {
    chips.push({
      key: "gender",
      label: filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1),
    });
  }
  if (filters.location) {
    chips.push({ key: "location", label: filters.location });
  }
  if (filters.religion) {
    chips.push({ key: "religion", label: filters.religion });
  }
  if (filters.education) {
    chips.push({ key: "education", label: filters.education });
  }
  if (filters.maritalStatus) {
    const status = MARITAL_STATUSES.find((s) => s.value === filters.maritalStatus);
    chips.push({ key: "maritalStatus", label: status?.label ?? filters.maritalStatus });
  }
  if (filters.verifiedOnly) {
    chips.push({ key: "verifiedOnly", label: "Verified only" });
  }

  return chips;
}

export function clearFilterKey(
  filters: SearchFilters,
  key: keyof SearchFilters
): SearchFilters {
  const d = DEFAULT_SEARCH_FILTERS;
  if (key === "ageMin") {
    return { ...filters, ageMin: d.ageMin, ageMax: d.ageMax };
  }
  if (key === "verifiedOnly") {
    return { ...filters, verifiedOnly: false };
  }
  return { ...filters, [key]: "" };
}
