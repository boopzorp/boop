'use server';

import type { GoogleBookVolume } from '@/types';

export const searchBooks = async (query: string): Promise<GoogleBookVolume[]> => {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Google Books API key');
  }

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`);
  
  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
};
