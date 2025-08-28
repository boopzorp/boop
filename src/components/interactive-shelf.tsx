
"use client";

import { motion } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { ShelfItem } from "./shelf-item";

type InteractiveShelfProps = {
  entries: Entry[];
  type: EntryType;
  onOpenDetail: (entry: Entry) => void;
};

export function InteractiveShelf({ entries, type, onOpenDetail }: InteractiveShelfProps) {
  const filteredEntries = entries.filter(e => e.type === type);

  if (type === 'music' || type === 'blog') {
    return (
      <div className="absolute top-0 left-0 h-full w-full">
        <div 
          className="relative w-full h-full"
          style={{ perspective: '1000px' }}
        >
          <div
            className="w-full h-full flex items-end justify-start px-12"
          >
            <motion.div
              className="flex items-end gap-4"
              style={{ height: '350px' }}
            >
              {filteredEntries.map((item) => (
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
            <div className="relative w-full h-full flex items-end pb-4">
                <div className="w-full flex items-center justify-start px-12">
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
  
  return (
    <div 
      className="absolute top-0 left-0 h-full"
    >
        <div 
          className="relative w-full h-full flex items-center"
        >
          <div 
            className="w-full h-full flex items-end justify-start px-12"
          >
              <motion.div
                className="relative flex items-end gap-4"
                style={{ height: '350px' }}
              >
                {filteredEntries.map((item, index) => {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      whileHover={{ y: -15 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(item);
                      }}
                    >
                      <ShelfItem
                        entry={item}
                        isSelected={false}
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
