
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CanvasImage } from '@/types';
import { CanvasItem } from './canvas-item';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { uploadImageFromString } from '@/lib/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type CanvasProps = {
  images: CanvasImage[];
  isEditMode: boolean;
  onSave: (images: CanvasImage[]) => void;
  tabId: string | null | undefined;
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function Canvas({ images: initialImages, isEditMode, onSave, tabId }: CanvasProps) {
  const [images, setImages] = useState<CanvasImage[]>(initialImages);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleItemUpdate = (updatedItem: CanvasImage) => {
    setImages(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(item => item.id !== id));
  };

  const addImageToCanvas = useCallback(async (dataUrl: string) => {
    if (!tabId) {
        toast({
            title: 'No Active Tab',
            description: 'Please select a tab before adding images.',
            variant: 'destructive',
        });
        return;
    }
    setIsUploading(true);
    try {
        const imageName = `canvas-image-${Date.now()}-${generateId()}`;
        const imagePath = `tabs/${tabId}/${imageName}`;
        const downloadURL = await uploadImageFromString(dataUrl, imagePath);

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
          url: downloadURL,
          x: position.x,
          y: position.y,
          width: 200,
          height: 200,
          rotation: position.rotation,
        };
        setImages(prev => [...prev, newImage]);
    } catch (error) {
        console.error("Failed to upload image:", error);
        toast({
            title: 'Upload Failed',
            description: 'Could not upload the image. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsUploading(false);
    }
  }, [images.length, tabId, toast]);
  
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If we click the canvas itself and not an item on it, deselect.
    if (e.target === canvasRef.current) {
      setSelectedItemId(null);
    }
  };
  
  return (
    <div 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {isEditMode && (
        <div 
          className={cn(
              "absolute inset-0 z-0 flex items-center justify-center text-center p-4 rounded-lg pointer-events-none",
              "border-2 border-dashed border-primary/50 bg-primary/10",
              { "opacity-0": images.length > 0 && !isUploading }
          )}
        >
          {isUploading ? (
            <div>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
            </div>
          ) : (
             <div>
                <h3 className="text-lg font-semibold text-primary">Drop or Paste Images Here</h3>
                <p className="text-sm text-muted-foreground">Drag files from your computer or paste from clipboard.</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {images.map(item => (
            <CanvasItem
              key={item.id}
              item={item}
              isEditMode={isEditMode}
              isSelected={selectedItemId === item.id}
              onSelect={() => setSelectedItemId(item.id)}
              onUpdate={handleItemUpdate}
              onDelete={handleDeleteImage}
            />
        ))}
      </AnimatePresence>


      {isEditMode && (
        <div className="absolute bottom-4 right-4 z-30">
          <Button onClick={() => onSave(images)}>Save Canvas</Button>
        </div>
      )}
    </div>
  );
}
