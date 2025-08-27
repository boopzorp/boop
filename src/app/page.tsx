"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { Entry } from '@/types';
import { mockEntries } from '@/data/mock-data';
import { InteractiveShelf } from '@/components/interactive-shelf';
import { EntryDetail } from '@/components/entry-detail';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  const [entries] = useState<Entry[]>(mockEntries);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);

  const handleSelectEntry = (entry: Entry) => {
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f1e8] text-[#2d2d2d]">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight font-headline">Shelf Life</h1>
        </div>
        <Link href="/editor">
          <Button>
            <PlusCircle />
            New Entry
          </Button>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-24">
        <InteractiveShelf entries={entries} onSelectEntry={handleSelectEntry} />
      </main>
      <EntryDetail entry={selectedEntry} isOpen={isDetailViewOpen} onClose={handleCloseDetail} />
    </div>
  );
}
