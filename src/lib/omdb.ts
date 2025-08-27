'use server';

import type { OMDBSearchResult } from '@/types';

export const searchMovies = async (query: string): Promise<OMDBSearchResult[]> => {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OMDB API key');
  }

  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
    if (!response.ok) {
      console.error(`OMDB API error: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    if (data.Response === 'True') {
      return data.Search as OMDBSearchResult[];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from OMDB API:', error);
    return [];
  }
};
