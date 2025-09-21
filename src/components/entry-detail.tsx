
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Pencil } from 'lucide-react';
import type { Entry, EntryType } from "@/types";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useEntryStore } from '@/store/entries';
import { ConfirmationDialog } from './confirmation-dialog';
import { format } from 'date-fns';

function renderContent(entry: Entry) {
  // Always render from the 'notes' field which contains the rich HTML content
  return <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-muted-foreground prose-ol:text-foreground prose-ul:text-foreground prose-li:text-foreground dark:prose-invert" dangerouslySetInnerHTML={{ __html: entry.notes }} />;
}

export function EntryDetail({ entry, isOpen, onClose, showDelete = false }: {
    entry: Entry | null;
    isOpen: boolean;
    onClose: () => void;
    showDelete?: boolean;
}) {
  const { deleteEntry } = useEntryStore();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset scroll state when a new entry is opened
    if (isOpen) {
      setIsScrolled(false);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, entry]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 50); // Trigger when scrolled more than 50px
  };
  
  const getImageDimensions = (entryType: string | undefined) => {
    switch (entryType) {
        case 'music':
            return { width: 400, height: 400 };
        case 'movie':
        case 'anime':
        case 'tv':
            return { width: 400, height: 560 };
        case 'blog':
             return { width: 600, height: 400 };
        case 'book':
        case 'manga':
        default:
            return { width: 400, height: 600 };
    }
  }

  const getMobileHeaderPadding = (entryType: EntryType | undefined) => {
    switch (entryType) {
      case 'book':
      case 'manga':
        return 'pt-[520px]'; // Taller portrait images
      case 'movie':
      case 'tv':
      case 'anime':
        return 'pt-[500px]'; // Standard portrait
       case 'music':
        return 'pt-[450px]'; // Square images
      case 'blog':
        return 'pt-[380px]'; // Landscape images
      default:
        return 'pt-[520px]';
    }
  };

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
                className="absolute top-4 right-4 rounded-full h-8 w-8 z-[60] text-white bg-black/50 hover:bg-black/75 hover:text-white"
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
              {/* --- Mobile Layout --- */}
              <div className="relative h-full md:hidden">
                <ScrollArea className="h-full" viewportRef={scrollRef} onScroll={handleScroll}>
                    <div className={`${getMobileHeaderPadding(entry.type)} px-6 pb-16`}>
                        {renderContent(entry)}
                    </div>
                </ScrollArea>
                <AnimatePresence>
                    {!isScrolled && (
                       <motion.div
                          key="hero-header"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          className="absolute top-0 left-0 right-0 z-20 p-6 pt-8 bg-gradient-to-b from-background via-background/90 to-transparent pointer-events-none"
                       >
                         <div className="w-full max-w-[200px] mx-auto pointer-events-auto">
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
                            <div className="flex items-center gap-2 mt-4 w-full max-w-[200px] mx-auto pointer-events-auto">
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
                       </motion.div>
                    )}

                    {isScrolled && (
                      <motion.div
                        key="compact-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 left-0 right-0 z-20 p-4 border-b bg-background/80 backdrop-blur-sm"
                      >
                        <h1 className="font-bold text-lg text-center text-foreground truncate">{entry.title}</h1>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* --- Desktop Layout --- */}
              {entry.type === 'blog' ? (
                // Blog Post Layout (Hero Image)
                <div className="hidden md:flex flex-col w-full h-full">
                    <ScrollArea className="flex-grow h-0">
                        <div className="relative w-full aspect-video">
                            <Image
                                src={entry.imageUrl}
                                alt={`Cover for ${entry.title}`}
                                fill
                                className="object-cover"
                                data-ai-hint={`${entry.type} cover`}
                            />
                        </div>
                         <div className="p-8 md:p-12 border-b">
                            <h1 className="font-bold text-3xl md:text-4xl mb-2 text-foreground">{entry.title}</h1>
                            {entry.creator && (
                                <h2 className="text-lg md:text-xl text-muted-foreground font-normal">{entry.creator}</h2>
                            )}
                            <p className="text-sm text-muted-foreground">{format(entry.addedAt, 'MMMM d, yyyy')}</p>
                             {showDelete && (
                                <div className="flex items-center gap-2 mt-4 max-w-xs">
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
                        <div className="p-8 md:p-12">
                            {renderContent(entry)}
                        </div>
                    </ScrollArea>
                </div>
              ) : (
                // Standard Layout (Side Image)
                <>
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
                    <div className="flex-shrink-0 p-8 md:p-12 border-b">
                        <h1 className="font-bold text-3xl md:text-4xl mb-2 text-foreground">{entry.title}</h1>
                        {entry.creator && (
                            <h2 className="text-lg md:text-xl text-muted-foreground font-normal">{entry.creator}</h2>
                        )}
                        <p className="text-sm text-muted-foreground">{format(entry.addedAt, 'MMMM d, yyyy')}</p>
                    </div>
                    <ScrollArea className="flex-grow h-0">
                        <div className="p-8 md:p-12">
                            {renderContent(entry)}
                        </div>
                    </ScrollArea>
                  </div>
                </>
              )}
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
