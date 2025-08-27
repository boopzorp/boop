"use client";

import type { EntryType } from "@/types";
import { cn } from "@/lib/utils";

type TabSelectorProps = {
  types: EntryType[];
  activeType: EntryType;
  onTypeChange: (type: EntryType) => void;
};

export function TabSelector({ types, activeType, onTypeChange }: TabSelectorProps) {
  return (
    <div className="flex px-1 space-x-1">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out",
            {
              "bg-secondary/50 text-foreground": activeType === type,
              "text-muted-foreground hover:text-foreground": activeType !== type,
            }
          )}
        >
          <span className="capitalize">{type}s</span>
        </button>
      ))}
    </div>
  );
}
