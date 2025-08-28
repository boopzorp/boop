
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CanvasImage } from '@/types';
import { CanvasItem } from './canvas-item';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { uploadImageFromString } from '@/lib/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon, RotateCw, Trash2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

type CanvasProps = {
  images: CanvasImage[];
  isEditMode: boolean;
  onSave: (images: CanvasImage[]) => void;
  tabId: string | null | undefined;
};

export function Canvas({ images: initialImages, isEditMode, onSave, tabId }: CanvasProps) {
  const [images, setImages] = useState<CanvasImage[]>(initialImages);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only update from props if not in edit mode to avoid overwriting changes
    if (!isEditMode) {
      setImages(initialImages);
    }
  }, [initialImages, isEditMode]);
  
  // Deselect item if edit mode is turned off
  useEffect(() => {
    if (!isEditMode) {
      setSelectedItemId(null);
    }
  }, [isEditMode]);

  const handleItemUpdate = (updatedItem: CanvasImage) => {
    setImages(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
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
        const newId = doc(collection(db, 'tmp')).id;
        const imageName = `canvas-image-${Date.now()}-${newId}`;
        const imagePath = `tabs/${tabId}/canvas/${imageName}`;
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
          id: newId,
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
    if (e.target === canvasRef.current && isEditMode) {
      setSelectedItemId(null);
    }
  };

  const selectedImage = images.find(img => img.id === selectedItemId);

  const handleSizeChange = (newSize: number[]) => {
    if (!selectedImage) return;
    const newWidth = newSize[0];
    // Maintain aspect ratio
    const aspectRatio = selectedImage.height / selectedImage.width;
    const newHeight = newWidth * aspectRatio;
    handleItemUpdate({ ...selectedImage, width: newWidth, height: newHeight });
  };
  
  const handleRotationChange = (newRotation: number[]) => {
    if (!selectedImage) return;
    handleItemUpdate({ ...selectedImage, rotation: newRotation[0] });
  };

  // Determine the required size of the canvas
  const canvasBounds = images.reduce((acc, image) => {
    const right = image.x + image.width;
    const bottom = image.y + image.height;
    if (right > acc.width) acc.width = right;
    if (bottom > acc.height) acc.height = bottom;
    return acc;
  }, { width: 500, height: 500 }); // Minimum size
  
  return (
    <div 
      ref={canvasRef}
      className="absolute top-0 left-0"
      style={{
        width: `${canvasBounds.width}px`,
        height: `${canvasBounds.height}px`,
      }}
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
            />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {isEditMode && selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-30 bg-background p-3 rounded-lg shadow-lg border w-full max-w-sm"
          >
            <div className="grid gap-4">
               <div className="space-y-2">
                 <Label htmlFor="size-slider" className="flex items-center gap-2 text-sm">
                   <ImageIcon className="h-4 w-4" /> Size
                 </Label>
                 <Slider
                   id="size-slider"
                   min={50}
                   max={800}
                   step={10}
                   value={[selectedImage.width]}
                   onValueChange={handleSizeChange}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="rotation-slider" className="flex items-center gap-2 text-sm">
                   <RotateCw className="h-4 w-4" /> Rotation
                 </Label>
                 <Slider
                   id="rotation-slider"
                   min={-180}
                   max={180}
                   step={1}
                   value={[selectedImage.rotation]}
                   onValueChange={handleRotationChange}
                 />
               </div>
               <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDeleteImage(selectedImage.id)}
               >
                 <Trash2 className="mr-2 h-4 w-4" />
                 Delete Image
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditMode && (
        <div className="fixed bottom-4 right-4 z-30">
          <Button onClick={() => onSave(images)}>Save Canvas</Button>
        </div>
      )}
    </div>
  );
}
