"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import type { Entry } from "@/types";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useEntryStore } from '@/store/entries';
import { ConfirmationDialog } from './confirmation-dialog';

type EntryDetailProps = {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
};

function renderContent(entry: Entry) {
  if (entry.content && entry.content.length > 0) {
    // We filter out the first image block if its content is the same as the main imageUrl,
    // to avoid displaying the main cover image twice.
    const contentBlocks = entry.content.filter((block, index) => {
        return !(index === 0 && block.type === 'image' && block.content === entry.imageUrl);
    });

    return (
      <div className="space-y-4">
        {contentBlocks.map(block => {
          if (block.type === 'image' && block.content) {
            return (
              <div key={block.id} className="my-4">
                <Image
                  src={block.content}
                  alt="Entry content image"
                  width={600}
                  height={400}
                  className="rounded-md object-cover"
                />
              </div>
            );
          }
          if (block.type === 'paragraph') {
            return <p key={block.id} className="whitespace-pre-wrap">{block.content}</p>;
          }
          return null;
        })}
      </div>
    );
  }
  // Fallback to notes if content is not available
  return <p className='whitespace-pre-wrap'>{entry.notes}</p>;
}

export function EntryDetail({ entry, isOpen, onClose }: EntryDetailProps) {
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
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-background border w-full max-w-4xl h-[90vh] rounded-lg shadow-2xl p-8 flex gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full h-8 w-8"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>

              <div className="w-1/3 flex-shrink-0">
                <Image
                  src={entry.imageUrl}
                  alt={`Cover for ${entry.title}`}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  className="rounded-md object-cover shadow-lg w-full h-auto"
                  data-ai-hint={`${entry.type} cover`}
                />
                 <Button 
                    variant="destructive" 
                    className="w-full mt-4"
                    onClick={() => setDeleteAlertOpen(true)}
                  >
                   <Trash2 className="mr-2 h-4 w-4" />
                    Delete Entry
                  </Button>
              </div>

              <ScrollArea className="w-2/3 h-full">
                <div className="prose prose-lg pr-4 prose-invert">
                  <h1 className="font-bold text-4xl mb-2 text-foreground">{entry.title}</h1>
                  <h2 className="text-xl text-muted-foreground font-normal mb-6">{entry.creator}</h2>
                  {renderContent(entry)}
                </div>
              </ScrollArea>
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
