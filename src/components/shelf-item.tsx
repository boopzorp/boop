"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import type { Entry } from "@/types";

type ShelfItemProps = {
  entry: Entry;
  onSelect: (entry: Entry) => void;
};

const bookColors = [
  'bg-slate-700', 'bg-gray-700', 'bg-zinc-700', 'bg-neutral-700', 'bg-stone-700',
  'bg-red-900', 'bg-orange-900', 'bg-amber-900', 'bg-yellow-900', 'bg-lime-900',
  'bg-green-900', 'bg-emerald-900', 'bg-teal-900', 'bg-cyan-900', 'bg-sky-900',
  'bg-blue-900', 'bg-indigo-900', 'bg-violet-900', 'bg-purple-900', 'bg-fuchsia-900',
  'bg-pink-900', 'bg-rose-900',
];

const movieColor = 'bg-zinc-800';
const musicColor = 'bg-stone-800';

export function ShelfItem({ entry, onSelect }: ShelfItemProps) {
  const [style, setStyle] = useState<{
    backgroundColor?: string;
    height?: string;
    width?: string;
    color?: string;
  }>({});
  
  useEffect(() => {
    // Math.random() needs to be in useEffect to avoid hydration mismatch
    const randomHeight = `${Math.floor(Math.random() * (100 - 85 + 1)) + 85}%`;
    const randomBookColor = bookColors[Math.floor(Math.random() * bookColors.length)];
    
    switch (entry.type) {
      case 'book':
        setStyle({
          backgroundColor: `hsl(var(--primary))`,
          height: randomHeight,
          width: `${Math.floor(Math.random() * (40 - 28 + 1)) + 28}px`,
          color: `hsl(var(--primary-foreground))`
        });
        break;
      case 'movie':
        setStyle({
          backgroundColor: 'hsl(var(--secondary-foreground))',
          height: '80%',
          width: '32px',
          color: `hsl(var(--secondary))`
        });
        break;
      case 'music':
        setStyle({
          backgroundColor: 'hsl(var(--muted-foreground))',
          height: '75%',
          width: '24px',
          color: 'hsl(var(--muted))'
        });
        break;
    }
  }, [entry.type]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hover: { y: -8, scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  };

  return (
    <motion.button
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded-sm p-1 shadow-md transition-shadow duration-300 hover:shadow-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      style={style}
      onClick={() => onSelect(entry)}
      aria-label={`View details for ${entry.title}`}
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
    </motion.button>
  );
}
