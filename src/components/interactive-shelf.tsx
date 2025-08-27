"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { ShelfItem } from "./shelf-item";

type InteractiveShelfProps = {
  entries: Entry[];
  type: EntryType;
  onOpenDetail: (entry: Entry) => void;
};

const getSpineWidth = (type: EntryType) => {
  switch (type) {
    case 'book':
      return 40;
    case 'movie':
      return 24;
    case 'music':
      return 220; // Cover width for grid
    default:
      return 40;
  }
};

const getCoverWidth = (type: EntryType) => {
    switch (type) {
      case 'book':
        return 250;
      case 'movie':
        return 200;
      case 'music':
        return 220;
      default:
        return 250;
    }
  };

export function InteractiveShelf({ entries, type, onOpenDetail }: InteractiveShelfProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const SPINE_WIDTH = getSpineWidth(type);
  const COVER_WIDTH = getCoverWidth(type);
  const GAP = 16; // Increased gap for grid
  
  const filteredEntries = entries.filter(e => e.type === type);
  const selectedIndex = selectedId ? filteredEntries.findIndex(e => e.id === selectedId) : -1;

  if (type === 'music') {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div 
          className="relative w-full h-[400px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-x-auto overflow-y-hidden flex items-end justify-start px-12"
            style={{
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            <div
              className="flex items-end gap-4"
              style={{ height: '350px' }}
            >
              {filteredEntries.map((item, index) => (
                <motion.div
                  key={item.id}
                   onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetail(item);
                  }}
                  initial={{ rotateY: 0, y: 0, scale: 1 }}
                  whileHover={{ y: -15, scale: 1.05, rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    transform: `rotateZ(${(index % 2 === 0 ? 1 : -1) * (2 + (item.id.charCodeAt(5) % 3))}deg)`,
                  }}
                >
                  <ShelfItem
                    entry={item}
                    isSelected={false} // For music, isSelected is handled by onOpenDetail
                    onOpenDetail={onOpenDetail}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-4 w-11/12 max-w-6xl bg-secondary rounded-sm shadow-lg" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
      </div>
    );
  }

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
  
  const totalWidth = filteredEntries.length * (SPINE_WIDTH + GAP) + (selectedIndex !== -1 ? COVER_WIDTH - SPINE_WIDTH : 0);

  return (
    <div 
      className="w-full flex flex-col items-center justify-center"
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
                {filteredEntries.map((item, index) => {
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
        <div className="h-4 w-11/12 max-w-6xl bg-secondary rounded-sm shadow-lg" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
    </div>
  );
}
