"use client";

import { useState } from 'react';
import type { Tab } from "@/types";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./color-palette";
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Settings2, Plus } from 'lucide-react';

type TabSelectorProps = {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  colors: Record<string, string>;
  onColorChange: (tabId: string, color: string) => void;
  onAddTab: () => void;
};

export function TabSelector({ tabs, activeTabId, onTabChange, colors, onColorChange, onAddTab }: TabSelectorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  return (
    <div className="flex justify-between items-end px-1">
      <div className="flex -space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ease-in-out relative bottom-[-1px] border border-b-0",
              {
                "z-10": activeTabId === tab.id,
                "text-muted-foreground bg-secondary/50 border-transparent hover:bg-secondary": activeTabId !== tab.id,
              }
            )}
            style={{
              backgroundColor: activeTabId === tab.id ? colors[tab.id] : undefined,
              borderColor: activeTabId === tab.id ? colors[tab.id] : 'transparent',
            }}
          >
            <span className={cn("capitalize", { 'text-black/80 font-semibold': activeTabId === tab.id })}>{tab.label}</span>
          </button>
        ))}
        <button
          onClick={onAddTab}
          className="px-3 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ease-in-out relative bottom-[-1px] border border-b-0 text-muted-foreground bg-secondary/50 border-transparent hover:bg-secondary"
        >
            <Plus className="h-4 w-4" />
        </button>
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
            selectedColor={colors[activeTabId]}
            onColorSelect={(color) => {
              onColorChange(activeTabId, color);
              setIsPopoverOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
