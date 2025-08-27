"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // Here you would typically save the content to a database.
    // For now, we'll just log it to the console.
    console.log({ title, content });
    alert('Entry saved! (Check the console)');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F0F0F0]">
      <header className="fixed top-0 left-0 z-20 p-4 w-full flex justify-between items-center bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight font-headline">Shelf Life</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shelf
            </Button>
          </Link>
          <Button onClick={handleSave}>Publish</Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center pt-24">
        <div className="w-full max-w-4xl mx-auto p-8 space-y-6">
          <Input
            placeholder="Entry Title..."
            className="text-5xl font-bold border-none focus-visible:ring-0 shadow-none p-0 h-auto bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Tell your story..."
            className="text-lg border-none focus-visible:ring-0 shadow-none p-0 min-h-[50vh] bg-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </main>
    </div>
  );
}
