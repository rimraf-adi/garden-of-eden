import type { Metadata } from 'next';
import { Geist, Geist_Mono, Newsreader } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Garden of Eden — Primordial Knowledge of Computation & Learning',
  description:
    'A living computational knowledge arboretum. Featuring complete online editions of foundational mathematics, statistical learning theory, deep representations, and distributed systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#fafafc] text-zinc-900 dark:bg-[#08090d] dark:text-zinc-100 selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200 transition-colors"
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
