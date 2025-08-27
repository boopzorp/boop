"use client"

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Entry } from "@/types";

type ShelfItemProps = {
  entry: Entry;
  isSelected: boolean;
  onOpenDetail: (entry: Entry) => void;
};

const SPINE_WIDTH = 40;
const ITEM_HEIGHT = 350;
const COVER_WIDTH = 250;

export function ShelfItem({ entry, isSelected, onOpenDetail }: ShelfItemProps) {
  const { title } = entry;
  
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

  const handleCoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail(entry);
  };

  return (
    <motion.div
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ 
        width: isSelected ? `${COVER_WIDTH}px` : `${SPINE_WIDTH}px`, 
        height: `${ITEM_HEIGHT}px`
      }}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            className="absolute inset-0"
            onClick={handleCoverClick}
          >
            <Image
              src={entry.imageUrl}
              alt={`Cover for ${title}`}
              width={COVER_WIDTH}
              height={ITEM_HEIGHT}
              className="rounded-md object-cover shadow-2xl w-full h-full"
              data-ai-hint="book cover"
            />
          </motion.div>
        ) : (
          <motion.div
            key="spine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="absolute inset-0 flex items-center justify-center p-1 bg-[#FDFBF6] shadow-[inset_2px_0_5px_rgba(0,0,0,0.1),_inset_-1px_0_2px_rgba(255,255,255,0.3)]"
          >
            <span
              className="font-headline text-sm font-bold text-center text-[#333333]"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxHeight: '100%',
                padding: '8px 0',
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
