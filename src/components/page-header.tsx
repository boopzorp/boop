"use client"

import { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddEntryForm } from './add-entry-form';
import type { Entry } from '@/types';

type PageHeaderProps = {
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddEntry: (entry: Omit<Entry, 'id' | 'addedAt'>) => void;
};

export function PageHeader({ onSearchChange, onAddEntry }: PageHeaderProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6" />
        <h1 className="text-xl font-bold tracking-tight">Shelf Life</h1>
      </div>
      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              onChange={onSearchChange}
            />
          </div>
        </form>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Entry
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Your Collection</DialogTitle>
            </DialogHeader>
            <AddEntryForm onAddEntry={onAddEntry} onFinished={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
