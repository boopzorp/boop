
"use client";

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { editorExtensions } from './block-editor/extensions';
import { useCallback } from 'react';
import {
  Bold, Italic, Underline, Link as LinkIcon, Pilcrow,
  Heading1, Heading2, Heading3, List, ListOrdered, Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type BlockEditorProps = {
  content: string;
  onChange: (richText: string) => void;
};

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');
    const alt = window.prompt('Image Description / Alt Text');

    if (url) {
      editor?.chain().focus().setImage({ src: url, alt: alt || '' }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input rounded-t-md p-2 flex items-center flex-wrap gap-1 bg-background">
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn({ 'bg-accent': editor.isActive('heading', { level: 1 }) })}
      > <Heading1 className="h-4 w-4" /> </Button>
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn({ 'bg-accent': editor.isActive('heading', { level: 2 }) })}
      > <Heading2 className="h-4 w-4" /> </Button>
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn({ 'bg-accent': editor.isActive('heading', { level: 3 }) })}
      > <Heading3 className="h-4 w-4" /> </Button>
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().setParagraph().run()}
        className={cn({ 'bg-accent': editor.isActive('paragraph') })}
      > <Pilcrow className="h-4 w-4" /> </Button>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn({ 'bg-accent': editor.isActive('bold') })}
      > <Bold className="h-4 w-4" /> </Button>
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn({ 'bg-accent': editor.isActive('italic') })}
      > <Italic className="h-4 w-4" /> </Button>
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn({ 'bg-accent': editor.isActive('underline') })}
      > <Underline className="h-4 w-4" /> </Button>
      <Button variant="ghost" size="sm" onClick={setLink}>
        <LinkIcon className={cn("h-4 w-4", { 'text-primary': editor.isActive('link') })} />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn({ 'bg-accent': editor.isActive('bulletList') })}
      > <List className="h-4 w-4" /> </Button>
      <Button
        variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn({ 'bg-accent': editor.isActive('orderedList') })}
      > <ListOrdered className="h-4 w-4" /> </Button>
      <Button variant="ghost" size="sm" onClick={addImage}> <ImageIcon className="h-4 w-4" /> </Button>
    </div>
  );
};

export function BlockEditor({ content, onChange }: BlockEditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  return (
    <div className="w-full border rounded-md shadow-sm">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
