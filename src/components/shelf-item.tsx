"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import type { Entry } from "@/types";
import { X } from 'lucide-react';

type ShelfItemProps = {
  entry: Entry;
  isSelected: boolean;
  onSelect: () => void;
};

const imageDimensions = {
  book: { width: 150, height: 150, hint: 'book cover' },
  movie: { width: 150, height: 150, hint: 'movie poster' },
  music: { width: 150, height: 150, hint: 'album art' },
};

export function ShelfItem({ entry, isSelected, onSelect }: ShelfItemProps) {
  const [spineStyle, setSpineStyle] = useState<{
    backgroundColor?: string;
    height?: string;
    width?: string;
    color?: string;
  }>({});
  
  useEffect(() => {
    // Math.random() needs to be in useEffect to avoid hydration mismatch
    const randomHeight = `${Math.floor(Math.random() * (100 - 85 + 1)) + 85}%`;
    
    switch (entry.type) {
      case 'book':
        setSpineStyle({
          backgroundColor: `hsl(var(--primary))`,
          height: randomHeight,
          width: `${Math.floor(Math.random() * (40 - 28 + 1)) + 28}px`,
          color: `hsl(var(--primary-foreground))`
        });
        break;
      case 'movie':
        setSpineStyle({
          backgroundColor: 'hsl(var(--secondary-foreground))',
          height: '80%',
          width: '32px',
          color: `hsl(var(--secondary))`
        });
        break;
      case 'music':
        setSpineStyle({
          backgroundColor: 'hsl(var(--muted-foreground))',
          height: '75%',
          width: '24px',
          color: 'hsl(var(--muted))'
        });
        break;
    }
  }, [entry.type]);

  const { width, height, hint } = imageDimensions[entry.type];

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -8, scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  };

  const spineVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  const coverVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={!isSelected ? "hover" : ""}
      onClick={onSelect}
      className={cn(
        "relative flex-shrink-0 cursor-pointer rounded-sm shadow-md transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "flex items-center justify-center",
        isSelected ? "cursor-default" : ""
      )}
      style={isSelected ? { width: `${width}px`, height: `${height}px`, backgroundColor: 'transparent', alignSelf: 'center' } : spineStyle}
      aria-label={`View details for ${entry.title}`}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <AnimatePresence>
        {!isSelected ? (
          <motion.div
            key="spine"
            variants={spineVariants}
            exit="exit"
            className="w-full h-full flex items-center justify-center"
          >
            <span
              className="font-headline text-xs font-bold"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap'
              }}
            >
              {entry.title}
            </span>
            {entry.type === 'book' && (
              <div className="absolute bottom-2 h-[2px] w-3/4 bg-current opacity-50" />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="cover"
            variants={coverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full relative"
          >
            <Image
              src={entry.imageUrl}
              alt={`Cover for ${entry.title}`}
              width={width}
              height={height}
              className="rounded-md object-cover shadow-lg w-full h-full"
              data-ai-hint={hint}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
