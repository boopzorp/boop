
"use client";

import React from 'react';
import { GripVertical, Image as ImageIcon, Pilcrow, Bold, Italic, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Block } from '@/types';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { editorExtensions } from './block-editor/extensions';
import { Reorder } from 'framer-motion';

type BlockEditorProps = {
  title: string;
  onTitleChange: (title: string) => void;
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
};

const AutoSizingTextarea = ({ value, onChange, className, ...props }: React.ComponentProps<typeof Input>) => {
  return <Input value={value} onChange={onChange} className={cn("resize-none overflow-hidden", className)} {...props} />;
};


const ParagraphBlock = ({ block, onChange, onEnter, onBackspaceEmpty }: { block: Block, onChange: (content: any) => void, onEnter: () => void, onBackspaceEmpty: () => void }) => {
    const editor = useEditor({
        extensions: editorExtensions,
        content: typeof block.content === 'string' ? `<p>${block.content}</p>` : block.content,
        onUpdate: ({ editor }) => {
          onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
              class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none text-lg border-none focus-visible:ring-0 shadow-none p-0 min-h-[28px] bg-transparent w-full',
            },
        },
    });

    if (!editor) {
        return null;
    }

    editor.setOptions({
        editorProps: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onEnter();
              return true;
            }
            if (event.key === 'Backspace' && editor.state.doc.textContent.length === 0) {
                event.preventDefault();
                onBackspaceEmpty();
                return true;
            }
            return false;
          },
        },
    });

    return (
        <div className="relative w-full">
             <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="flex items-center gap-1 bg-secondary p-1 rounded-md shadow-lg border">
                    <Button variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
                    <Button variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
                    <Button variant={editor.isActive('link') ? 'secondary' : 'ghost'} size="sm" onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                        }
                    }}><LinkIcon className="h-4 w-4" /></Button>
                </div>
            </BubbleMenu>
            <EditorContent editor={editor} id={block.id} />
        </div>
    );
};


export function BlockEditor({ title, onTitleChange, blocks, onBlocksChange }: BlockEditorProps) {

  const handleBlockChange = (id: string, newContent: any) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, content: newContent } : block
    );
    onBlocksChange(newBlocks);
  };

  const addBlock = (type: 'paragraph' | 'image', index: number) => {
    const newBlock: Block = { 
        id: `${Date.now()}`, 
        type, 
        content: type === 'paragraph' ? { type: 'doc', content: [{ type: 'paragraph' }] } : '' 
    };
    const newBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ];
    onBlocksChange(newBlocks);

     // Focus the new block
     setTimeout(() => {
        const newElement = document.getElementById(newBlock.id);
        if (newElement) {
            const editorEl = newElement.querySelector<HTMLElement>('[contenteditable="true"]');
            if (editorEl) {
                editorEl.focus();
            }
        }
    }, 50);

  };

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    if (newBlocks.length === 0) {
      newBlocks.push({ id: `${Date.now()}`, type: 'paragraph', content: { type: 'doc', content: [{ type: 'paragraph' }] } });
    }
    onBlocksChange(newBlocks);
  };
 
  return (
    <div className="space-y-4">
       <AutoSizingTextarea
        id="title"
        placeholder="Entry Title..."
        className="text-3xl md:text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      
      <Reorder.Group axis="y" values={blocks} onReorder={onBlocksChange} className="space-y-2">
        {blocks.map((block, index) => (
          <Reorder.Item key={block.id} value={block} dragListener={false}>
             <div className="group flex items-start gap-2 relative">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab mt-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                {block.type === 'paragraph' ? (
                    <ParagraphBlock 
                        block={block}
                        onChange={(newContent) => handleBlockChange(block.id, newContent)}
                        onEnter={() => addBlock('paragraph', index)}
                        onBackspaceEmpty={() => removeBlock(block.id)}
                    />
                ) : (
                <div className="w-full p-4 border rounded-lg flex flex-col gap-2">
                    {block.content ? (
                    <Image src={block.content as string} alt="User uploaded content" width={800} height={400} className="rounded-md object-contain w-full max-h-96" />
                    ) : null}
                    <Input 
                        id={block.id}
                        type="url"
                        placeholder="Enter image URL..."
                        value={block.content as string}
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
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
