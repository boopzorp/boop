"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { searchManga } from '@/lib/jikan';
import type { JikanManga } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type MangaSearchProps = {
  onMangaSelect: (manga: JikanManga) => void;
};

export function MangaSearch({ onMangaSelect }: MangaSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<JikanManga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const mangaResults = await searchManga(query);
      setResults(mangaResults);
    } catch (error) {
      console.error('Jikan search failed:', error);
      toast({
        title: 'Jikan Search Error',
        description: 'Could not fetch results from MyAnimeList.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search for a manga by title..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {isLoading && <p className="p-2">Searching...</p>}
      {results.length > 0 && (
        <ScrollArea className="h-72 w-full rounded-md border absolute z-10 bg-background shadow-lg mt-1">
          <div className="p-4">
            {results.map((manga) => (
              <div
                key={manga.mal_id}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => {
                  onMangaSelect(manga);
                  setResults([]);
                  setSearchTerm('');
                }}
              >
                <Image
                  src={manga.images.jpg.image_url || 'https://picsum.photos/128/192'}
                  alt={manga.title}
                  width={40}
                  height={60}
                  className="rounded-sm object-cover"
                  data-ai-hint="manga cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{manga.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {manga.authors?.map(a => a.name).join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
