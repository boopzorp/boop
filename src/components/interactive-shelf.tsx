
"use client";

import { motion } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { ShelfItem } from "./shelf-item";

type InteractiveShelfProps = {
  entries: Entry[];
  type: EntryType;
  onOpenDetail: (entry: Entry) => void;
  showDrafts?: boolean;
};

export function InteractiveShelf({ entries, type, onOpenDetail, showDrafts = false }: InteractiveShelfProps) {
  const allEntries = showDrafts ? entries : entries.filter(e => e.status === 'published');
  
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
              {allEntries.map((item) => (
                <motion.div
                  key={item.id}
                   onClick={(e) => {
                    e.stopPropagation();
                    if (item.status === 'draft' && !showDrafts) return;
                    onOpenDetail(item);
                  }}
                  whileHover={{ y: -15 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <ShelfItem
                    entry={item}
                    isSelected={false}
                    onOpenDetail={onOpenDetail}
                    showDrafts={showDrafts}
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
      <div className="absolute inset-x-0 bottom-0 h-48 flex items-end justify-center">
        <div className="w-full max-w-7xl overflow-x-auto px-4 pb-4">
            <motion.div 
              className="flex items-end justify-center gap-6"
            >
              {allEntries.map((item) => (
                <motion.div
                  key={item.id}
                  onClick={(e) => {
                      e.stopPropagation();
                      if (item.status === 'draft' && !showDrafts) return;
                      onOpenDetail(item);
                  }}
                  whileHover={{ scale: 1.1, zIndex: 10, y: -10, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                >
                  <ShelfItem
                    entry={item}
                    isSelected={false}
                    onOpenDetail={onOpenDetail}
                    showDrafts={showDrafts}
                  />
                </motion.div>
              ))}
            </motion.div>
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
                {allEntries.map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      whileHover={{ y: -15 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.status === 'draft' && !showDrafts) return;
                        onOpenDetail(item);
                      }}
                    >
                      <ShelfItem
                        entry={item}
                        isSelected={false}
                        onOpenDetail={onOpenDetail}
                        showDrafts={showDrafts}
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
