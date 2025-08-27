"use client";

import { useState, useMemo } from 'react';
import type { Entry } from '@/types';
import { mockEntries } from '@/data/mock-data';
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Shelf } from '@/components/shelf';
import { PageHeader } from '@/components/page-header';
import { MonthlyMeter } from '@/components/monthly-meter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

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
      },
      ...prevEntries,
    ]);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <MonthlyMeter entries={entries} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <PageHeader
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onAddEntry={handleAddEntry}
          />
          <main className="flex-1 overflow-hidden p-4 sm:p-6 md:p-8">
            <ScrollArea className="h-full">
              <div className="space-y-12 pr-4">
                <Shelf
                  title="Books"
                  items={books}
                  onSelectItem={setSelectedEntry}
                />
                <Shelf
                  title="Movies"
                  items={movies}
                  onSelectItem={setSelectedEntry}
                />
                <Shelf
                  title="Music Collection"
                  items={music}
                  onSelectItem={setSelectedEntry}
                />
              </div>
            </ScrollArea>
          </main>
        </div>
      </SidebarInset>

      <Dialog open={!!selectedEntry} onOpenChange={(isOpen) => !isOpen && setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEntry?.title}</DialogTitle>
            <DialogDescription>
              {selectedEntry?.creator}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm font-semibold mb-2">My Notes</h4>
            <div className="max-h-60 overflow-y-auto rounded-md border bg-muted p-3">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedEntry?.notes || 'No notes yet.'}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-4 text-right">
            Added on {selectedEntry?.addedAt.toLocaleDateString()}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
