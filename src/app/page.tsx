
"use client";

import { useState, useEffect } from 'react';
import type { Entry, EntryType } from '@/types';
import { InteractiveShelf } from '@/components/interactive-shelf';
import { EntryDetail } from '@/components/entry-detail';
import { TabSelector } from '@/components/tab-selector';
import { Logo } from '@/components/logo';
import { NewTabDialog } from '@/components/new-tab-dialog';
import type { Tab } from '@/types';
import { useEntryStore } from '@/store/entries';


const initialTabs: Tab[] = [
  { id: 'book', label: 'Books', type: 'book' },
  { id: 'movie', label: 'Movies', type: 'movie' },
  { id: 'music', label: 'Music', type: 'music' },
];

export default function Home() {
  const { entries, tabs, addTab, colors, setTabColor } = useEntryStore();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  
  const [activeTabId, setActiveTabId] = useState<string>('book');
  
  const [isNewTabDialogOpen, setIsNewTabDialogOpen] = useState(false);
  
  // Hydrate the store with initial tabs on mount if it's empty
  useEffect(() => {
    if (useEntryStore.getState().tabs.length === 0) {
      initialTabs.forEach(tab => {
        useEntryStore.getState().addTab({ label: tab.label, type: tab.type });
      });
    }
  }, []);

  const handleColorChange = (tabId: string, color: string) => {
    setTabColor(tabId, color);
  };

  const handleOpenDetail = (entry: Entry) => {
    setSelectedEntry(entry);
    setDetailViewOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailViewOpen(false);
    setTimeout(() => {
      setSelectedEntry(null);
    }, 300);
  };

  const handleAddTab = (newTab: {label: string, type: EntryType}) => {
    const newTabId = addTab(newTab);
    setActiveTabId(newTabId); // Switch to the new tab
    setIsNewTabDialogOpen(false);
  };

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center pt-24 space-y-8 px-4">

        <div className="w-full max-w-7xl text-center bg-secondary/50 p-8 rounded-lg">
            <h2 className="text-4xl font-bold font-anton tracking-wide text-foreground mb-2">
                Welcome to The Logs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This is a place to stash all the good stuff—the books that blew your mind, the movies you can't stop thinking about, and the tunes that get you through the day.
            </p>
        </div>
        
        <div className="w-full max-w-7xl">
            <TabSelector 
                tabs={tabs} 
                activeTabId={activeTabId} 
                onTabChange={setActiveTabId}
                colors={colors}
                onColorChange={handleColorChange}
                onAddTab={() => setIsNewTabDialogOpen(true)}
            />
            {activeTab && (
                <div 
                    className="p-4 rounded-b-lg rounded-tr-lg shadow-lg transition-colors duration-300"
                    style={{ backgroundColor: `${colors[activeTabId] || '#cccccc'}33` }} // 33 for ~20% opacity
                >
                    <InteractiveShelf 
                        entries={entries.filter(e => e.tabId === activeTabId)} 
                        type={activeTab.type} 
                        onOpenDetail={handleOpenDetail} 
                    />
                </div>
            )}
        </div>
      </main>
      <EntryDetail entry={selectedEntry} isOpen={isDetailViewOpen} onClose={handleCloseDetail} />
      <NewTabDialog 
        isOpen={isNewTabDialogOpen}
        onOpenChange={setIsNewTabDialogOpen}
        onAddTab={handleAddTab}
      />
    </div>
  );
}
