import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Entry, Tab, EntryType } from '@/types';
import { mockEntries } from '@/data/mock-data';

// Define the state structure
interface EntryState {
  entries: Entry[];
  tabs: Tab[];
  colors: Record<string, string>;
  addEntry: (entry: Omit<Entry, 'id' | 'addedAt'>) => void;
  addTab: (tab: { label: string; type: EntryType }) => string;
  setTabColor: (tabId: string, color: string) => void;
}

const initialTabs: Tab[] = [
  { id: 'book', label: 'Books', type: 'book' },
  { id: 'movie', label: 'Movies', type: 'movie' },
  { id: 'music', label: 'Music', type: 'music' },
];

const initialColors: Record<string, string> = {
    book: '#F7B2AD',
    movie: '#9AB7D3',
    music: '#A2D5C6',
};


export const useEntryStore = create<EntryState>()(
  persist(
    (set, get) => ({
      entries: mockEntries,
      tabs: initialTabs,
      colors: initialColors,
      addEntry: (entry) => {
        const newEntry: Entry = {
          ...entry,
          id: `entry-${Date.now()}-${Math.random()}`,
          addedAt: new Date(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },
      addTab: (tab) => {
        const newTabId = `${tab.label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        const newTab: Tab = {
            id: newTabId,
            ...tab,
        };
        set((state) => ({
          tabs: [...state.tabs, newTab],
          colors: {
            ...state.colors,
            [newTabId]: '#C0C0C0', // Default color for new tabs
          },
        }));
        return newTabId;
      },
      setTabColor: (tabId, color) => {
        set((state) => ({
          colors: {
            ...state.colors,
            [tabId]: color,
          },
        }));
      },
    }),
    {
      name: 'entry-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
