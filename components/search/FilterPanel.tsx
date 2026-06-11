"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import {
  EDUCATION_LEVELS,
  GENDERS,
  MARITAL_STATUSES,
  RELIGIONS,
  UK_LOCATIONS,
} from "@/lib/constants";
import type { SearchFilters } from "@/lib/search-filters";

interface FilterPanelProps {
  draft: SearchFilters;
  onDraftChange: (filters: SearchFilters) => void;
  onApply: () => void;
  onReset: () => void;
  previewCount: number;
  appliedCount: number;
  hasPendingChanges: boolean;
}

export default function FilterPanel({
  draft,
  onDraftChange,
  onApply,
  onReset,
  previewCount,
  appliedCount,
  hasPendingChanges,
}: FilterPanelProps) {
  const update = (key: keyof SearchFilters, value: string | number | boolean) => {
    onDraftChange({ ...draft, [key]: value });
  };

  const ageOptions = Array.from({ length: 43 }, (_, i) => ({
    value: String(i + 18),
    label: String(i + 18),
  }));

  return (
    <Card className="sticky top-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Search Filters</h3>
        {hasPendingChanges && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            Unapplied
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Min Age"
            value={String(draft.ageMin)}
            onChange={(e) => update("ageMin", Number(e.target.value))}
            options={ageOptions}
          />
          <Select
            label="Max Age"
            value={String(draft.ageMax)}
            onChange={(e) => update("ageMax", Number(e.target.value))}
            options={ageOptions}
          />
        </div>

        <Select
          label="Gender"
          value={draft.gender}
          onChange={(e) => update("gender", e.target.value)}
          options={[{ value: "", label: "All Genders" }, ...GENDERS]}
        />

        <Select
          label="Location"
          value={draft.location}
          onChange={(e) => update("location", e.target.value)}
          options={[
            { value: "", label: "All Locations" },
            ...UK_LOCATIONS.map((l) => ({ value: l, label: l })),
          ]}
        />

        <Select
          label="Religion"
          value={draft.religion}
          onChange={(e) => update("religion", e.target.value)}
          options={[
            { value: "", label: "All Religions" },
            ...RELIGIONS.map((r) => ({ value: r, label: r })),
          ]}
        />

        <Select
          label="Education"
          value={draft.education}
          onChange={(e) => update("education", e.target.value)}
          options={[
            { value: "", label: "All Education Levels" },
            ...EDUCATION_LEVELS.map((e) => ({ value: e, label: e })),
          ]}
        />

        <Select
          label="Marital Status"
          value={draft.maritalStatus}
          onChange={(e) => update("maritalStatus", e.target.value)}
          options={[
            { value: "", label: "All Statuses" },
            ...MARITAL_STATUSES.map((s) => ({ value: s.value, label: s.label })),
          ]}
        />

        <Toggle
          label="Verified profiles only"
          description="Show only manually verified members"
          checked={draft.verifiedOnly}
          onChange={(checked) => update("verifiedOnly", checked)}
        />
      </div>

      <div className="mt-6 space-y-3 border-t border-border pt-4">
        <p className="text-sm text-muted">
          {hasPendingChanges ? (
            <>
              <span className="font-medium text-foreground">{previewCount}</span> profiles match
              selected filters
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{appliedCount}</span> profiles shown
            </>
          )}
        </p>

        <Button className="w-full" onClick={onApply}>
          Apply Filters
        </Button>

        <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
          Reset All Filters
        </Button>
      </div>
    </Card>
  );
}
