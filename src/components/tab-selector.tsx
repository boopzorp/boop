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
      <div className="flex space-x-1">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out border-b-4",
              {
                "text-foreground border-b-4": activeType === type,
                "text-muted-foreground border-transparent hover:text-foreground": activeType !== type,
              }
            )}
            style={{
                borderColor: activeType === type ? colors[type] : 'transparent'
            }}
          >
            <span className="capitalize">{type}s</span>
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
