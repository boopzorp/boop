
"use client";

import { motion } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { ShelfItem } from "./shelf-item";
import { useMemo } from 'react';

type InteractiveShelfProps = {
  entries: Entry[];
  type: EntryType;
  onOpenDetail: (entry: Entry) => void;
  showDrafts?: boolean;
};

const DriftingGrid = ({ entries, onOpenDetail, showDrafts }: Omit<InteractiveShelfProps, 'type'>) => {
  const allEntries = showDrafts ? entries : entries.filter(e => e.status === 'published');

  const variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = (index: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      }
    },
  });

  const animationProps = useMemo(() => (index: number) => ({
    animate: {
      y: [`${Math.sin(index * 0.5) * 10}px`, `${Math.sin(index * 0.5 + Math.PI) * 10}px`],
      x: [`${Math.cos(index * 0.5) * 10}px`, `${Math.cos(index * 0.5 + Math.PI) * 10}px`],
    },
    transition: {
      duration: Math.random() * 5 + 5, // Random duration between 5 and 10 seconds
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
      delay: Math.random() * 2,
    },
  }), []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-8"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {allEntries.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants(index)}
            {...animationProps(index)}
            onClick={(e) => {
                e.stopPropagation();
                if (item.status === 'draft' && !showDrafts) return;
                onOpenDetail(item);
            }}
            whileHover={{ scale: 1.1, zIndex: 10, y: -10, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
            className="flex items-center justify-center"
          >
            <ShelfItem
              entry={item}
              isSelected={false}
              onOpenDetail={onOpenDetail}
              showDrafts={showDrafts}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
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
    return <DriftingGrid entries={entries} onOpenDetail={onOpenDetail} showDrafts={showDrafts} />;
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
