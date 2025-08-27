'use server';

import type { GoogleBookVolume } from '@/types';

// This is a temporary type, as we are adapting the component
// The important part is that it has a structure that can be mapped to GoogleBookVolume
interface AnnasArchiveBook {
    title: string;
    author: string;
    imgUrl: string;
}


export const searchBooks = async (query: string): Promise<GoogleBookVolume[]> => {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error('Missing RapidAPI key. Please add it to your .env file.');
  }

  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(`https://annas-archive.p.rapidapi.com/findBook?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'annas-archive.p.rapidapi.com'
        }
    });
    
    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch (e) {
            throw new Error(`RapidAPI error: ${response.statusText}`);
        }
        console.error('RapidAPI error:', errorBody);
        throw new Error(`RapidAPI error: ${errorBody.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.books || data.books.length === 0) {
        return [];
    }
    
    // Adapt the response to the GoogleBookVolume structure our component expects
    return data.books.map((book: AnnasArchiveBook, index: number) => ({
      id: `${book.title}-${index}`, // Create a pseudo-id
      volumeInfo: {
        title: book.title,
        authors: book.author ? book.author.split(', ') : ['Unknown Author'],
        imageLinks: {
          thumbnail: book.imgUrl,
          smallThumbnail: book.imgUrl,
        },
        // Add dummy data for other fields to match the type
        publisher: '',
        publishedDate: '',
        description: '',
      },
    }));

  } catch (error) {
    console.error('Failed to fetch from RapidAPI:', error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while searching for books.');
  }
};
