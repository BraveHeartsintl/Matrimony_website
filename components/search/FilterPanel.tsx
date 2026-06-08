"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { EDUCATION_LEVELS, MARITAL_STATUSES, RELIGIONS, UK_LOCATIONS } from "@/lib/constants";

export interface SearchFilters {
  ageMin: number;
  ageMax: number;
  location: string;
  religion: string;
  education: string;
  maritalStatus: string;
}

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export default function FilterPanel({ filters, onChange, onReset, resultCount }: FilterPanelProps) {
  const update = (key: keyof SearchFilters, value: string | number) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Card className="sticky top-4">
      <h3 className="mb-4 font-semibold">Search Filters</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Min Age"
            value={String(filters.ageMin)}
            onChange={(e) => update("ageMin", Number(e.target.value))}
            options={Array.from({ length: 43 }, (_, i) => ({
              value: String(i + 18),
              label: String(i + 18),
            }))}
          />
          <Select
            label="Max Age"
            value={String(filters.ageMax)}
            onChange={(e) => update("ageMax", Number(e.target.value))}
            options={Array.from({ length: 43 }, (_, i) => ({
              value: String(i + 18),
              label: String(i + 18),
            }))}
          />
        </div>

        <Select
          label="Location"
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          options={[{ value: "", label: "All Locations" }, ...UK_LOCATIONS.map((l) => ({ value: l, label: l }))]}
        />

        <Select
          label="Religion"
          value={filters.religion}
          onChange={(e) => update("religion", e.target.value)}
          options={[{ value: "", label: "All Religions" }, ...RELIGIONS.map((r) => ({ value: r, label: r }))]}
        />

        <Select
          label="Education"
          value={filters.education}
          onChange={(e) => update("education", e.target.value)}
          options={[
            { value: "", label: "All Education Levels" },
            ...EDUCATION_LEVELS.map((e) => ({ value: e, label: e })),
          ]}
        />

        <Select
          label="Marital Status"
          value={filters.maritalStatus}
          onChange={(e) => update("maritalStatus", e.target.value)}
          options={[
            { value: "", label: "All Statuses" },
            ...MARITAL_STATUSES.map((s) => ({ value: s.value, label: s.label })),
          ]}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted">{resultCount} profiles found</p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
    </Card>
  );
}
