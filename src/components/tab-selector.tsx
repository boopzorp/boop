"use client";

import { useState } from 'react';
import type { EntryType } from "@/types";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./color-palette";
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Settings2 } from 'lucide-react';

type TabSelectorProps = {
  types: EntryType[];
  activeType: EntryType;
  onTypeChange: (type: EntryType) => void;
  colors: Record<EntryType, string>;
  onColorChange: (type: EntryType, color: string) => void;
};

export function TabSelector({ types, activeType, onTypeChange, colors, onColorChange }: TabSelectorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
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
                "z-10": activeType === type,
                "text-muted-foreground bg-secondary/50 border-transparent hover:bg-secondary": activeType !== type,
              }
            )}
            style={{
              backgroundColor: activeType === type ? colors[activeType] : undefined,
              borderColor: activeType === type ? colors[activeType] : 'transparent',
            }}
          >
            <span className={cn("capitalize", { 'text-black/80 font-semibold': activeType === type })}>{type}s</span>
          </button>
        ))}
      </div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
           <Button variant="ghost" size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              Customize
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
           <ColorPalette
            selectedColor={colors[activeType]}
            onColorSelect={(color) => {
              onColorChange(activeType, color);
              setIsPopoverOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
