export type EntryType = "book" | "movie" | "music" | "blog" | "anime" | "manga" | "tv";

export type Block = {
  id: string;
  type: 'paragraph' | 'image';
  content: string;
};

export type Entry = {
  id: string;
  tabId: string;
  type: EntryType;
  title: string;
  creator: string; // Author, Director, Artist
  notes: string;
  content?: Block[];
  addedAt: Date;
  imageUrl: string;
};

export type Tab = {
  id: string;
  label: string;
  type: EntryType;
};

// Spotify API Types
export interface SpotifyArtist {
  name: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyAlbum {
  images: SpotifyImage[];
  name: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

// Google Books API Types
export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface VolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  imageLinks?: ImageLinks;
}

export interface GoogleBookVolume {
  id: string;
  volumeInfo: VolumeInfo;
}

// Jikan API Types
export interface JikanImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanStudio {
  mal_id: number;
  name: string;
}

export interface JikanAuthor {
  mal_id: number;
  name: string;
}

export interface JikanAnime {
  mal_id: number;
  title: string;
  images: {
    jpg: JikanImage;
    webp: JikanImage;
  };
  studios: JikanStudio[];
}

export interface JikanManga {
    mal_id: number;
    title: string;
    images: {
      jpg: JikanImage;
      webp: JikanImage;
    };
    authors: JikanAuthor[];
}

// OMDB API Types
export interface OMDBSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
