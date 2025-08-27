"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import type { Entry } from "@/types";

type ShelfItemProps = {
  entry: Entry;
  isSelected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
};

export function ShelfItem({ entry, isSelected, onSelect, style }: ShelfItemProps) {
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
      style={{...style, width: '35px', height: '300px'}}
      variants={itemVariants}
      initial="initial"
      whileHover="hover"
      animate={isSelected ? "hover" : "initial"}
    >
      {/* Spine */}
      <div
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
      </div>

      {/* Cover on Hover/Select */}
      <motion.div
        className="pointer-events-none absolute bottom-full left-1/2 mb-4"
        initial={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
        animate={{
          opacity: isSelected ? 1 : 0,
          scale: isSelected ? 1 : 0.8,
          y: isSelected ? 0 : 10,
          x: "-50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: isSelected ? 0.1 : 0 }}
      >
        <Image
          src={entry.imageUrl}
          alt={`Cover for ${title}`}
          width={160}
          height={240}
          className="rounded-md object-cover shadow-2xl"
          data-ai-hint="book cover"
        />
      </motion.div>
    </motion.div>
  );
}
