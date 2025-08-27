"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Entry } from "@/types";
import { ShelfItem } from "./shelf-item";

type InteractiveShelfProps = {
  entries: Entry[];
  onSelectEntry: (entry: Entry) => void;
};

const SPINE_WIDTH = 35; // Corresponds to w-12 in tailwind
const GAP = 6; // Corresponds to gap-1.5
const COVER_WIDTH = 240; // Desired cover width

export function InteractiveShelf({ entries, onSelectEntry }: InteractiveShelfProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedIndex = selectedId ? entries.findIndex(e => e.id === selectedId) : -1;

  const handleSelect = (entry: Entry) => {
    const newSelectedId = selectedId === entry.id ? null : entry.id;
    setSelectedId(newSelectedId);
    if (newSelectedId) {
      onSelectEntry(entry);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const calculateTransform = (index: number) => {
    if (selectedIndex === -1) return 'translateX(0px)';

    const selectionOffset = COVER_WIDTH / 2 - SPINE_WIDTH / 2 - GAP;
    
    if (index < selectedIndex) {
      return `translateX(-${selectionOffset}px)`;
    }
    if (index > selectedIndex) {
      return `translateX(${selectionOffset}px)`;
    }
    return 'translateX(0px)';
  };


  return (
    <div className="w-full flex flex-col items-center">
        <motion.div
          className="relative flex items-end justify-center h-[350px] w-full px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute flex items-end justify-center h-[350px]" style={{ gap: `${GAP}px` }}>
            {entries.filter(e => e.type === 'book').map((item, index) => {
              return (
                <motion.div
                  key={item.id}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  style={{
                    transform: calculateTransform(index),
                    zIndex: selectedIndex === index ? 10 : 1,
                  }}
                >
                  <ShelfItem
                    entry={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => handleSelect(item)}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        <div className="h-4 w-4/5 bg-primary/80 rounded-sm shadow-lg" />
    </div>
  );
}
