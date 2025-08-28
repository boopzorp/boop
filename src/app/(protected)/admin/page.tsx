
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Entry, EntryType, CanvasImage } from '@/types';
import { InteractiveShelf } from '@/components/interactive-shelf';
import { EntryDetail } from '@/components/entry-detail';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil } from 'lucide-react';
import { TabSelector } from '@/components/tab-selector';
import { Logo } from '@/components/logo';
import { NewTabDialog } from '@/components/new-tab-dialog';
import type { Tab } from '@/types';
import { useEntryStore } from '@/store/entries';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@/components/canvas';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const { entries, tabs, addTab, colors, setTabColor, fetchAllData, isLoaded, updateTabCanvas } = useEntryStore();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  
  const [isNewTabDialogOpen, setIsNewTabDialogOpen] = useState(false);
  const [isCanvasEditMode, setCanvasEditMode] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      fetchAllData();
    }
  }, [isLoaded, fetchAllData]);

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !activeTabId) {
      setActiveTabId(tabs[0].id);
    } else if (isLoaded && tabs.length === 0) {
      setActiveTabId(null); 
    }
  }, [isLoaded, tabs, activeTabId]);


  const handleColorChange = (tabId: string, color: string) => {
    setTabColor(tabId, color);
  };

  const handleOpenDetail = (entry: Entry) => {
    setSelectedEntry(entry);
    setDetailViewOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailViewOpen(false);
    setTimeout(() => {
      setSelectedEntry(null);
    }, 300);
  };

  const handleAddTab = (newTab: {label: string, type: EntryType}) => {
    addTab(newTab).then(newTabId => {
        if(newTabId) setActiveTabId(newTabId); // Switch to the new tab
    });
    setIsNewTabDialogOpen(false);
  };
  
  const handleCanvasSave = (images: CanvasImage[]) => {
    if (activeTabId) {
      const cleanImages = images.map(({ id, url, x, y, width, height, rotation }) => ({
        id, url, x, y, width, height, rotation
      }));
      updateTabCanvas(activeTabId, cleanImages);
    }
    setCanvasEditMode(false);
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Loading The Logs...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
           {activeTab && (
            <Button variant="outline" onClick={() => setCanvasEditMode(!isCanvasEditMode)}>
              <Pencil className="mr-2 h-4 w-4" />
              {isCanvasEditMode ? 'Close Canvas Edit' : 'Edit Canvas'}
            </Button>
          )}
          <Link href="/editor">
            <Button>
              <PlusCircle />
              New Entry
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center pt-24 space-y-8 px-4">

        <div className="w-full max-w-7xl text-center bg-secondary/50 p-8 rounded-lg">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold font-anton tracking-wide text-foreground mb-2"
            >
                Welcome to The Logs
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
                This is a place to stash all the good stuff—the books that blew your mind, the movies you can't stop thinking about, and the tunes that get you through the day.
            </motion.p>
        </div>
        
        <div className="w-full max-w-7xl relative">
            <TabSelector 
                tabs={tabs} 
                activeTabId={activeTabId!} 
                onTabChange={(tabId) => {
                  setCanvasEditMode(false);
                  setActiveTabId(tabId);
                }}
                colors={colors}
                onColorChange={handleColorChange}
                onAddTab={() => setIsNewTabDialogOpen(true)}
            />
            <AnimatePresence mode="wait">
              <motion.div 
                  key={activeTabId || 'empty'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-b-lg rounded-tr-lg shadow-lg min-h-[400px] md:min-h-[500px] relative"
                  style={{ 
                      backgroundColor: activeTab ? `${colors[activeTabId!] || '#cccccc'}33` : '#f0f0f033',
                      transition: 'background-color 0.5s ease-in-out',
                  }} 
              >
                  {activeTab && (
                    <Canvas 
                      images={activeTab.canvasImages || []} 
                      isEditMode={isCanvasEditMode}
                      onSave={handleCanvasSave}
                      tabId={activeTabId}
                    />
                  )}
                  {activeTab ? (
                      <div className={cn("relative", {
                        'z-10': !isCanvasEditMode,
                        'z-0 pointer-events-none opacity-50': isCanvasEditMode,
                      })}>
                        <InteractiveShelf 
                            entries={entries.filter(e => e.tabId === activeTabId)} 
                            type={activeTab.type} 
                            onOpenDetail={handleOpenDetail} 
                        />
                      </div>
                  ) : (
                      <div className="h-[400px] flex items-center justify-center text-center text-muted-foreground">
                          <p>No tabs yet. Click the '+' button in the tab bar to create your first one!</p>
                      </div>
                  )}
              </motion.div>
            </AnimatePresence>
        </div>
      </main>
      <EntryDetail entry={selectedEntry} isOpen={isDetailViewOpen} onClose={handleCloseDetail} showDelete />
      <NewTabDialog 
        isOpen={isNewTabDialogOpen}
        onOpenChange={setIsNewTabDialogOpen}
        onAddTab={handleAddTab}
      />
    </div>
  );
}
