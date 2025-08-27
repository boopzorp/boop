"use client";

import type { EntryType } from "@/types";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./color-palette";

type TabSelectorProps = {
  types: EntryType[];
  activeType: EntryType;
  onTypeChange: (type: EntryType) => void;
  colors: Record<EntryType, string>;
  onColorChange: (type: EntryType, color: string) => void;
};

export function TabSelector({ types, activeType, onTypeChange, colors, onColorChange }: TabSelectorProps) {
  return (
    <div className="flex justify-between items-end px-1">
      <div className="flex -space-x-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ease-in-out relative bottom-[-1px] border border-b-0",
              {
                "z-10 border-foreground/30": activeType === type,
                "text-muted-foreground bg-secondary/50 border-transparent hover:bg-secondary": activeType !== type,
              }
            )}
            style={{
              backgroundColor: activeType === type ? colors[type] : undefined,
              borderColor: activeType === type ? colors[type] : undefined,
            }}
          >
            <span className={cn("capitalize", { 'text-black/80 font-semibold': activeType === type })}>{type}s</span>
          </button>
        ))}
      </div>
      <ColorPalette
        selectedColor={colors[activeType]}
        onColorSelect={(color) => onColorChange(activeType, color)}
      />
    </div>
  );
}
