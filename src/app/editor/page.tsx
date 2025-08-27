"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BlockEditor } from '@/components/block-editor';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import type { Block, Tab, SpotifyTrack, Entry, GoogleBookVolume, JikanAnime, JikanManga, OMDBSearchResult } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SpotifySearch } from '@/components/spotify-search';
import { BookSearch } from '@/components/book-search';
import { JikanSearch } from '@/components/jikan-search';
import { MangaSearch } from '@/components/manga-search';
import { OMDBSearch } from '@/components/omdb-search';
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

    const firstImage = blocks.find(b => b.type === 'image')?.content;

    const newEntry: Omit<Entry, 'id' | 'addedAt'> = {
      title,
      creator,
      imageUrl: imageUrl || firstImage || `https://picsum.photos/400/600`,
      tabId: selectedTabId,
      type: selectedTab.type,
      notes: blocks.filter(b => b.type === 'paragraph').map(b => b.content).join('\n\n'),
      content: blocks,
    };

    addEntry(newEntry);

    toast({
      title: 'Entry Published!',
      description: 'Your journal entry has been published.',
    });
    
    router.push('/admin');
  };

  const setEntryImage = (url: string) => {
    setImageUrl(url);
    const newBlocks = blocks.filter(b => b.type !== 'image');
    newBlocks.unshift({ id: `${Date.now()}`, type: 'image', content: url });
    if (newBlocks.length > 1 && newBlocks[1].type === 'paragraph' && newBlocks[1].content === '') {
      newBlocks.splice(1, 1);
    }
    setBlocks(newBlocks);
  };

  const handleTrackSelect = (track: SpotifyTrack) => {
    setTitle(track.name);
    setCreator(track.artists.map(a => a.name).join(', '));
    if (track.album.images.length > 0) {
      setEntryImage(track.album.images[0].url);
    }
  };

  const handleBookSelect = (book: GoogleBookVolume) => {
    setTitle(book.volumeInfo.title);
    setCreator(book.volumeInfo.authors?.join(', ') || 'Unknown Author');
    if (book.volumeInfo.imageLinks?.thumbnail) {
      setEntryImage(book.volumeInfo.imageLinks.thumbnail);
    }
  };

  const handleAnimeSelect = (anime: JikanAnime) => {
    setTitle(anime.title);
    setCreator(anime.studios.map(s => s.name).join(', '));
    if (anime.images.jpg.large_image_url) {
      setEntryImage(anime.images.jpg.large_image_url);
    }
  };

  const handleMangaSelect = (manga: JikanManga) => {
    setTitle(manga.title);
    setCreator(manga.authors.map(a => a.name).join(', '));
    if (manga.images.jpg.large_image_url) {
      setEntryImage(manga.images.jpg.large_image_url);
    }
  };

  const handleMovieSelect = (movie: OMDBSearchResult) => {
    setTitle(movie.Title);
    setCreator(movie.Year); // Basic search doesn't provide director, user can edit
    if (movie.Poster && movie.Poster !== 'N/A') {
      setEntryImage(movie.Poster);
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
          
          {(activeTab?.type === 'movie' || activeTab?.type === 'tv') && (
            <div className="space-y-4">
              <Label>Search OMDB</Label>
              <OMDBSearch onMovieSelect={handleMovieSelect} />
            </div>
          )}

          {activeTab?.type === 'music' && (
            <div className="space-y-4">
              <Label>Search Spotify</Label>
              <SpotifySearch onTrackSelect={handleTrackSelect} />
            </div>
          )}

          {activeTab?.type === 'book' && (
            <div className="space-y-4">
              <Label>Search Books</Label>
              <BookSearch onBookSelect={handleBookSelect} />
            </div>
          )}

          {activeTab?.type === 'anime' && (
            <div className="space-y-4">
              <Label>Search MyAnimeList</Label>
              <JikanSearch onAnimeSelect={handleAnimeSelect} />
            </div>
          )}

          {activeTab?.type === 'manga' && (
            <div className="space-y-4">
              <Label>Search MyAnimeList</Label>
              <MangaSearch onMangaSelect={handleMangaSelect} />
            </div>
          )}

          <BlockEditor title={title} onTitleChange={setTitle} blocks={blocks} onBlocksChange={setBlocks} />
        </div>
      </main>
    </div>
  );
}
