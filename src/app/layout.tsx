import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Anton, Caveat } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
});
const caveat = Caveat({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: 'My Brain Dump',
  description: 'A place to dump your thoughts on music, movies, and books.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-sans antialiased", inter.variable, anton.variable, caveat.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
