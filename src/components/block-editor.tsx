
"use client";

import React from 'react';
import { GripVertical, Image as ImageIcon, Pilcrow, Bold, Italic, Link as LinkIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Block } from '@/types';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { editorExtensions } from './block-editor/extensions';
import { Reorder, useDragControls } from 'framer-motion';
import type { JSONContent } from '@tiptap/react';

type BlockEditorProps = {
  title: string;
  onTitleChange: (title: string) => void;
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
};

const ParagraphBlock = ({ block, editor }: { block: Block; editor: Editor | null }) => {
    if (!editor) return null;
    // This is a dummy component now, the real editor is in the parent.
    // It's mainly for structure and layout within the draggable list.
    return <div id={block.id} className="w-full prose prose-lg dark:prose-invert focus:outline-none max-w-none text-lg border-none focus-visible:ring-0 shadow-none p-0 min-h-[28px] bg-transparent" />;
};


export function BlockEditor({ title, onTitleChange, blocks, onBlocksChange }: BlockEditorProps) {
  
  const isValidJSONContent = (content: any): boolean => {
    return content && typeof content === 'object' && content.type === 'doc';
  };

  const editor = useEditor({
    extensions: editorExtensions,
    content: {
      type: 'doc',
      content: blocks.map(block => {
        if (block.type === 'paragraph') {
          return isValidJSONContent(block.content) ? block.content as JSONContent : { type: 'paragraph', content: [{ type: 'text', text: block.content as string || '' }] };
        }
        // We will render images separately, so we just need a placeholder node
        return { type: 'imagePlaceholder', attrs: { blockId: block.id } };
      })
    },
    onUpdate: ({ editor }) => {
        const json = editor.getJSON().content || [];
        const updatedBlocks: Block[] = [];
        json.forEach(node => {
            if (node.type === 'imagePlaceholder') {
                const blockId = node.attrs?.blockId;
                const existingBlock = blocks.find(b => b.id === blockId);
                if (existingBlock) {
                    updatedBlocks.push(existingBlock);
                }
            } else {
                // Find a corresponding paragraph block to reuse its ID, or create a new one
                const existingBlock = blocks.find(b => b.type === 'paragraph' && JSON.stringify(b.content) === JSON.stringify(node));
                const blockId = existingBlock?.id || `${Date.now()}-${Math.random()}`;
                updatedBlocks.push({
                    id: blockId,
                    type: 'paragraph',
                    content: node
                });
            }
        });
       
        // This is a simplified update. A more robust solution would be needed for complex cases.
        // For now, let's find the corresponding blocks from the editor's view
        const editorBlocks: Block[] = [];
        const docContent = editor.state.doc.content;

        docContent.forEach((node, offset) => {
            if (node.type.name === 'imagePlaceholder') {
                 const blockId = node.attrs.blockId;
                 const originalBlock = blocks.find(b => b.id === blockId);
                 if (originalBlock) editorBlocks.push(originalBlock);
            } else {
                 const blockId = `${Date.now()}-${offset}`; // In a real app, you'd need a better ID strategy
                 const existingBlock = blocks.find(b => b.type === 'paragraph' && JSON.stringify(b.content) === JSON.stringify(node.toJSON()));
                 editorBlocks.push({
                    id: existingBlock?.id || blockId,
                    type: 'paragraph',
                    content: node.toJSON() as JSONContent
                 })
            }
        });

        // A hacky way to map content back to blocks. TipTap doesn't make this easy.
        // A better approach would be custom nodes that store the block ID.
        let blockIndex = 0;
        const newBlocks = editor.getJSON().content?.map(nodeContent => {
            if (nodeContent.type === 'imagePlaceholder') {
                const block = blocks.find(b => b.id === nodeContent.attrs?.blockId);
                return block!;
            }
            // Find the next paragraph block
            while(blockIndex < blocks.length && blocks[blockIndex].type !== 'paragraph') {
                blockIndex++;
            }
            if (blockIndex < blocks.length) {
                const block = blocks[blockIndex];
                blockIndex++;
                return { ...block, content: nodeContent };
            }
            // If we run out of blocks, create a new one
            return { id: `${Date.now()}`, type: 'paragraph', content: nodeContent };
        }).filter(Boolean) as Block[];

        // onBlocksChange(newBlocks);
    },
    editorProps: {
        attributes: {
          class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none text-lg border-none focus-visible:ring-0 shadow-none p-0 bg-transparent w-full',
        },
    },
  });


  React.useEffect(() => {
    if (editor && !editor.isDestroyed && blocks) {
        const newContent = {
            type: 'doc',
            content: blocks.map(block => {
                if (block.type === 'paragraph') {
                    // Ensure content is valid JSON, fallback if it's a string
                    if(isValidJSONContent(block.content)) return (block.content as JSONContent);
                    return { type: 'paragraph', content: [{ type: 'text', text: block.content as string || '' }] };
                }
                return { type: 'imagePlaceholder', attrs: { blockId: block.id } };
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
                onPointerDown={(e) => {
                  if (block.type === 'paragraph') {
                    // Dragging text is tricky, let's disable for now
                    return;
                  }
                  dragControls.start(e);
                }}
              >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {block.type === 'image' ? (
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
              ) : (
                <div className="w-full">
                  {/* The actual editor is rendered below, this is just a placeholder for layout */}
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
                    <Button variant={editor.isActive('link') ? 'secondary' : 'ghost'} size="sm" onClick={() => {
                        const previousUrl = editor.getAttributes('link').href;
                        const url = window.prompt('URL', previousUrl);

                        if (url === null) return;
                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run();
                            return;
                        }
                        
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }}><LinkIcon className="h-4 w-4" /></Button>
                </div>
            </BubbleMenu>
        )}
        
        {/* We use Reorder for images only for now */}
        <Reorder.Group axis="y" values={blocks.filter(b => b.type === 'image')} onReorder={(newImageBlocks) => {
            const newBlocks = blocks.map(b => b.type === 'image' ? newImageBlocks.shift()! : b);
            onBlocksChange(newBlocks);
        }} className="space-y-2">
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
