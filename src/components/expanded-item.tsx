"use client"

import Image from 'next/image';
import { X } from 'lucide-react';
import type { Entry } from "@/types";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ExpandedItemProps = {
  item: Entry;
  onClose: () => void;
};

const imageDimensions = {
  book: { width: 150, height: 225, hint: 'book cover' },
  movie: { width: 150, height: 225, hint: 'movie poster' },
  music: { width: 150, height: 150, hint: 'album art' },
};

export function ExpandedItem({ item, onClose }: ExpandedItemProps) {
  const { width, height, hint } = imageDimensions[item.type];

  return (
    <Card className="mt-4 relative overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={`Cover for ${item.title}`}
            width={width}
            height={height}
            className="rounded-md object-cover shadow-lg"
            data-ai-hint={hint}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold font-headline">{item.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{item.creator}</p>
          <h4 className="text-sm font-semibold mb-2">My Notes</h4>
          <div className="max-h-40 overflow-y-auto rounded-md border bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {item.notes || 'No notes yet.'}
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-2 text-right">
              Added on {item.addedAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        onClick={onClose}
        aria-label="Close details"
      >
        <X className="h-4 w-4" />
      </Button>
    </Card>
  );
}
