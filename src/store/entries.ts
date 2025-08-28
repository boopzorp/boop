
import { create } from 'zustand';
import type { Entry, Tab, EntryType, CanvasImage } from '@/types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  getDoc,
  Timestamp,
  writeBatch
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
  updateTabCanvas: (tabId: string, images: CanvasImage[]) => Promise<void>;
}

const fetchTabs = async (): Promise<{ tabs: Tab[], colors: Record<string, string> }> => {
  const tabsCollectionRef = collection(db, 'tabs');
  const tabSnapshot = await getDocs(tabsCollectionRef);
  const tabs: Tab[] = [];
  const colors: Record<string, string> = {};

  for (const tabDoc of tabSnapshot.docs) {
    const tabData = tabDoc.data();
    
    // Fetch canvas images from the subcollection
    const canvasImagesCollectionRef = collection(db, 'tabs', tabDoc.id, 'canvasImages');
    const canvasImagesSnapshot = await getDocs(canvasImagesCollectionRef);
    const canvasImages: CanvasImage[] = canvasImagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as CanvasImage));

    tabs.push({ 
        id: tabDoc.id, 
        label: tabData.label, 
        type: tabData.type,
        canvasImages: canvasImages,
    });
    colors[tabDoc.id] = tabData.color || '#C0C0C0';
  }
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
        const newTab: Tab = { id: docRef.id, ...tab, canvasImages: [] };
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

  updateTabCanvas: async (tabId, images) => {
    try {
      const batch = writeBatch(db);
      const canvasImagesCollectionRef = collection(db, 'tabs', tabId, 'canvasImages');

      // 1. Delete all existing images in the subcollection
      const existingImagesSnapshot = await getDocs(canvasImagesCollectionRef);
      existingImagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 2. Add all the new images, ensuring each has a valid ID
      const updatedImagesWithIds = images.map(image => {
        const { id, ...imageData } = image;
        // If the image doesn't have an ID, it's a new one. Generate a ref with a new ID.
        // If it has an ID, it's an existing one. Use that ID.
        const imageRef = id ? doc(canvasImagesCollectionRef, id) : doc(canvasImagesCollectionRef); // Let Firestore generate ID
        batch.set(imageRef, imageData);
        // Return the image data with the new/existing ID for the local state update
        return { ...imageData, id: imageRef.id };
      });

      // 3. Commit the batch
      await batch.commit();

      // Update local state to reflect the changes
      set((state) => ({
        tabs: state.tabs.map(tab => 
          tab.id === tabId ? { ...tab, canvasImages: updatedImagesWithIds } : tab
        ),
      }));

    } catch (error) {
      console.error("Error updating tab canvas: ", error);
    }
  },
}));
