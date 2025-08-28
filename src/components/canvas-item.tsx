
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useDragControls } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { CanvasImage } from '@/types';
import { RefreshCw, Trash2, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

type CanvasItemProps = {
  item: CanvasImage;
  isEditMode: boolean;
  onUpdate: (item: CanvasImage) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
};

const MIN_SIZE = 50;

export function CanvasItem({ item, isEditMode, onUpdate, onDelete, onSelect, isSelected }: CanvasItemProps) {
  const controls = useDragControls();
  const rotateControlRef = useRef<HTMLDivElement>(null);
  const resizeControlRef = useRef<HTMLDivElement>(null);

  const handleRotate = (event: MouseEvent | TouchEvent | PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const imageRef = (event.target as HTMLElement)?.closest('.canvas-item-wrapper');
    if (!imageRef) return;
    
    const { left, top, width, height } = imageRef.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      onUpdate({ ...item, rotation: angle * (180 / Math.PI) + 90 }); // +90 to offset initial handle position
    };
    
    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', upHandler);
    };
    
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchmove', moveHandler);
    window.addEventListener('touchend', upHandler);
  };
  
  const handleResize = (event: MouseEvent | TouchEvent | PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const imageRef = (event.target as HTMLElement)?.closest('.canvas-item-wrapper');
    if (!imageRef) return;
    
    const { left, top } = imageRef.getBoundingClientRect();

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const newWidth = Math.max(MIN_SIZE, clientX - left);
      const newHeight = Math.max(MIN_SIZE, clientY - top);
      
      onUpdate({ ...item, width: newWidth, height: newHeight });
    };

    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchmove', moveHandler);
    window.addEventListener('touchend', upHandler);
  };


  return (
    <motion.div
      className="canvas-item-wrapper absolute cursor-grab active:cursor-grabbing"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: isSelected ? 10 : 1,
      }}
      animate={{ rotate: item.rotation }}
      drag={isEditMode}
      dragControls={controls}
      onDragEnd={(event, info: PanInfo) => {
        onUpdate({ ...item, x: item.x + info.offset.x, y: item.y + info.offset.y });
      }}
      onTap={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
      <div className={cn("relative w-full h-full transition-all duration-200", {
        'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-sm': isSelected && isEditMode,
      })}>
        <Image
          src={item.url}
          alt="Canvas image"
          layout="fill"
          objectFit="cover"
          className="pointer-events-none rounded-sm shadow-lg"
        />

        {isSelected && isEditMode && (
          <>
            {/* Delete button */}
            <div
              className="absolute -top-3 -right-3 z-20 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            >
              <Trash2 size={14} />
            </div>

            {/* Rotate handle */}
            <div
              ref={rotateControlRef}
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-alias hover:scale-110 transition-transform"
              onPointerDown={handleRotate}
            >
              <RefreshCw size={14} />
            </div>

            {/* Resize handle */}
            <div
              ref={resizeControlRef}
              className="absolute -bottom-3 -right-3 z-20 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-nwse-resize hover:scale-110 transition-transform"
              onPointerDown={handleResize}
            >
              <Expand size={14} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
