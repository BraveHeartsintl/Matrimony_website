"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex w-full min-w-0 gap-0 overflow-x-auto overscroll-x-contain border-b border-border [-webkit-overflow-scrolling:touch]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 whitespace-nowrap px-3 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] transition-colors sm:px-4 sm:text-xs",
            activeTab === tab.id
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
