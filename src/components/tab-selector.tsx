"use client";

import { useState, useEffect } from 'react';
import type { Tab } from "@/types";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./color-palette";
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Settings2, Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { ConfirmationDialog } from './confirmation-dialog';
import { useEntryStore } from '@/store/entries';

type TabSelectorProps = {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  colors: Record<string, string>;
  onColorChange: (tabId: string, color: string) => void;
  onAddTab: () => void;
  showCustomize?: boolean;
};

const TABS_PER_PAGE = 4;

export function TabSelector({ tabs, activeTabId, onTabChange, colors, onColorChange, onAddTab, showCustomize = true }: TabSelectorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { deleteTab } = useEntryStore();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.id === activeTabId);
    if (activeIndex !== -1) {
      setCurrentPage(Math.floor(activeIndex / TABS_PER_PAGE));
    }
  }, [activeTabId, tabs]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleDeleteTab = () => {
    if (!activeTab) return;
    deleteTab(activeTabId);
    // After deleting, switch to the first available tab, or handle empty state
    const newActiveTabId = tabs.length > 1 ? tabs.find(t => t.id !== activeTabId)!.id : '';
    onTabChange(newActiveTabId);
    setDeleteAlertOpen(false); // Close the confirmation dialog
    setIsPopoverOpen(false); // Close the popover
  };

  const totalPages = Math.ceil(tabs.length / TABS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const visibleTabs = tabs.slice(
    currentPage * TABS_PER_PAGE,
    (currentPage + 1) * TABS_PER_PAGE
  );
  
  return (
    <div className="flex justify-between items-end px-1">
      <div className="flex -space-x-2">
        {visibleTabs.map((tab) => (
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
        {totalPages > 1 && (
             <button
             onClick={handleNextPage}
             className="px-3 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ease-in-out relative bottom-[-1px] border border-b-0 text-muted-foreground bg-secondary/50 border-transparent hover:bg-secondary"
             >
                 <MoreHorizontal className="h-4 w-4" />
             </button>
        )}
        {showCustomize && (
            <button
            onClick={onAddTab}
            className="px-3 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ease-in-out relative bottom-[-1px] border border-b-0 text-muted-foreground bg-secondary/50 border-transparent hover:bg-secondary"
            >
                <Plus className="h-4 w-4" />
            </button>
        )}
      </div>
      {showCustomize && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Customize
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 space-y-2">
            <ColorPalette
                selectedColor={colors[activeTabId]}
                onColorSelect={(color) => {
                onColorChange(activeTabId, color);
                setIsPopoverOpen(false);
                }}
            />
            <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => setDeleteAlertOpen(true)}
                disabled={!activeTab}
                >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Tab
                </Button>
            </PopoverContent>
        </Popover>
      )}

      <ConfirmationDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={handleDeleteTab}
        title={`Delete "${activeTab?.label}" Tab?`}
        description="This action cannot be undone. This will permanently delete the tab and all entries within it."
      />
    </div>
  );
}
