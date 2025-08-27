"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Entry } from "@/types";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type EntryDetailProps = {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
};

export function EntryDetail({ entry, isOpen, onClose }: EntryDetailProps) {
  return (
    <AnimatePresence>
      {isOpen && entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#f5f1e8] w-full max-w-4xl h-[90vh] rounded-lg shadow-2xl p-8 flex gap-8"
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
                width={400}
                height={600}
                className="rounded-md object-cover shadow-lg w-full h-auto"
                data-ai-hint="book cover"
              />
            </div>

            <ScrollArea className="w-2/3 h-full">
              <div className="prose prose-lg pr-4">
                <h1 className="font-headline font-bold text-4xl mb-2">{entry.title}</h1>
                <h2 className="text-xl text-muted-foreground font-normal mb-6">{entry.creator}</h2>
                <p className='whitespace-pre-wrap'>{entry.notes}</p>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
