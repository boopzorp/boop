
"use client";

import { useState } from 'react';
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
    case 'manga':
      return 40;
    case 'movie':
    case 'tv':
    case 'anime':
      return 24;
    case 'music':
    case 'blog':
      return 220;
    case 'apps':
        return 100;
    default:
      return 40;
  }
};

const getCoverWidth = (type: EntryType) => {
    switch (type) {
      case 'book':
      case 'manga':
        return 250;
      case 'movie':
      case 'tv':
      case 'anime':
        return 200;
      case 'music':
        return 220;
      case 'blog':
        return 320;
      case 'apps':
        return 100;
      default:
        return 250;
    }
  };

export function InteractiveShelf({ entries, type, onOpenDetail }: InteractiveShelfProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const SPINE_WIDTH = getSpineWidth(type);
  const COVER_WIDTH = getCoverWidth(type);
  const GAP = 16;
  
  const filteredEntries = entries.filter(e => e.type === type);
  const selectedIndex = selectedId ? filteredEntries.findIndex(e => e.id === selectedId) : -1;

  if (type === 'music' || type === 'blog') {
    return (
      <div className="absolute top-0 left-0 h-full w-full">
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div
            className="w-full h-full flex items-end justify-start px-12"
          >
            <motion.div
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
                  whileHover={{ y: -15 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <ShelfItem
                    entry={item}
                    isSelected={false}
                    onOpenDetail={onOpenDetail}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'apps') {
    return (
        <div className="absolute inset-0 h-full w-full">
            <div className="relative w-full h-full flex items-center">
                <div className="w-full flex items-center justify-center px-12">
                    <div className="flex items-center justify-center gap-6">
                        {filteredEntries.map((item) => (
                            <motion.div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenDetail(item);
                                }}
                                whileHover={{ y: -15, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                                <ShelfItem
                                    entry={item}
                                    isSelected={false}
                                    onOpenDetail={onOpenDetail}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
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
      className="absolute top-0 left-0 h-full"
      onClick={handleDeselect}
    >
        <div 
          className="relative w-full h-full flex items-center"
        >
          <div 
            className="w-full h-full flex items-end justify-start px-12"
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
                      whileHover={{ y: -15 }}
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
    </div>
  );
}
