
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { editorExtensions } from './block-editor/extensions';
import { useCallback, useState } from 'react';
import {
  Bold, Italic, Underline, Link as LinkIcon, Pilcrow,
  Heading1, Heading2, Heading3, Heading4, List, ListOrdered, Image as ImageIcon, Minus, Quote, CaseSensitive
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { AddImageDialog } from './add-image-dialog';
import { LinkDialog } from './link-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type BlockEditorProps = {
  content: string;
  onChange: (richText: string) => void;
};

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState('');

  const addImage = useCallback((url: string, alt: string) => {
    if (url) {
      editor?.chain().focus().setImage({ src: url, alt: alt || '' }).run();
    }
    setIsImageDialogOpen(false);
  }, [editor]);

  const openLinkDialog = useCallback(() => {
    const url = editor?.getAttributes('link').href || '';
    setCurrentLink(url);
    setIsLinkDialogOpen(true);
  }, [editor]);

  const handleSetLink = useCallback((url: string) => {
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setIsLinkDialogOpen(false);
  }, [editor]);

  const handleFontSizeChange = (value: string) => {
    if (value === 'default') {
      editor?.chain().focus().unsetFontSize().run();
    } else {
      editor?.chain().focus().setFontSize(value).run();
    }
  };

  const getActiveFontSize = () => {
    const attrs = editor?.getAttributes('textStyle');
    return attrs?.fontSize || 'default';
  };

  if (!editor) {
    return null;
  }

  return (
    <>
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
          variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={cn({ 'bg-accent': editor.isActive('heading', { level: 4 }) })}
        > <Heading4 className="h-4 w-4" /> </Button>
        <Button
          variant="ghost" size="sm" onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn({ 'bg-accent': editor.isActive('paragraph') })}
        > <Pilcrow className="h-4 w-4" /> </Button>
        
        <div className="w-24">
            <Select value={getActiveFontSize()} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Font Size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="14px">14px</SelectItem>
                    <SelectItem value="18px">18px</SelectItem>
                    <SelectItem value="24px">24px</SelectItem>
                    <SelectItem value="30px">30px</SelectItem>
                </SelectContent>
            </Select>
        </div>

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
        <Button variant="ghost" size="sm" onClick={openLinkDialog}>
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
        <Button
            variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn({ 'bg-accent': editor.isActive('blockquote') })}
        > <Quote className="h-4 w-4" /> </Button>
        <Button
            variant="ghost" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}
        > <Minus className="h-4 w-4" /> </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsImageDialogOpen(true)}>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <AddImageDialog 
        isOpen={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onAddImage={addImage}
      />
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        initialUrl={currentLink}
        onSetLink={handleSetLink}
       />
    </>
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
        class: 'max-w-none focus:outline-none min-h-[200px] p-4 text-foreground prose-p:text-foreground',
      },
    },
  });

  return (
    <div className="w-full border rounded-md shadow-sm">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="tiptap" />
    </div>
  );
}
