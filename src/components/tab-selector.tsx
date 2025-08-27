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
            "px-6 py-2 rounded-t-lg text-lg font-headline font-semibold transition-all duration-200 ease-in-out transform -mb-px relative",
            {
              "bg-white/60 text-primary z-10 shadow-lg": activeType === type,
              "bg-gray-300/50 hover:bg-gray-300/80 text-gray-600": activeType !== type,
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
