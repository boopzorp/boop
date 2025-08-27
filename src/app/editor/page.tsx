"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { BlockEditor } from '@/components/block-editor';
import { generate } from '@/ai/flows/generate-flow';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { GenerateOutputSchema } from '@/ai/flows/schemas';
import { Logo } from '@/components/logo';
import type { Block, Tab, SpotifyTrack, Entry } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SpotifySearch } from '@/components/spotify-search';
import { useEntryStore } from '@/store/entries';

export default function EditorPage() {
  const router = useRouter();
  const { tabs, addEntry } = useEntryStore();
  
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTabId, setSelectedTabId] = useState<string>(tabs.length > 0 ? tabs[0].id : '');
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (tabs.length > 0 && !selectedTabId) {
      setSelectedTabId(tabs[0].id);
    }
  }, [tabs, selectedTabId]);

  const handleSave = () => {
    const selectedTab = tabs.find(t => t.id === selectedTabId);
    if (!selectedTab) {
      toast({
        title: 'No Tab Selected',
        description: 'Please select a tab for this entry.',
        variant: 'destructive',
      });
      return;
    }

    const newEntry: Omit<Entry, 'id' | 'addedAt'> = {
      title,
      creator,
      imageUrl,
      tabId: selectedTabId,
      type: selectedTab.type,
      notes: blocks.map(b => b.content).join('\n\n'), // Simple conversion for now
      content: blocks,
    };

    addEntry(newEntry);

    toast({
      title: 'Entry Published!',
      description: 'Your journal entry has been published.',
    });
    
    router.push('/admin');
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

  const handleTrackSelect = (track: SpotifyTrack) => {
    setTitle(track.name);
    setCreator(track.artists.map(a => a.name).join(', '));
    if (track.album.images.length > 0) {
      const coverUrl = track.album.images[0].url;
      setImageUrl(coverUrl);
      const newBlocks = blocks.filter(b => b.type !== 'image'); // Remove existing image block
      newBlocks.unshift({ id: `${Date.now()}`, type: 'image', content: coverUrl });
      // Clear empty paragraph if it's the only one left
      if (newBlocks.length > 1 && newBlocks[1].type === 'paragraph' && newBlocks[1].content === '') {
        newBlocks.splice(1, 1);
      }
      setBlocks(newBlocks);
    }
  };

  const activeTab = tabs.find(t => t.id === selectedTabId);

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

          {activeTab?.type === 'music' && (
            <div className="space-y-4">
              <Label>Search Spotify</Label>
              <SpotifySearch onTrackSelect={handleTrackSelect} />
            </div>
          )}

          <BlockEditor title={title} onTitleChange={setTitle} blocks={blocks} onBlocksChange={setBlocks} />
        </div>
      </main>
    </div>
  );
}
