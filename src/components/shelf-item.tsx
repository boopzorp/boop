"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import type { Entry } from "@/types";

type ShelfItemProps = {
  entry: Entry;
  onSelect: () => void;
};

export function ShelfItem({ entry, onSelect }: ShelfItemProps) {
  const { title } = entry;
  const spineColor = `hsl(var(--primary))`;
  const textColor = `hsl(var(--primary-foreground))`;

  return (
    <motion.div
      onClick={onSelect}
      className="group relative flex-shrink-0 h-[300px] w-[30px] cursor-pointer"
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
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
            transform: 'rotate(18red)',
          }}
        >
          {title}
        </span>
      </div>

      {/* Cover on Hover */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 w-[150px] h-[225px] origin-bottom-left"
        initial={{ opacity: 0, rotate: -5, x: "-50%" }}
        whileHover={{ opacity: 1, rotate: -15, x: "-70%", transition: { delay: 0.1 } }}
      >
        <Image
          src={entry.imageUrl}
          alt={`Cover for ${title}`}
          width={150}
          height={225}
          className="rounded-md object-cover shadow-2xl"
          data-ai-hint="book cover"
        />
      </motion.div>
    </motion.div>
  );
}
