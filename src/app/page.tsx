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

export default function Home() {
  const [entries] = useState<Entry[]>(mockEntries);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [activeType, setActiveType] = useState<EntryType>('book');

  const handleOpenDetail = (entry: Entry) => {
    setSelectedEntry(entry);
    setDetailViewOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailViewOpen(false);
    // Allow animation to complete before clearing the entry
    setTimeout(() => {
      setSelectedEntry(null);
    }, 300);
  };
  
  const types: EntryType[] = ['book', 'movie', 'music'];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">My Brain Dump</h1>
        </div>
        <Link href="/editor">
          <Button>
            <PlusCircle />
            New Entry
          </Button>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-24 space-y-8">
        <div className="w-full max-w-7xl">
          <TabSelector types={types} activeType={activeType} onTypeChange={setActiveType} />
          <div className="bg-secondary/30 p-4 rounded-b-lg rounded-tr-lg shadow-lg">
            <InteractiveShelf 
              entries={entries.filter(e => e.type === activeType)} 
              type={activeType} 
              onOpenDetail={handleOpenDetail} 
            />
          </div>
        </div>
      </main>
      <EntryDetail entry={selectedEntry} isOpen={isDetailViewOpen} onClose={handleCloseDetail} />
    </div>
  );
}
