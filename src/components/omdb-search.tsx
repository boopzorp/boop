"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { searchMovies } from '@/lib/omdb';
import type { OMDBSearchResult } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type OMDBSearchProps = {
  onMovieSelect: (movie: OMDBSearchResult) => void;
};

export function OMDBSearch({ onMovieSelect }: OMDBSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<OMDBSearchResult[]>([]);
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
      const movies = await searchMovies(query);
      setResults(movies);
    } catch (error) {
      console.error('OMDB search failed:', error);
      toast({
        title: 'OMDB Search Error',
        description: 'Could not fetch results. Please check your API key.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search for a movie by title..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {isLoading && <p className="p-2">Searching...</p>}
      {results.length > 0 && (
        <ScrollArea className="h-72 w-full rounded-md border absolute z-10 bg-background shadow-lg mt-1">
          <div className="p-4">
            {results.map((movie) => (
              <div
                key={movie.imdbID}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => {
                  onMovieSelect(movie);
                  setResults([]);
                  setSearchTerm('');
                }}
              >
                <Image
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://picsum.photos/128/192'}
                  alt={movie.Title}
                  width={40}
                  height={60}
                  className="rounded-sm object-cover"
                  data-ai-hint="movie poster"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{movie.Title}</span>
                  <span className="text-sm text-muted-foreground">
                    {movie.Year}
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
