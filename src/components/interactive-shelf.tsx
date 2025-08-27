"use client";

import { motion } from 'framer-motion';
import type { Entry } from "@/types";
import { ShelfItem } from "./shelf-item";

type InteractiveShelfProps = {
  entries: Entry[];
  onSelectEntry: (entry: Entry) => void;
};

export function InteractiveShelf({ entries, onSelectEntry }: InteractiveShelfProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
        <motion.div
          className="relative flex items-end justify-center gap-1.5 h-[350px] w-full px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {entries.filter(e => e.type === 'book').map((item) => (
            <ShelfItem 
              key={item.id} 
              entry={item} 
              onSelect={() => onSelectEntry(item)}
            />
          ))}
        </motion.div>
        <div className="h-4 w-4/5 bg-primary/80 rounded-sm shadow-lg" />
    </div>
  );
}
