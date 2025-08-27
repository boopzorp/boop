'use server';

import type { GoogleBookVolume } from '@/types';
import { searchBooksByTitle } from '@/ai/flows/book-search-flow';

export const searchBooks = async (query: string): Promise<GoogleBookVolume[]> => {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await searchBooksByTitle({ title: query });
    
    // Adapt the AI response to the GoogleBookVolume type
    const books: GoogleBookVolume[] = response.results.map(book => ({
      id: book.id,
      volumeInfo: {
        title: book.title,
        authors: book.authors,
        imageLinks: {
          thumbnail: book.imageUrl,
          smallThumbnail: book.imageUrl,
        },
        // Add empty fallbacks for other fields if needed
        publisher: '',
        publishedDate: '',
        description: '',
      },
    }));
    
    return books;
  } catch (error) {
    console.error('Gemini book search failed:', error);
    // Return empty array or throw a custom error
    return [];
  }
};
