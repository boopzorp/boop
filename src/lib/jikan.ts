'use server';

import type { JikanAnime, JikanManga } from '@/types';

export const searchAnime = async (query: string): Promise<JikanAnime[]> => {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) {
      console.error(`Jikan API error: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data.data as JikanAnime[];
  } catch (error) {
    console.error('Failed to fetch from Jikan API:', error);
    return [];
  }
};

export const searchManga = async (query: string): Promise<JikanManga[]> => {
    if (query.length < 3) {
      return [];
    }
  
    try {
      const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`);
      if (!response.ok) {
        console.error(`Jikan API error: ${response.status} ${response.statusText}`);
        return [];
      }
      const data = await response.json();
      return data.data as JikanManga[];
    } catch (error) {
      console.error('Failed to fetch from Jikan API:', error);
      return [];
    }
  };
