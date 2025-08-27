"use client";

import { useState, useMemo } from 'react';
import type { Entry } from '@/types';
import { mockEntries } from '@/data/mock-data';
import { Shelf } from '@/components/shelf';
import { PageHeader } from '@/components/page-header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    return entries.filter((entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  const books = useMemo(
    () => filteredEntries.filter((e) => e.type === 'book'),
    [filteredEntries]
  );
  const movies = useMemo(
    () => filteredEntries.filter((e) => e.type === 'movie'),
    [filteredEntries]
  );
  const music = useMemo(
    () => filteredEntries.filter((e) => e.type === 'music'),
    [filteredEntries]
  );

  const handleAddEntry = (newEntry: Omit<Entry, 'id' | 'addedAt'>) => {
    setEntries((prevEntries) => [
      {
        ...newEntry,
        id: Date.now().toString(),
        addedAt: new Date(),
        imageUrl: `https://picsum.photos/seed/${Date.now()}/400/600`,
      },
      ...prevEntries,
    ]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAddEntry={handleAddEntry}
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="space-y-12">
          <Shelf
            title="Books"
            items={books}
          />
          <Shelf
            title="Movies"
            items={movies}
          />
          <Shelf
            title="Music Collection"
            items={music}
          />
        </div>
      </main>
    </div>
  );
}
