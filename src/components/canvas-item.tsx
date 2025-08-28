
"use client";

import Image from 'next/image';
import { motion, PanInfo } from 'framer-motion';
import type { CanvasImage } from '@/types';
import { Trash2, RotateCw, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

type CanvasItemProps = {
  item: CanvasImage;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (item: CanvasImage) => void;
  onDelete: (id: string) => void;
};

export function CanvasItem({ item, isEditMode, isSelected, onSelect, onUpdate, onDelete }: CanvasItemProps) {
  const itemRef = React.useRef<HTMLDivElement>(null);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    onUpdate({
        ...item,
        x: item.x + info.delta.x,
        y: item.y + info.delta.y,
    });
  };

  const handleResize = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = item.width;
    const startHeight = item.height;

    const doDrag = (dragEvent: PointerEvent) => {
        const newWidth = startWidth + (dragEvent.clientX - startX);
        const newHeight = startHeight + (dragEvent.clientY - startY);
        onUpdate({
            ...item,
            width: Math.max(newWidth, 50), // min width 50px
            height: Math.max(newHeight, 50), // min height 50px
        });
    };

    const stopDrag = () => {
        window.removeEventListener('pointermove', doDrag);
        window.removeEventListener('pointerup', stopDrag);
    };

    window.addEventListener('pointermove', doDrag);
    window.addEventListener('pointerup', stopDrag);
  };
  
  const handleRotate = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!itemRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
    const startRotation = item.rotation;

    const doDrag = (dragEvent: PointerEvent) => {
        const currentAngle = Math.atan2(dragEvent.clientY - centerY, dragEvent.clientX - centerX) * (180 / Math.PI);
        const diffAngle = currentAngle - startAngle;
        onUpdate({
            ...item,
            rotation: startRotation + diffAngle,
        });
    };

    const stopDrag = () => {
        window.removeEventListener('pointermove', doDrag);
        window.removeEventListener('pointerup', stopDrag);
    };

    window.addEventListener('pointermove', doDrag);
    window.addEventListener('pointerup', stopDrag);
  };

  return (
    <motion.div
      ref={itemRef}
      drag={isEditMode}
      dragMomentum={false}
      onDrag={handleDrag}
      className="canvas-item-wrapper absolute z-10"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        cursor: isEditMode ? 'grab' : 'default',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: item.rotation }}
      exit={{ opacity: 0, scale: 0.8 }}
      onTapStart={(e) => {
        e.stopPropagation();
        onSelect();
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

        {isEditMode && isSelected && (
          <>
            {/* Delete button */}
            <div
              className="absolute -top-3 -right-3 z-20 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Trash2 size={14} />
            </div>

            {/* Resize Handle */}
            <div
                className="absolute -bottom-3 -right-3 z-20 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-se-resize hover:scale-110 transition-transform"
                onPointerDown={handleResize}
            >
                <Move size={14} className="transform rotate-45" />
            </div>

            {/* Rotate Handle */}
            <div
                className="absolute -top-3 -left-3 z-20 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-alias hover:scale-110 transition-transform"
                onPointerDown={handleRotate}
            >
                <RotateCw size={14} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
