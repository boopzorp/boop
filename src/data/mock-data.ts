import type { Entry } from '@/types';

export const mockEntries: Entry[] = [
  // Books
  {
    id: 'book-1',
    type: 'book',
    title: 'Dune',
    creator: 'Frank Herbert',
    notes: 'A masterpiece of science fiction. The world-building is incredible.',
    addedAt: new Date('2023-10-15'),
    imageUrl: 'https://picsum.photos/seed/dune/400/600',
  },
  {
    id: 'book-2',
    type: 'book',
    title: 'Project Hail Mary',
    creator: 'Andy Weir',
    notes: 'A fun and engaging read with a lot of heart. Rocky is the best!',
    addedAt: new Date(),
    imageUrl: 'https://picsum.photos/seed/hail-mary/400/600',
  },
  {
    id: 'book-3',
    type: 'book',
    title: 'The Hobbit',
    creator: 'J.R.R. Tolkien',
    notes: 'A timeless adventure. Perfect for all ages.',
    addedAt: new Date('2024-01-20'),
    imageUrl: 'https://picsum.photos/seed/hobbit/400/600',
  },
  // Movies
  {
    id: 'movie-1',
    type: 'movie',
    title: 'Blade Runner 2049',
    creator: 'Denis Villeneuve',
    notes: 'Visually stunning with a thought-provoking story. A worthy successor.',
    addedAt: new Date(),
    imageUrl: 'https://picsum.photos/seed/blade-runner/600/400',
  },
  {
    id: 'movie-2',
    type: 'movie',
    title: 'Interstellar',
    creator: 'Christopher Nolan',
    notes: 'An epic journey through space and time. The score is amazing.',
    addedAt: new Date('2023-11-05'),
    imageUrl: 'https://picsum.photos/seed/interstellar/600/400',
  },
  // Music
  {
    id: 'music-1',
    type: 'music',
    title: 'Discovery',
    creator: 'Daft Punk',
    notes: 'One of the greatest electronic albums of all time. Pure joy.',
    addedAt: new Date(),
    imageUrl: 'https://picsum.photos/seed/discovery/400/400',
  },
  {
    id: 'music-2',
    type: 'music',
    title: 'Random Access Memories',
    creator: 'Daft Punk',
    notes: 'A modern classic. The production is flawless.',
    addedAt: new Date('2023-09-01'),
    imageUrl: 'https://picsum.photos/seed/ram/400/400',
  },
];
