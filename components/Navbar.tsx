'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ArrowRight, Sun, Moon } from 'lucide-react';
import CommandPalette from '@/features/search/CommandPalette';

export default function Navbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !document.documentElement.classList.contains('light'));
    setIsDark(isDarkMode);

    const openListener = () => setPaletteOpen(true);
    window.addEventListener('open-command-palette', openListener);
    return () => window.removeEventListener('open-command-palette', openListener);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafafc]/90 dark:bg-[#0a0d14]/90 backdrop-blur-xl text-zinc-900 dark:text-white transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400 group-hover:rotate-45 transition-transform duration-300">
              *
            </span>
            <span className="text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              GardenOfEden
            </span>
          </Link>

          {/* Right: Search and Explore ONLY */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-200 transition font-mono shadow-2xs"
              title="Search (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-zinc-600" />}
            </button>

            {/* Explore Button */}
            <Link
              href="/modules"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Global Cmd+K Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
