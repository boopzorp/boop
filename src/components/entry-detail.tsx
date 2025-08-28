
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Pencil } from 'lucide-react';
import type { Entry } from "@/types";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useEntryStore } from '@/store/entries';
import { ConfirmationDialog } from './confirmation-dialog';
import { format } from 'date-fns';

function renderContent(entry: Entry) {
  // Always render from the 'notes' field which contains the rich HTML content
  return <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground prose-a:text-primary hover:prose-a:opacity-80" dangerouslySetInnerHTML={{ __html: entry.notes }} />;
}

export function EntryDetail({ entry, isOpen, onClose, showDelete = false }: {
    entry: Entry | null;
    isOpen: boolean;
    onClose: () => void;
    showDelete?: boolean;
}) {
  const { deleteEntry } = useEntryStore();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
  const getImageDimensions = (entryType: string | undefined) => {
    switch (entryType) {
        case 'music':
            return { width: 400, height: 400 };
        case 'movie':
        case 'anime':
        case 'tv':
            return { width: 400, height: 560 };
        case 'blog':
        case 'book':
        case 'manga':
        default:
            return { width: 400, height: 600 };
    }
  }

  const handleDeleteEntry = () => {
    if (entry) {
      deleteEntry(entry.id);
      onClose(); // Close the detail view after deletion
    }
    setDeleteAlertOpen(false); // Close the confirmation dialog
  };

  const imageDimensions = getImageDimensions(entry?.type);

  return (
    <>
      <AnimatePresence>
        {isOpen && entry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm p-4"
            onClick={onClose}
          >
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full h-8 w-8 z-50 text-white bg-black/50 hover:bg-black/75 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-background border w-full max-w-4xl h-full md:h-[90vh] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Layout: Header is fixed, content scrolls */}
              <div className="flex md:hidden flex-col h-full">
                {/* Fixed Header Part */}
                <div className="flex-shrink-0 p-6 border-b">
                   <div className="w-full max-w-[200px] mx-auto">
                        <Image
                          src={entry.imageUrl}
                          alt={`Cover for ${entry.title}`}
                          width={imageDimensions.width}
                          height={imageDimensions.height}
                          className="rounded-md object-cover shadow-lg w-full h-auto"
                          data-ai-hint={`${entry.type} cover`}
                        />
                    </div>
                    {showDelete && (
                      <div className="flex items-center gap-2 mt-4 w-full max-w-[200px] mx-auto">
                        <Link href={`/editor/${entry.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => setDeleteAlertOpen(true)}
                          >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="text-center mt-4">
                        <h1 className="font-bold text-2xl text-foreground">{entry.title}</h1>
                        {entry.creator && (
                            <h2 className="text-md text-muted-foreground font-normal">{entry.creator}</h2>
                        )}
                        <p className="text-sm text-muted-foreground">{format(entry.addedAt, 'MMMM d, yyyy')}</p>
                    </div>
                </div>
                 {/* Scrollable Content Part */}
                <ScrollArea className="flex-grow h-0">
                    <div className="p-6">
                        {renderContent(entry)}
                    </div>
                </ScrollArea>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex w-1/3 flex-shrink-0 bg-secondary/30 flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r">
                <div className="w-full max-w-[250px] mx-auto">
                    <Image
                      src={entry.imageUrl}
                      alt={`Cover for ${entry.title}`}
                      width={imageDimensions.width}
                      height={imageDimensions.height}
                      className="rounded-md object-cover shadow-lg w-full h-auto"
                      data-ai-hint={`${entry.type} cover`}
                    />
                </div>
                 {showDelete && (
                  <div className="flex items-center gap-2 mt-4 w-full max-w-[250px] mx-auto">
                    <Link href={`/editor/${entry.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Entry
                      </Button>
                    </Link>
                    <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeleteAlertOpen(true)}
                      >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="hidden md:flex flex-col w-2/3 h-full">
                {/* Fixed Header Part */}
                <div className="flex-shrink-0 p-8 md:p-12 border-b">
                    <h1 className="font-bold text-3xl md:text-4xl mb-2 text-foreground">{entry.title}</h1>
                    {entry.creator && (
                        <h2 className="text-lg md:text-xl text-muted-foreground font-normal">{entry.creator}</h2>
                    )}
                    <p className="text-sm text-muted-foreground">{format(entry.addedAt, 'MMMM d, yyyy')}</p>
                </div>
                {/* Scrollable Content Part */}
                <ScrollArea className="flex-grow h-0">
                    <div className="p-8 md:p-12">
                        {renderContent(entry)}
                    </div>
                </ScrollArea>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmationDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={handleDeleteEntry}
        title="Delete this entry?"
        description="This action cannot be undone. This will permanently delete this journal entry."
      />
    </>
  );
}
