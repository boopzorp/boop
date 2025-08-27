"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { searchTracks } from '@/lib/spotify';
import type { SpotifyTrack } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type SpotifySearchProps = {
  onTrackSelect: (track: SpotifyTrack) => void;
};

export function SpotifySearch({ onTrackSelect }: SpotifySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
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
      const tracks = await searchTracks(query);
      setResults(tracks);
    } catch (error) {
      console.error('Spotify search failed:', error);
      toast({
        title: 'Spotify Search Error',
        description: 'Could not fetch results. Please check your API credentials.',
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
        placeholder="Search for a song..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {isLoading && <p className="p-2">Searching...</p>}
      {results.length > 0 && (
        <ScrollArea className="h-72 w-full rounded-md border absolute z-10 bg-background shadow-lg mt-1">
          <div className="p-4">
            {results.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => {
                  onTrackSelect(track);
                  setResults([]);
                  setSearchTerm('');
                }}
              >
                <Image
                  src={track.album.images[2]?.url || '/placeholder.png'}
                  alt={track.album.name}
                  width={40}
                  height={40}
                  className="rounded-sm"
                  data-ai-hint="album cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{track.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {track.artists.map((artist) => artist.name).join(', ')}
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
