
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Pencil } from 'lucide-react';
import type { Entry, Block } from "@/types";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useEntryStore } from '@/store/entries';
import { ConfirmationDialog } from './confirmation-dialog';
import { generateHTML } from '@tiptap/html';
import { editorExtensions } from './block-editor/extensions';

type EntryDetailProps = {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
  showDelete?: boolean;
};

// Helper to check if content is a valid TipTap JSON
const isValidJSONContent = (content: any): boolean => {
  return content && typeof content === 'object' && content.type === 'doc';
};

function renderContent(entry: Entry) {
  if (entry.content && entry.content.length > 0) {
    // Filter out the first image block if its content is the same as the main imageUrl,
    // to avoid displaying the main cover image twice.
    const contentBlocks = entry.content.filter((block, index) => {
        return !(index === 0 && block.type === 'image' && block.content === entry.imageUrl);
    });

    return (
      <div className="space-y-4">
        {contentBlocks.map(block => {
          if (block.type === 'image' && typeof block.content === 'string') {
            return (
              <div key={block.id} className="my-4">
                <Image
                  src={block.content}
                  alt="Entry content image"
                  width={600}
                  height={400}
                  className="rounded-md object-cover w-full max-h-96"
                />
              </div>
            );
          }
          if (block.type === 'paragraph') {
            if (isValidJSONContent(block.content)) {
                const html = generateHTML(block.content as any, editorExtensions);
                return <div key={block.id} className="prose prose-lg prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
            }
            // Fallback for old string content
            if (typeof block.content === 'string') {
                return <p key={block.id} className="whitespace-pre-wrap">{block.content}</p>;
            }
          }
          return null;
        })}
      </div>
    );
  }
  // Fallback to notes if content is not available
  return <div className="prose prose-lg prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: entry.notes }} />;
}


export function EntryDetail({ entry, isOpen, onClose, showDelete = false }: EntryDetailProps) {
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
              className="relative bg-background border w-full max-w-4xl h-[90vh] rounded-lg shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="w-full md:w-1/3 flex-shrink-0">
                <Image
                  src={entry.imageUrl}
                  alt={`Cover for ${entry.title}`}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  className="rounded-md object-cover shadow-lg w-full h-auto max-h-[40vh] md:max-h-full"
                  data-ai-hint={`${entry.type} cover`}
                />
                {showDelete && (
                  <div className="flex items-center gap-2 mt-4">
                    <Link href={`/editor/${entry.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Entry
                      </Button>
                    </Link>
                    <Button 
                        variant="destructive" 
                        onClick={() => setDeleteAlertOpen(true)}
                      >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <ScrollArea className="w-full md:w-2/3 h-full">
                <div className="pr-4">
                  <h1 className="font-bold text-3xl md:text-4xl mb-2 text-foreground">{entry.title}</h1>
                  <h2 className="text-lg md:text-xl text-muted-foreground font-normal mb-6">{entry.creator}</h2>
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
