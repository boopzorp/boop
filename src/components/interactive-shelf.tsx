"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Entry } from "@/types";
import { ShelfItem } from "./shelf-item";
import { cn } from '@/lib/utils';

type InteractiveShelfProps = {
  entries: Entry[];
  onOpenDetail: (entry: Entry) => void;
};

const SPINE_WIDTH = 40; 
const GAP = 8; 
const COVER_WIDTH = 250; 

export function InteractiveShelf({ entries, onOpenDetail }: InteractiveShelfProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedIndex = selectedId ? entries.findIndex(e => e.id === selectedId) : -1;

  const handleSelect = (entry: Entry) => {
    if (selectedId === entry.id) {
      onOpenDetail(entry);
    } else {
      setSelectedId(entry.id);
    }
  };
  
  const handleDeselect = () => {
    setSelectedId(null);
  };

  const calculateTransform = (index: number) => {
    if (selectedIndex === -1) return 'translateX(0px)';

    const selectionOffset = COVER_WIDTH / 2 - SPINE_WIDTH / 2;
    
    if (index < selectedIndex) {
      return `translateX(-${selectionOffset}px)`;
    }
    if (index > selectedIndex) {
      return `translateX(${selectionOffset}px)`;
    }
    return 'translateX(0px)';
  };
  
  const totalWidth = entries.length * (SPINE_WIDTH + GAP) + (selectedIndex !== -1 ? COVER_WIDTH - SPINE_WIDTH : 0);

  return (
    <div 
      className="w-full flex flex-col items-center justify-center flex-1"
      onClick={handleDeselect}
    >
        <div 
          className="relative w-full h-[400px] flex items-center justify-center"
        >
          <div 
            ref={scrollContainerRef}
            className="w-full h-full overflow-x-auto overflow-y-hidden flex items-end justify-start px-12"
            style={{
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
              <motion.div
                className="relative flex items-end"
                style={{ height: '350px', gap: `${GAP}px`, width: `${totalWidth}px` }}
                animate={{ width: totalWidth }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(item);
                      }}
                    >
                      <ShelfItem
                        entry={item}
                        isSelected={selectedId === item.id}
                        onOpenDetail={onOpenDetail}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
          </div>
        </div>
        <div className="h-4 w-11/12 max-w-6xl bg-[#a47e62] rounded-sm shadow-lg" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
    </div>
  );
}
