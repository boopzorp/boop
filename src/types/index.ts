export type EntryType = "book" | "movie" | "music";

export type Entry = {
  id: string;
  type: EntryType;
  title: string;
  creator: string; // Author, Director, Artist
  notes: string;
  addedAt: Date;
  imageUrl: string;
};

export type Tab = {
  id: string;
  label: string;
  type: EntryType;
};
