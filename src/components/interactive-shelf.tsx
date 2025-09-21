
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { ShelfItem } from "./shelf-item";

type InteractiveShelfProps = {
  entries: Entry[];
  type: EntryType;
  onOpenDetail: (entry: Entry) => void;
  showDrafts?: boolean;
};

export function InteractiveShelf({ entries, type, onOpenDetail, showDrafts = false }: InteractiveShelfProps) {
  const filteredEntries = showDrafts ? entries : entries.filter(e => e.status === 'published');

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
    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    };

    return (
      <div className="absolute inset-0 h-full w-full p-4 md:p-8 flex items-end justify-center">
        <motion.div 
          className="w-full h-auto flex items-end justify-center gap-4 flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredEntries.map((item) => (
            <motion.div
              key={item.id}
              onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(item);
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.1, zIndex: 10, y: -10, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
              className="h-28" // Added fixed height to prevent collapse
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
                {filteredEntries.map((item) => {
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
