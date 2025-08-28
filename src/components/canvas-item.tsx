
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { CanvasImage } from '@/types';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type CanvasItemProps = {
  item: CanvasImage;
  isEditMode: boolean;
  onDelete: (id: string) => void;
};

export function CanvasItem({ item, isEditMode, onDelete }: CanvasItemProps) {
  return (
    <motion.div
      className="canvas-item-wrapper absolute"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: item.rotation }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className={cn("relative w-full h-full transition-all duration-200")}>
        <Image
          src={item.url}
          alt="Canvas image"
          layout="fill"
          objectFit="cover"
          className="pointer-events-none rounded-sm shadow-lg"
        />

        {isEditMode && (
          <>
            {/* Delete button */}
            <div
              className="absolute -top-3 -right-3 z-20 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            >
              <Trash2 size={14} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
