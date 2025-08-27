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
    <div className="flex px-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={cn(
            "px-6 py-2 rounded-t-lg text-lg font-semibold transition-all duration-200 ease-in-out transform -mb-px relative",
            {
              "bg-secondary/30 text-foreground z-10 shadow-lg": activeType === type,
              "bg-secondary/10 hover:bg-secondary/20 text-muted-foreground": activeType !== type,
            }
          )}
          style={{
            clipPath: 'polygon(0% 100%, 0% 15%, 10% 0%, 90% 0%, 100% 15%, 100% 100%)',
          }}
        >
          <span className="capitalize">{type}s</span>
        </button>
      ))}
    </div>
  );
}
