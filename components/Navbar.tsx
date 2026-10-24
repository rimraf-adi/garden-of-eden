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
      <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-white/10 bg-white/60 dark:bg-[#0a0d14]/70 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand with Zen Cairn Stones Icon */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex flex-col items-center justify-center w-7 h-7">
              {/* Stylized stacked zen stones icon matching screenshot */}
              <div className="w-2.5 h-1.5 rounded-full bg-amber-500/80 mb-0.5" />
              <div className="w-4 h-2 rounded-full bg-amber-600/80 mb-0.5" />
              <div className="w-5.5 h-2.5 rounded-full bg-amber-700/80" />
            </div>
            <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
              Garden of Eden
            </span>
          </Link>

          {/* Center: Sanctuary Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/modules" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link href="/paths/linear-algebra" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Foundations
            </Link>
            <Link href="/paths/inference-engineering" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Inference
            </Link>
            <Link href="/workbench" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Laboratories
            </Link>
          </nav>

          {/* Right: Search, Theme Toggle, and Pill CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-200 transition font-mono backdrop-blur-xs shadow-2xs"
              title="Search (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition"
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-zinc-600" />}
            </button>

            {/* Frosted Glass "Begin Journey" Pill Button */}
            <Link
              href="/modules"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900/90 dark:bg-white/90 hover:bg-zinc-950 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-medium transition-all shadow-md shadow-zinc-950/10 dark:shadow-white/10 backdrop-blur-xs"
            >
              <span>Begin Journey</span>
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
