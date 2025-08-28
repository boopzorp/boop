
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CanvasImage } from '@/types';
import { CanvasItem } from './canvas-item';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync with external changes (e.g., switching tabs)
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleUpdateImage = (updatedItem: CanvasImage) => {
    setImages(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
  };

  const addImageToCanvas = useCallback((url: string) => {
    const newImage: CanvasImage = {
      id: generateId(),
      url,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
    };
    setImages(prev => [...prev, newImage]);
  }, []);
  
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
      onClick={() => isEditMode && setSelectedImageId(null)}
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

      {images.map(item => (
        <div key={item.id} onClick={(e) => e.stopPropagation()}>
            <CanvasItem
              item={item}
              isEditMode={isEditMode}
              onUpdate={handleUpdateImage}
              onDelete={handleDeleteImage}
              onSelect={handleSelectImage}
              isSelected={selectedImageId === item.id}
            />
        </div>
      ))}

      {isEditMode && (
        <div className="absolute bottom-4 right-4 z-20">
          <Button onClick={() => onSave(images)}>Save Canvas</Button>
        </div>
      )}
    </div>
  );
}
