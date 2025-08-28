
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BlockEditor } from '@/components/block-editor';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import type { SpotifyTrack, Entry, GoogleBookVolume, JikanAnime, JikanManga, OMDBSearchResult } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SpotifySearch } from '@/components/spotify-search';
import { BookSearch } from '@/components/book-search';
import { JikanSearch } from '@/components/jikan-search';
import { MangaSearch } from '@/components/manga-search';
import { OMDBSearch } from '@/components/omdb-search';
import { useEntryStore } from '@/store/entries';

export default function EditorPage() {
  const router = useRouter();
  const { tabs, addEntry, fetchAllData, isLoaded } = useEntryStore();
  
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTabId, setSelectedTabId] = useState<string | undefined>(undefined);
  const [content, setContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded) {
      fetchAllData();
    }
  }, [isLoaded, fetchAllData]);

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !selectedTabId) {
      setSelectedTabId(tabs[0].id);
    }
  }, [isLoaded, tabs, selectedTabId]);

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
      imageUrl: imageUrl || `https://picsum.photos/400/600`,
      tabId: selectedTabId!,
      type: selectedTab.type,
      notes: content, // Save rich text HTML to 'notes' field
      content: [], // Deprecate old block content
    };

    addEntry(newEntry);

    toast({
      title: 'Entry Published!',
      description: 'Your journal entry has been published.',
    });
    
    router.push('/admin');
  };

  const handleTrackSelect = (track: SpotifyTrack) => {
    setTitle(track.name);
    setCreator(track.artists.map(a => a.name).join(', '));
    if (track.album.images.length > 0) {
      setImageUrl(track.album.images[0].url);
    }
  };

  const handleBookSelect = (book: GoogleBookVolume) => {
    setTitle(book.volumeInfo.title);
    setCreator(book.volumeInfo.authors?.join(', ') || 'Unknown Author');
    if (book.volumeInfo.imageLinks?.thumbnail) {
      setImageUrl(book.volumeInfo.imageLinks.thumbnail);
    }
  };

  const handleAnimeSelect = (anime: JikanAnime) => {
    setTitle(anime.title);
    setCreator(anime.studios.map(s => s.name).join(', '));
    if (anime.images.jpg.large_image_url) {
      setImageUrl(anime.images.jpg.large_image_url);
    }
  };

  const handleMangaSelect = (manga: JikanManga) => {
    setTitle(manga.title);
    setCreator(manga.authors.map(a => a.name).join(', '));
    if (manga.images.jpg.large_image_url) {
      setImageUrl(manga.images.jpg.large_image_url);
    }
  };

  const handleMovieSelect = (movie: OMDBSearchResult) => {
    setTitle(movie.Title);
    setCreator(movie.Year);
    if (movie.Poster && movie.Poster !== 'N/A') {
      setImageUrl(movie.Poster);
    }
  };

  const activeTab = tabs.find(t => t.id === selectedTabId);

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Loading Editor...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex flex-wrap justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0 w-full md:w-auto justify-end">
          <Link href="/admin">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Shelf</span>
            </Button>
          </Link>
          <Button onClick={handleSave}>Publish</Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-32 md:pt-24">
        <div className="w-full max-w-4xl mx-auto p-8 space-y-6">
          <div className="w-full md:w-1/3">
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
          
          <div className="space-y-4">
            <Input
              id="title"
              placeholder="Entry Title..."
              className="text-3xl md:text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
             {activeTab?.type === 'blog' && (
              <div className="space-y-2">
                <Label htmlFor="cover-image">Cover Image URL</Label>
                <Input
                  id="cover-image"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            )}
            <BlockEditor content={content} onChange={setContent} />
          </div>
        </div>
      </main>
    </div>
  );
}
