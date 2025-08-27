"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Entry } from "@/types";
import { ShelfItem } from "./shelf-item";
import { ExpandedItem } from './expanded-item';

type ShelfProps = {
  title: string;
  items: Entry[];
};

export function Shelf({ title, items }: ShelfProps) {
  const [selectedItem, setSelectedItem] = useState<Entry | null>(null);

  const handleSelectItem = (item: Entry) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null); // Deselect if the same item is clicked again
    } else {
      setSelectedItem(item);
    }
  };

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
        <motion.div
          className="relative flex h-48 items-end justify-start gap-2 overflow-x-auto pb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => (
            <ShelfItem key={item.id} entry={item} onSelect={handleSelectItem} />
          ))}
          {items.length === 0 && (
            <p className="w-full text-center text-muted-foreground">This shelf is empty. Add something new!</p>
          )}
        </motion.div>
        <div className="absolute bottom-0 left-0 h-2 w-full rounded-b-md bg-primary/80 shadow-lg" />
        <div className="absolute bottom-0 left-0 h-full w-2 -translate-x-1 rounded-l-md bg-primary/70" />
        <div className="absolute bottom-0 right-0 h-full w-2 translate-x-1 rounded-r-md bg-primary/70" />
      </div>
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ExpandedItem 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
