
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { CanvasImage } from '@/types';
import { cn } from '@/lib/utils';
import React from 'react';

type CanvasItemProps = {
  item: CanvasImage;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
};

export function CanvasItem({ item, isEditMode, isSelected, onSelect }: CanvasItemProps) {

  return (
    <motion.div
      className="canvas-item-wrapper absolute z-10"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        cursor: isEditMode ? 'pointer' : 'default',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: item.rotation }}
      exit={{ opacity: 0, scale: 0.8 }}
      onTapStart={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      <div className={cn(
          "relative w-full h-full transition-all duration-200 border-2",
          isSelected && isEditMode ? "border-primary" : "border-transparent"
        )}>
        <Image
          src={item.url}
          alt="Canvas image"
          layout="fill"
          objectFit="cover"
          className="pointer-events-none rounded-sm shadow-lg"
        />
      </div>
    </motion.div>
  );
}
