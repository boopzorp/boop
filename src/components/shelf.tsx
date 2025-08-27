"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Entry } from "@/types";
import { ShelfItem } from "./shelf-item";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type ShelfProps = {
  title: string;
  items: Entry[];
};

export function Shelf({ title, items }: ShelfProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section>
      <h2 className="mb-4 text-2xl font-headline font-bold text-primary">{title}</h2>
      <div className="relative w-full rounded-md bg-stone-200/50 p-4 shadow-inner">
        <ScrollArea className="w-full whitespace-nowrap">
          <motion.div
            className="relative flex items-end justify-start gap-2 pb-4"
            style={{ minHeight: '12rem' }} // Set a min-height for the container
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <ShelfItem 
                key={item.id} 
                entry={item} 
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(selectedId === item.id ? null : item.id)}
              />
            ))}
            {items.length === 0 && (
              <p className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground">This shelf is empty. Add something new!</p>
            )}
          </motion.div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="absolute bottom-0 left-0 h-2 w-full rounded-b-md bg-primary/80 shadow-lg" />
        <div className="absolute bottom-0 left-0 h-full w-2 -translate-x-1 rounded-l-md bg-primary/70" />
        <div className="absolute bottom-0 right-0 h-full w-2 translate-x-1 rounded-r-md bg-primary/70" />
      </div>
    </section>
  );
}
