"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { BlockEditor } from '@/components/block-editor';
import { generate } from '@/ai/flows/generate-flow';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { GenerateOutputSchema } from '@/ai/flows/schemas';
import { Logo } from '@/components/logo';

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<{ id: string; type: string; content: string }[]>([
    { id: '1', type: 'paragraph', content: '' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Here you would typically save the content to a database.
    // For now, we'll just log it to the console.
    console.log({ title, blocks });
    toast({
      title: 'Entry Saved!',
      description: 'Your journal entry has been saved to the console.',
    });
  };
  
  const handleGenerate = async () => {
    if (!title) {
      toast({
        title: 'Title is required',
        description: 'Please enter a title before generating content.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result: z.infer<typeof GenerateOutputSchema> = await generate({ title });
      const newBlocks = result.story.map((paragraph, index) => ({
        id: `${Date.now()}-${index}`,
        type: 'paragraph',
        content: paragraph,
      }));
      setBlocks(newBlocks);
    } catch (error) {
       toast({
        title: 'Error Generating Content',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleGenerate} variant="outline" disabled={isGenerating}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shelf
            </Button>
          </Link>
          <Button onClick={handleSave}>Publish</Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-24">
        <div className="w-full max-w-4xl mx-auto p-8 space-y-6">
          <BlockEditor title={title} onTitleChange={setTitle} blocks={blocks} onBlocksChange={setBlocks} />
        </div>
      </main>
    </div>
  );
}
