"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { BlockEditor } from '@/components/block-editor';
import { generate } from '@/ai/flows/generate-flow';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { GenerateOutputSchema } from '@/ai/flows/schemas';
import { Logo } from '@/components/logo';
import type { Block, Tab } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const initialTabs: Tab[] = [
  { id: 'book', label: 'Books', type: 'book' },
  { id: 'movie', label: 'Movies', type: 'movie' },
  { id: 'music', label: 'Music', type: 'music' },
];

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [selectedTabId, setSelectedTabId] = useState<string>('book');
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // In a real app, tabs would be fetched from a database.
  // For now, we'll use a hardcoded list that matches the admin page.
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);

  const handleSave = () => {
    // Here you would typically save the content to a database.
    // For now, we'll just log it to the console.
    const selectedTab = tabs.find(t => t.id === selectedTabId);
    console.log({ title, tabId: selectedTabId, type: selectedTab?.type, blocks });
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
          <Link href="/admin" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleGenerate} variant="outline" disabled={isGenerating}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Link href="/admin">
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
          <div className="w-1/3">
            <Label htmlFor="tab">Tab</Label>
            <Select value={selectedTabId} onValueChange={(value: string) => setSelectedTabId(value)}>
                <SelectTrigger id="tab">
                    <SelectValue placeholder="Select a tab" />
                </SelectTrigger>
                <SelectContent>
                    {tabs.map(tab => (
                        <SelectItem key={tab.id} value={tab.id}>{tab.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <BlockEditor title={title} onTitleChange={setTitle} blocks={blocks} onBlocksChange={setBlocks} />
        </div>
      </main>
    </div>
  );
}
