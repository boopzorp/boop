'use server';

import type { GoogleBookVolume } from '@/types';

export const searchBooks = async (query: string): Promise<GoogleBookVolume[]> => {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Google Books API key');
  }

  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`);
    if (!response.ok) {
        console.error(`Google Books API error: ${response.status} ${response.statusText}`);
        const errorBody = await response.json();
        console.error('Error details:', errorBody);
        return [];
    }
    const data = await response.json();
    return (data.items || []) as GoogleBookVolume[];
  } catch (error) {
    console.error('Failed to fetch from Google Books API:', error);
    return [];
  }
};
