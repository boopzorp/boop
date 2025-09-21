
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
              {entries.map((item) => (
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
      <div className="absolute inset-0 h-full w-full p-8 md:p-12 overflow-hidden flex items-end justify-center pb-8">
        <motion.div 
          className="w-auto h-auto flex items-center justify-center gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {entries.map((item) => (
            <motion.div
              key={item.id}
              onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(item);
              }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.1, zIndex: 10, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
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
                {entries.map((item, index) => {
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
