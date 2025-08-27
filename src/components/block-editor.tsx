
"use client";

import React, { useRef, useEffect } from 'react';
import { GripVertical, Image as ImageIcon, Pilcrow } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Block } from '@/types';

type BlockEditorProps = {
  title: string;
  onTitleChange: (title: string) => void;
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
};

const AutoSizingTextarea = ({ value, onChange, className, ...props }: React.ComponentProps<typeof Textarea>) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return <Textarea ref={textareaRef} value={value} onChange={onChange} className={cn("resize-none overflow-hidden", className)} {...props} />;
};

export function BlockEditor({ title, onTitleChange, blocks, onBlocksChange }: BlockEditorProps) {
  const handleBlockChange = (id: string, newContent: string) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, content: newContent } : block
    );
    onBlocksChange(newBlocks);
  };

  const addBlock = (type: 'paragraph' | 'image', index: number) => {
    const newBlock: Block = { id: `${Date.now()}`, type, content: '' };
    const newBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ];
    onBlocksChange(newBlocks);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentIndex = blocks.findIndex(block => block.id === id);
      addBlock('paragraph', currentIndex);
    } else if (e.key === 'Backspace' && blocks.find(b => b.id === id)?.content === '') {
        e.preventDefault();
        const newBlocks = blocks.filter(block => block.id !== id);
        if(newBlocks.length === 0) {
            newBlocks.push({ id: `${Date.now()}`, type: 'paragraph', content: '' });
        }
        onBlocksChange(newBlocks);
    }
  };
  
  useEffect(() => {
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock?.type === 'paragraph') {
      const lastElement = document.getElementById(lastBlock.id);
      if (lastElement) {
        (lastElement as HTMLTextAreaElement).focus();
      }
    }
  }, [blocks]);

  return (
    <div className="space-y-4">
       <AutoSizingTextarea
        id="title"
        placeholder="Entry Title..."
        className="text-3xl md:text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div key={block.id} className="group flex items-start gap-2 relative">
             <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab mt-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
             </div>
            {block.type === 'paragraph' ? (
              <AutoSizingTextarea
                id={block.id}
                placeholder="Tell your story..."
                className="text-lg border-none focus-visible:ring-0 shadow-none p-0 min-h-[28px] bg-transparent w-full"
                value={block.content}
                onChange={e => handleBlockChange(block.id, e.target.value)}
                onKeyDown={e => handleKeyDown(e, block.id)}
              />
            ) : (
               <div className="w-full p-4 border rounded-lg flex flex-col gap-2">
                {block.content ? (
                  <Image src={block.content} alt="User uploaded content" width={800} height={400} className="rounded-md object-contain w-full max-h-96" />
                ) : null}
                <Input 
                  id={block.id}
                  type="url"
                  placeholder="Enter image URL..."
                  value={block.content}
                  onChange={(e) => handleBlockChange(block.id, e.target.value)}
                  className="bg-transparent"
                />
               </div>
            )}
             <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 -top-4">
                <div className="flex items-center gap-1 bg-secondary p-1 rounded-md">
                    <Button variant="ghost" size="sm" onClick={() => addBlock('paragraph', index)}>
                        <Pilcrow className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => addBlock('image', index)}>
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
