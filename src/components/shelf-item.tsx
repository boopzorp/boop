"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Entry } from "@/types";

type ShelfItemProps = {
  entry: Entry;
  isSelected: boolean;
  onSelect: () => void;
};

export function ShelfItem({ entry, isSelected, onSelect }: ShelfItemProps) {
  const { title } = entry;
  const spineColor = `hsl(var(--primary))`;
  const textColor = `hsl(var(--primary-foreground))`;

  const itemVariants = {
    initial: {
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    hover: {
      y: -15,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <motion.div
      onClick={onSelect}
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ width: isSelected ? '240px' : '35px', height: '300px' }}
      variants={itemVariants}
      initial="initial"
      whileHover="hover"
      animate={isSelected ? "hover" : "initial"}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <AnimatePresence>
        {isSelected ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Image
              src={entry.imageUrl}
              alt={`Cover for ${title}`}
              width={240}
              height={300}
              className="rounded-md object-cover shadow-2xl w-full h-full"
              data-ai-hint="book cover"
            />
          </motion.div>
        ) : (
          <motion.div
            key="spine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-1 shadow-md"
            style={{ backgroundColor: spineColor }}
          >
            <span
              className="font-headline text-sm font-bold text-center"
              style={{
                color: textColor,
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
              }}
            >
              {title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Add this at the end of the file to ensure AnimatePresence is imported
import { AnimatePresence } from 'framer-motion';
