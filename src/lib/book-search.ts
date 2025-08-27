'use server';

import type { GoogleBookVolume } from '@/types';

interface ItunesBook {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
}

export const searchBooks = async (query: string): Promise<GoogleBookVolume[]> => {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=ebook&limit=10`);
    
    if (!response.ok) {
        throw new Error(`iTunes API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        return [];
    }
    
    // Adapt the iTunes response to the GoogleBookVolume structure our component expects
    return data.results.map((book: ItunesBook) => ({
      id: book.trackId.toString(),
      volumeInfo: {
        title: book.trackName,
        authors: [book.artistName],
        // Get a higher resolution image by replacing '100x100' with '600x600'
        imageLinks: {
          thumbnail: book.artworkUrl100.replace('100x100', '600x600'),
          smallThumbnail: book.artworkUrl100,
        },
        publisher: '',
        publishedDate: '',
        description: '',
      },
    }));

  } catch (error) {
    console.error('Failed to fetch from iTunes API:', error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while searching for books.');
  }
};
