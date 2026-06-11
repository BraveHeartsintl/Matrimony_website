"use client";

import { X } from "lucide-react";
import {
  type SearchFilters,
  clearFilterKey,
  getActiveFilterChips,
} from "@/lib/search-filters";

interface ActiveFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onChange, onClearAll }: ActiveFiltersProps) {
  const chips = getActiveFilterChips(filters);

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted">Active filters:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(clearFilterKey(filters, chip.key))}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-muted underline-offset-2 hover:text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
