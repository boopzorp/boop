
import { create } from 'zustand';
import type { Entry, Tab, EntryType, Block } from '@/types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface EntryState {
  entries: Entry[];
  tabs: Tab[];
  colors: Record<string, string>;
  isLoaded: boolean;
  fetchAllData: () => Promise<void>;
  fetchEntryById: (id: string) => Promise<Entry | null>;
  addEntry: (entry: Omit<Entry, 'id' | 'addedAt'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<Omit<Entry, 'id' | 'addedAt'>>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  addTab: (tab: { label: string; type: EntryType }) => Promise<string | undefined>;
  deleteTab: (tabId: string) => Promise<void>;
  setTabColor: (tabId: string, color: string) => Promise<void>;
}

const fetchTabs = async (): Promise<{ tabs: Tab[], colors: Record<string, string> }> => {
  const tabsCollection = collection(db, 'tabs');
  const tabSnapshot = await getDocs(tabsCollection);
  const tabs: Tab[] = [];
  const colors: Record<string, string> = {};
  tabSnapshot.forEach((doc) => {
    const data = doc.data();
    tabs.push({ id: doc.id, label: data.label, type: data.type });
    colors[doc.id] = data.color || '#C0C0C0';
  });
  return { tabs, colors };
};

const fetchEntries = async (): Promise<Entry[]> => {
  const entriesCollection = collection(db, 'entries');
  const entrySnapshot = await getDocs(entriesCollection);
  return entrySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      addedAt: (data.addedAt as Timestamp).toDate(),
    } as Entry;
  });
};

export const useEntryStore = create<EntryState>((set, get) => ({
  entries: [],
  tabs: [],
  colors: {},
  isLoaded: false,
  
  fetchAllData: async () => {
    if (get().isLoaded) return;
    try {
      const [{ tabs, colors }, entries] = await Promise.all([fetchTabs(), fetchEntries()]);
      set({ tabs, colors, entries, isLoaded: true });
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      set({ isLoaded: true }); // Mark as loaded even if there's an error
    }
  },

  fetchEntryById: async (id: string): Promise<Entry | null> => {
    try {
      const docRef = doc(db, 'entries', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          addedAt: (data.addedAt as Timestamp).toDate(),
        } as Entry;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      return null;
    }
  },

  addEntry: async (entry) => {
    try {
      const newEntryData = {
        ...entry,
        addedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'entries'), newEntryData);
      const newEntry: Entry = {
        ...newEntryData,
        id: docRef.id,
        addedAt: newEntryData.addedAt.toDate(),
      };
      set((state) => ({ entries: [newEntry, ...state.entries] }));
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  },

  updateEntry: async (id, entryUpdate) => {
    try {
      const entryRef = doc(db, 'entries', id);
      await updateDoc(entryRef, entryUpdate);
      set(state => ({
        entries: state.entries.map(e => 
          e.id === id ? { ...e, ...entryUpdate } : e
        ),
      }));
    } catch (error) {
      console.error("Error updating entry: ", error);
    }
  },

  deleteEntry: async (entryId) => {
    try {
      await deleteDoc(doc(db, 'entries', entryId));
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== entryId),
      }));
    } catch (error) {
      console.error("Error deleting entry: ", error);
    }
  },

  addTab: async (tab) => {
    try {
        const newTabData = { ...tab, color: '#C0C0C0' };
        const docRef = await addDoc(collection(db, 'tabs'), newTabData);
        const newTab: Tab = { id: docRef.id, ...tab };
        set((state) => ({
          tabs: [...state.tabs, newTab],
          colors: { ...state.colors, [newTab.id]: newTabData.color },
        }));
        return newTab.id;
    } catch (error) {
        console.error("Error adding tab: ", error);
    }
  },

  deleteTab: async (tabId) => {
    try {
      // Note: This is a simple delete. For a real app, you'd want a transaction
      // to delete all entries associated with this tab as well.
      await deleteDoc(doc(db, 'tabs', tabId));
      set((state) => ({
        tabs: state.tabs.filter((tab) => tab.id !== tabId),
        entries: state.entries.filter((entry) => entry.tabId !== tabId),
      }));
    } catch (error) {
        console.error("Error deleting tab: ", error);
    }
  },

  setTabColor: async (tabId, color) => {
    try {
        const tabRef = doc(db, 'tabs', tabId);
        await updateDoc(tabRef, { color });
        set((state) => ({
          colors: { ...state.colors, [tabId]: color },
        }));
    } catch (error) {
        console.error("Error updating tab color: ", error);
    }
  },
}));
