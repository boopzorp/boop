"use client";

import React, { useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { Textarea } from './ui/textarea';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/lib/utils';

type Block = {
  id: string;
  type: string;
  content: string;
};

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentIndex = blocks.findIndex(block => block.id === id);
      const newBlock = { id: `${Date.now()}`, type: 'paragraph', content: '' };
      const newBlocks = [
        ...blocks.slice(0, currentIndex + 1),
        newBlock,
        ...blocks.slice(currentIndex + 1)
      ];
      onBlocksChange(newBlocks);
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
    if (lastBlock) {
      const lastElement = document.getElementById(lastBlock.id);
      if (lastElement) {
        (lastElement as HTMLTextAreaElement).focus();
      }
    }
  }, [blocks.length]);


  return (
    <div className="space-y-4">
       <AutoSizingTextarea
        id="title"
        placeholder="Entry Title..."
        className="text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      
      <div className="space-y-2">
        {blocks.map(block => (
          <div key={block.id} className="group flex items-start gap-2">
             <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab mt-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
             </div>
            <AutoSizingTextarea
              id={block.id}
              placeholder="Tell your story..."
              className="text-lg border-none focus-visible:ring-0 shadow-none p-0 min-h-[28px] bg-transparent"
              value={block.content}
              onChange={e => handleBlockChange(block.id, e.target.value)}
              onKeyDown={e => handleKeyDown(e, block.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
