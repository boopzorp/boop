"use client";

import { useState } from 'react';
import type { EntryType } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type NewTabDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddTab: (newTab: {label: string, type: EntryType}) => void;
};

export function NewTabDialog({ isOpen, onOpenChange, onAddTab }: NewTabDialogProps) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<EntryType>("book");

  const handleSubmit = () => {
    if (label.trim()) {
      onAddTab({ label: label.trim(), type });
      setLabel(""); // Reset form
      setType("book");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tab</DialogTitle>
          <DialogDescription>
            Create a new tab for your shelf. Choose a name and a base category for item sizing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tab Name
            </Label>
            <Input
              id="name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Video Games"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={type} onValueChange={(value: EntryType) => setType(value)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="book">Book (Thick Spine)</SelectItem>
                    <SelectItem value="manga">Manga (Thick Spine)</SelectItem>
                    <SelectItem value="movie">Movie (Medium Spine)</SelectItem>
                    <SelectItem value="anime">Anime (Medium Spine)</SelectItem>
                    <SelectItem value="music">Music (Thin Spine)</SelectItem>
                    <SelectItem value="blog">Blog (Landscape)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Add Tab</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
