export type EntryType = "book" | "movie" | "music" | "blog";

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
