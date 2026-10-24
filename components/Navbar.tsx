'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Menu,
  X,
  FileText,
  Bookmark,
  Calculator,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Beaker,
  Target
} from 'lucide-react';
import CommandPalette from '@/features/search/CommandPalette';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference or class
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches &&
        !document.documentElement.classList.contains('light'));
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

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
    // Dispatch a custom event so active canvases can instantly re-render
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Introduction to Machine Learning
              </span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
                Ethem Alpaydın · 2nd Edition · MIT Press
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              href="/roadmap"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Compass className="h-4 w-4 text-indigo-500" />
              <span>Roadmap</span>
            </Link>
            <Link
              href="/workbench"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Beaker className="h-4 w-4 text-emerald-500" />
              <span>Workbench</span>
            </Link>
            <Link
              href="/practice"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Target className="h-4 w-4 text-amber-500" />
              <span>Practice</span>
            </Link>
            <Link
              href="/visuals"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span>Visuals</span>
            </Link>
            <Link
              href="/notations"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Calculator className="h-4 w-4" />
              <span>Notations</span>
            </Link>
            <Link
              href="/appendix"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              <span>Appendix A</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200 transition font-mono"
              title="Search book (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2 text-sm font-medium">
            <Link
              href="/roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Compass className="h-4 w-4 text-indigo-500" />
              <span>Concept Roadmap</span>
            </Link>
            <Link
              href="/workbench"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Beaker className="h-4 w-4 text-emerald-500" />
              <span>Interactive Workbench</span>
            </Link>
            <Link
              href="/practice"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Target className="h-4 w-4 text-amber-500" />
              <span>Practice Drills</span>
            </Link>
            <Link
              href="/visuals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span>Visual Animations</span>
            </Link>
            <Link
              href="/notations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Mathematical Notations
            </Link>
            <Link
              href="/appendix"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Appendix A: Probability
            </Link>
          </div>
        )}
      </header>

      {/* Global Cmd+K Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
