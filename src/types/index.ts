export type EntryType = "book" | "movie" | "music" | "blog";

export type Block = {
  id: string;
  type: 'paragraph' | 'image';
  content: string;
};

export type Entry = {
  id: string;
  tabId: string; // <-- New field to link to a tab
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
