"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { Entry, EntryType } from '@/types';
import { mockEntries } from '@/data/mock-data';
import { InteractiveShelf } from '@/components/interactive-shelf';
import { EntryDetail } from '@/components/entry-detail';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TabSelector } from '@/components/tab-selector';
import { Logo } from '@/components/logo';
import { NewTabDialog } from '@/components/new-tab-dialog';
import type { Tab } from '@/types';
import { Sparkles } from 'lucide-react';
import { MonthlyMeter } from '@/components/monthly-meter';
import { Card, CardContent } from '@/components/ui/card';

const initialTabs: Tab[] = [
  { id: 'book', label: 'Books', type: 'book' },
  { id: 'movie', label: 'Movies', type: 'movie' },
  { id: 'music', label: 'Music', type: 'music' },
];

export default function AdminPage() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>('book');
  
  const [colors, setColors] = useState<Record<string, string>>({
    book: '#F7B2AD',
    movie: '#9AB7D3',
    music: '#A2D5C6',
  });

  const [isNewTabDialogOpen, setIsNewTabDialogOpen] = useState(false);

  const handleColorChange = (tabId: string, color: string) => {
    setColors(prev => ({ ...prev, [tabId]: color }));
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
    const newTabId = `${newTab.label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const tabToAdd: Tab = {
      id: newTabId,
      label: newTab.label,
      type: newTab.type,
    };
    setTabs(prev => [...prev, tabToAdd]);
    // Set a default color for the new tab to avoid client/server mismatch from Math.random()
    setColors(prev => ({
      ...prev,
      [newTabId]: '#C0C0C0' // Cool Grey
    }));
    setActiveTabId(newTabId); // Switch to the new tab
    setIsNewTabDialogOpen(false);
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <Link href="/editor">
          <Button>
            <PlusCircle />
            New Entry
          </Button>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center pt-24 space-y-8 px-4">

        <div className="w-full max-w-7xl text-center bg-secondary/50 p-8 rounded-lg">
            <h2 className="text-4xl font-bold font-anton tracking-wide text-foreground mb-2">
                Hey there, partner in code! 🤖
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Welcome to my brain dump. This is where I stash all the good stuff—the books that blew my mind, the movies I can't stop thinking about, and the tunes that get me through the day. Feel free to poke around. Just... don't judge my questionable taste in 90s pop. 😉
            </p>
        </div>
        
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
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
            <div className="md:col-span-1">
                <Card className="h-full">
                    <CardContent className="p-0">
                        <MonthlyMeter entries={entries} />
                    </CardContent>
                </Card>
            </div>
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
