
"use client";

import React, { useCallback } from 'react';
import { GripVertical, Image as ImageIcon, Pilcrow, Bold, Italic, Link as LinkIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Block } from '@/types';
import { useEditor, EditorContent, BubbleMenu } from '@tiap-tap/react';
import type { Editor } from '@tiap-tap/react';
import { editorExtensions } from './block-editor/extensions';
import { Reorder, useDragControls } from 'framer-motion';
import type { JSONContent } from '@tiap-tap/react';

type BlockEditorProps = {
  title: string;
  onTitleChange: (title: string) => void;
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
};

const isValidJSONContent = (content: any): boolean => {
    return content && typeof content === 'object' && content.type === 'doc';
};

export function BlockEditor({ title, onTitleChange, blocks, onBlocksChange }: BlockEditorProps) {
  
  const editor = useEditor({
    extensions: editorExtensions,
    content: {
      type: 'doc',
      content: blocks
        .filter(b => b.type === 'paragraph')
        .map(block => {
            if (isValidJSONContent(block.content)) return block.content as JSONContent;
            return { type: 'paragraph', content: [{ type: 'text', text: block.content as string || '' }] };
        })
    },
    onUpdate: ({ editor }) => {
        const jsonContent = editor.getJSON().content || [];
        
        let contentIndex = 0;
        const newBlocks = blocks.map(block => {
            if (block.type === 'paragraph') {
                const newContent = jsonContent[contentIndex];
                contentIndex++;
                if (newContent) {
                    return { ...block, content: newContent };
                }
                return null; // This paragraph was deleted
            }
            return block; // Keep image blocks as they are
        }).filter(Boolean) as Block[];

        // Add any new paragraphs created at the end
        while(contentIndex < jsonContent.length) {
            newBlocks.push({
                id: `${Date.now()}-${contentIndex}`,
                type: 'paragraph',
                content: jsonContent[contentIndex] as JSONContent
            });
            contentIndex++;
        }

        onBlocksChange(newBlocks);
    },
    editorProps: {
        attributes: {
          class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none text-lg border-none focus-visible:ring-0 shadow-none p-0 bg-transparent w-full text-foreground',
        },
    },
  });


  React.useEffect(() => {
    if (editor && !editor.isDestroyed && blocks) {
        const newContent = {
            type: 'doc',
            content: blocks
                .filter(b => b.type === 'paragraph')
                .map(block => {
                if (isValidJSONContent(block.content)) return block.content as JSONContent;
                return { type: 'paragraph', content: [{ type: 'text', text: block.content as string || '' }] };
            })
        };
        // Avoids re-rendering if content is the same, preventing focus loss
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(newContent)) {
             editor.commands.setContent(newContent, false);
        }
    }
  }, [blocks, editor]);

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

     setTimeout(() => {
        if (type === 'paragraph' && editor) {
           editor.commands.focus('end');
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

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const BlockItem = ({ block, index }: { block: Block; index: number }) => {
    const dragControls = useDragControls();
    return (
        <Reorder.Item 
            key={block.id} 
            value={block} 
            dragListener={false}
            dragControls={dragControls}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
           <div className="group flex items-start gap-2 relative">
              <div 
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab mt-2"
                onPointerDown={(e) => dragControls.start(e) }
              >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {block.type === 'image' && (
                 <div className="w-full p-2 border rounded-lg flex flex-col gap-2">
                  {block.content ? (
                  <Image src={block.content as string} alt="User uploaded content" width={800} height={400} className="rounded-md object-contain w-full max-h-96" />
                  ) : null}
                  <Input 
                      type="url"
                      placeholder="Enter image URL..."
                      value={block.content as string}
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                      className="bg-transparent"
                  />
                </div>
              )}
             
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background p-1 rounded-md shadow border -mr-12">
                  <Button variant="ghost" size="sm" onClick={() => addBlock('paragraph', index)}>
                      <Pilcrow className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => addBlock('image', index)}>
                      <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeBlock(block.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
              </div>
          </div>
        </Reorder.Item>
    )
  };
 
  return (
    <div className="space-y-4">
       <Input
        id="title"
        placeholder="Entry Title..."
        className="text-3xl md:text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      
        {editor && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="flex items-center gap-1 bg-background p-1 rounded-md shadow-lg border">
                    <Button variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
                    <Button variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
                    <Button variant={editor.isActive('link') ? 'secondary' : 'ghost'} size="sm" onClick={setLink}><LinkIcon className="h-4 w-4" /></Button>
                </div>
            </BubbleMenu>
        )}
        
        <Reorder.Group axis="y" values={blocks} onReorder={onBlocksChange} className="space-y-2">
            {blocks.map((block, index) => (
                block.type === 'image' 
                ? <BlockItem key={block.id} block={block} index={index} />
                : null
            ))}
        </Reorder.Group>
      
        <EditorContent editor={editor} />
    </div>
  );
}
