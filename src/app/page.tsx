
"use client";

import { useState, useEffect } from 'react';
import type { Entry, EntryType } from '@/types';
import { InteractiveShelf } from '@/components/interactive-shelf';
import { EntryDetail } from '@/components/entry-detail';
import { TabSelector } from '@/components/tab-selector';
import { Logo } from '@/components/logo';
import { NewTabDialog } from '@/components/new-tab-dialog';
import type { Tab } from '@/types';
import { useEntryStore } from '@/store/entries';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@/components/canvas';
import { cn } from '@/lib/utils';

export default function Home() {
  const { entries, tabs, addTab, colors, setTabColor, fetchAllData, isLoaded } = useEntryStore();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  
  const [isNewTabDialogOpen, setIsNewTabDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !activeTabId) {
      setActiveTabId(tabs[0].id);
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
        if (newTabId) setActiveTabId(newTabId); // Switch to the new tab
    });
    setIsNewTabDialogOpen(false);
  };

  const activeTab = tabs.find(t => t.id === activeTabId);
  const publishedEntries = entries.filter(e => e.status === 'published');

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Loading The Logs...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Logo />
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
                This is my corner on the internet and has everything that makes me 'me'. 😬
            </motion.p>
        </div>
        
        <div className="w-full max-w-7xl">
            {activeTabId && (
              <>
                <TabSelector 
                    tabs={tabs} 
                    activeTabId={activeTabId} 
                    onTabChange={setActiveTabId}
                    colors={colors}
                    onColorChange={handleColorChange}
                    onAddTab={() => setIsNewTabDialogOpen(true)}
                    showCustomize={false}
                />
                <AnimatePresence mode="wait">
                  {activeTab && (
                      <motion.div 
                          key={activeTabId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 rounded-b-lg rounded-tr-lg shadow-lg relative"
                          style={{ 
                              backgroundColor: `${colors[activeTabId] || '#cccccc'}33`, // 33 for ~20% opacity
                              transition: 'background-color 0.5s ease-in-out',
                          }} 
                      >
                         <div className="h-[400px] md:h-[500px] overflow-x-auto overflow-y-hidden w-full relative">
                            <Canvas 
                                images={activeTab.canvasImages || []} 
                                isEditMode={false}
                                onSave={() => {}} // No-op on public page
                                tabId={null}
                            />
                            <div className="relative z-10 h-full">
                                <InteractiveShelf 
                                    entries={publishedEntries.filter(e => e.tabId === activeTabId)} 
                                    type={activeTab.type} 
                                    onOpenDetail={handleOpenDetail} 
                                />
                            </div>
                         </div>
                         <div className="h-4 w-full bg-secondary rounded-sm shadow-lg mt-[-1px]" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                      </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
        </div>
      </main>
      <EntryDetail entry={selectedEntry} isOpen={isDetailViewOpen} onClose={handleCloseDetail} />
      <NewTabDialog 
        isOpen={isNewTabDialogOpen}
        onOpenChange={setIsNewTabDialogOpen}
        onAddTab={handleAddTab}
      />
    </div>
  );
}
