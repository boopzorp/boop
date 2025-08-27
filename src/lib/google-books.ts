'use server';

import type { GoogleBookVolume } from '@/types';

export const searchBooks = async (query: string): Promise<GoogleBookVolume[]> => {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Google Books API key. Please add it to your .env file.');
  }

  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`);
    
    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Google Books API error:', errorBody);
        throw new Error(`Google Books API error: ${errorBody.error.message || response.statusText}`);
    }

    const data = await response.json();
    return (data.items || []) as GoogleBookVolume[];
  } catch (error) {
    console.error('Failed to fetch from Google Books API:', error);
    // Re-throw the error so the component can catch it and display a toast
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while searching for books.');
  }
};
