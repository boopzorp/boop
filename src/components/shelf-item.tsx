
"use client"

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Entry, EntryType } from "@/types";
import { cn } from '@/lib/utils';

type ShelfItemProps = {
  entry: Entry;
  isSelected: boolean;
  onOpenDetail: (entry: Entry) => void;
};

const typeStyles: Record<EntryType, {
    spineWidth: number,
    itemHeight: number,
    coverWidth: number,
    textVertical: boolean,
    spineBg: string,
    spineShadow: string
}> = {
    book: {
        spineWidth: 40,
        itemHeight: 350,
        coverWidth: 250,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_2px_0_5px_rgba(0,0,0,0.1),_inset_-1px_0_2px_rgba(255,255,255,0.3)]'
    },
    movie: {
        spineWidth: 24,
        itemHeight: 320,
        coverWidth: 200,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_3px_rgba(255,255,255,0.2),_inset_-1px_0_3px_rgba(0,0,0,0.4)]'
    },
    music: {
        spineWidth: 220, // Always show cover for music
        itemHeight: 220,
        coverWidth: 220,
        textVertical: true,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_2px_rgba(255,255,255,0.2),_inset_-1px_0_2px_rgba(0,0,0,0.5)]'
    },
    blog: {
        spineWidth: 15,
        itemHeight: 220,
        coverWidth: 320,
        textVertical: false,
        spineBg: 'bg-primary',
        spineShadow: 'shadow-[inset_1px_0_2px_rgba(255,255,255,0.2),_inset_-1px_0_2px_rgba(0,0,0,0.5)]'
    }
}


export function ShelfItem({ entry, isSelected, onOpenDetail }: ShelfItemProps) {
  const { title, type } = entry;
  const styles = typeStyles[type];
  
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
  
  const showCover = isSelected || type === 'music';

  return (
    <motion.div
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ 
        width: showCover ? `${styles.coverWidth}px` : `${styles.spineWidth}px`, 
        height: `${styles.itemHeight}px`
      }}
      variants={itemVariants}
      initial="initial"
      whileHover="hover"
      animate={isSelected ? "hover" : "initial"}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <AnimatePresence>
        {showCover ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: type === 'music' ? 0 : 0.15 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            className="absolute inset-0"
            onClick={handleCoverClick}
          >
            <Image
              src={entry.imageUrl}
              alt={`Cover for ${title}`}
              width={styles.coverWidth}
              height={styles.itemHeight}
              className={cn("rounded-md object-cover shadow-2xl w-full h-full", {
                'border-2 border-white/20': type === 'movie' || type === 'music'
              })}
              data-ai-hint={`${type} cover`}
            />
          </motion.div>
        ) : (
          <motion.div
            key="spine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className={cn(
                "absolute inset-0 flex items-center p-1 overflow-hidden", 
                styles.spineBg, 
                styles.spineShadow
            )}
          >
            <span
              className={cn("font-headline text-sm font-bold", {
                'text-primary-foreground': type === 'book',
                'text-white/90': type === 'movie' || type === 'music' || type === 'blog'
              })}
              style={{
                writingMode: styles.textVertical ? 'vertical-rl' : 'horizontal-tb',
                textOrientation: styles.textVertical ? 'mixed' : undefined,
                transform: styles.textVertical ? 'rotate(180deg)' : 'none',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxHeight: '100%',
                padding: type === 'book' ? '10px 0' : (type === 'movie' ? '10px 0' : '10px 0'),
                textAlign: type === 'music' ? 'center' : (type === 'movie' ? 'center' : 'center'),
                width: '100%'
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
