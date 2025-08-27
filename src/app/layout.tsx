import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Anton, Caveat, Literata } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata' });
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
  title: 'The Logs',
  description: 'A personal log for everything me.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable, anton.variable, caveat.variable, literata.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
