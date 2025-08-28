
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CanvasImage } from '@/types';
import { CanvasItem } from './canvas-item';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

type CanvasProps = {
  images: CanvasImage[];
  isEditMode: boolean;
  onSave: (images: CanvasImage[]) => void;
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function Canvas({ images: initialImages, isEditMode, onSave }: CanvasProps) {
  const [images, setImages] = useState<CanvasImage[]>(initialImages);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);
  
  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(item => item.id !== id));
  };

  const addImageToCanvas = useCallback((url: string) => {
    // Hardcoded positions for simplicity, as per user request
    const positions = [
      { x: 50, y: 50, rotation: -5 },
      { x: 250, y: 100, rotation: 3 },
      { x: 450, y: 80, rotation: -2 },
      { x: 100, y: 280, rotation: 6 },
      { x: 350, y: 300, rotation: -4 },
    ];
    const position = positions[images.length % positions.length];
    
    const newImage: CanvasImage = {
      id: generateId(),
      url,
      x: position.x,
      y: position.y,
      width: 200,
      height: 200,
      rotation: position.rotation,
    };
    setImages(prev => [...prev, newImage]);
  }, [images.length]);
  
  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (!isEditMode) return;
    const items = event.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              addImageToCanvas(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, [isEditMode, addImageToCanvas]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isEditMode) return;
    const files = event.dataTransfer.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              addImageToCanvas(e.target.result as string);
            }
          };
          reader.readAsDataURL(files[i]);
        }
      }
    }
  }, [isEditMode, addImageToCanvas]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);
  
  return (
    <div 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {isEditMode && (
        <div 
          className={cn(
              "absolute inset-0 z-20 flex items-center justify-center text-center p-4 rounded-lg pointer-events-none",
              "border-2 border-dashed border-primary/50 bg-primary/10",
              { "opacity-0": images.length > 0 }
          )}
        >
          <div>
              <h3 className="text-lg font-semibold text-primary">Drop or Paste Images Here</h3>
              <p className="text-sm text-muted-foreground">Drag files from your computer or paste from clipboard.</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {images.map(item => (
            <CanvasItem
              key={item.id}
              item={item}
              isEditMode={isEditMode}
              onDelete={handleDeleteImage}
            />
        ))}
      </AnimatePresence>


      {isEditMode && (
        <div className="absolute bottom-4 right-4 z-20">
          <Button onClick={() => onSave(images)}>Save Canvas</Button>
        </div>
      )}
    </div>
  );
}
