
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
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
  const { tabs, addEntry, updateEntry, fetchAllData, isLoaded } = useEntryStore();
  
  const [draftId, setDraftId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTabId, setSelectedTabId] = useState<string | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const saveDraft = useCallback(() => {
    if (title.trim() === '' && content.trim() === '') {
        return; // Don't save empty drafts
    }
    setIsSaving(true);

    const selectedTab = tabs.find(t => t.id === selectedTabId);
    if (!selectedTab) return; // Can't save without a tab

    let finalImageUrl = imageUrl;
    if (selectedTab.type === 'apps' && creator) {
        try {
            const url = new URL(creator.startsWith('http') ? creator : `https://${creator}`);
            finalImageUrl = `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`;
        } catch (error) { finalImageUrl = ''; }
    }

    const entryData: Omit<Entry, 'id' | 'addedAt'> = {
      title: title || 'Untitled Draft',
      creator,
      imageUrl: finalImageUrl || `https://picsum.photos/400/600`,
      tabId: selectedTabId!,
      type: selectedTab.type,
      notes: content,
      content: [],
      status: 'draft',
    };

    if (draftId) {
      // Update existing draft
      updateEntry(draftId, entryData).then(() => setIsSaving(false));
    } else {
      // Create new draft
      addEntry(entryData).then((newId) => {
        if (newId) {
          setDraftId(newId);
        }
        setIsSaving(false);
      });
    }
  }, [title, content, creator, imageUrl, selectedTabId, draftId, tabs, addEntry, updateEntry]);

  useEffect(() => {
    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
        saveDraft();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    };
  }, [title, creator, imageUrl, selectedTabId, content, saveDraft]);

  const handlePublish = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
    const selectedTab = tabs.find(t => t.id === selectedTabId);
    if (!selectedTab) {
      toast({ title: 'No Tab Selected', description: 'Please select a tab for this entry.', variant: 'destructive' });
      return;
    }

    const entryData = {
      title,
      creator,
      imageUrl: imageUrl || `https://picsum.photos/400/600`,
      tabId: selectedTabId!,
      type: selectedTab.type,
      notes: content,
      status: 'published' as const,
    };
    
    if(draftId) {
        updateEntry(draftId, entryData);
    } else {
        addEntry(entryData as Omit<Entry, 'id' | 'addedAt'>);
    }

    toast({ title: 'Entry Published!', description: 'Your journal entry has been published.' });
    router.push('/admin');
  };

  const handleTrackSelect = (track: SpotifyTrack) => {
    setTitle(track.name);
    setCreator(track.artists.map(a => a.name).join(', '));
    if (track.album.images.length > 0) setImageUrl(track.album.images[0].url);
  };

  const handleBookSelect = (book: GoogleBookVolume) => {
    setTitle(book.volumeInfo.title);
    setCreator(book.volumeInfo.authors?.join(', ') || 'Unknown Author');
    if (book.volumeInfo.imageLinks?.thumbnail) setImageUrl(book.volumeInfo.imageLinks.thumbnail);
  };

  const handleAnimeSelect = (anime: JikanAnime) => {
    setTitle(anime.title);
    setCreator(anime.studios.map(s => s.name).join(', '));
    if (anime.images.jpg.large_image_url) setImageUrl(anime.images.jpg.large_image_url);
  };

  const handleMangaSelect = (manga: JikanManga) => {
    setTitle(manga.title);
    setCreator(manga.authors.map(a => a.name).join(', '));
    if (manga.images.jpg.large_image_url) setImageUrl(manga.images.jpg.large_image_url);
  };

  const handleMovieSelect = (movie: OMDBSearchResult) => {
    setTitle(movie.Title);
    setCreator(movie.Year);
    if (movie.Poster && movie.Poster !== 'N/A') setImageUrl(movie.Poster);
  };

  const handleAppUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlValue = e.target.value;
    setCreator(urlValue);
    if (urlValue) {
        try {
            const url = new URL(urlValue.startsWith('http') ? urlValue : `https://${urlValue}`);
            setImageUrl(`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`);
        } catch (error) { setImageUrl(''); }
    } else { setImageUrl(''); }
  };

  const activeTab = tabs.find(t => t.id === selectedTabId);

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Loading Editor...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex flex-wrap justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center gap-2"> <Logo /> </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0 w-full md:w-auto justify-end">
          <div className="text-sm text-muted-foreground mr-4">
            {isSaving ? 'Saving...' : 'Draft saved'}
          </div>
          <Link href="/admin">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Shelf</span>
            </Button>
          </Link>
          <Button onClick={handlePublish}>
            <Check className="mr-2 h-4 w-4" />
            Publish
          </Button>
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
          
          {(activeTab?.type === 'movie' || activeTab?.type === 'tv') && (<OMDBSearch onMovieSelect={handleMovieSelect} />)}
          {activeTab?.type === 'music' && (<SpotifySearch onTrackSelect={handleTrackSelect} />)}
          {activeTab?.type === 'book' && (<BookSearch onBookSelect={handleBookSelect} />)}
          {activeTab?.type === 'anime' && (<JikanSearch onAnimeSelect={handleAnimeSelect} />)}
          {activeTab?.type === 'manga' && (<MangaSearch onMangaSelect={handleMangaSelect} />)}
          
          <div className="space-y-4">
            <Input
              id="title"
              placeholder="Entry Title..."
              className="text-3xl md:text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
             {activeTab?.type === 'blog' && (
              <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="creator">Author / Creator</Label>
                    <Input id="creator" placeholder="e.g. Jane Doe" value={creator} onChange={(e) => setCreator(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cover-image">Cover Image URL</Label>
                    <Input id="cover-image" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    {imageUrl && (
                    <div className="mt-4 relative aspect-video w-full max-w-md rounded-md overflow-hidden">
                        <Image src={imageUrl} alt="Cover image preview" fill className="object-cover" />
                    </div>
                    )}
                </div>
              </div>
            )}
            {activeTab?.type === 'apps' && (
              <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="app-url">App URL</Label>
                    <Input id="app-url" placeholder="https://example.com" value={creator} onChange={handleAppUrlChange} />
                </div>
                {imageUrl && (
                <div className="mt-4">
                    <Label>Icon Preview</Label>
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border p-2 bg-secondary">
                        <Image src={imageUrl} alt="Icon preview" fill className="object-contain" />
                    </div>
                </div>
                )}
              </div>
            )}
            <BlockEditor content={content} onChange={setContent} />
          </div>
        </div>
      </main>
    </div>
  );
}
