'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Compass,
  Beaker,
  Target,
  Sparkles,
  BookOpen,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Sprout
} from 'lucide-react';
import CommandPalette from '@/features/search/CommandPalette';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default to dark for ethereal aesthetic
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      !document.documentElement.classList.contains('light');
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
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
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0c0d10]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo with Sprout */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Sprout className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-medium tracking-tight text-zinc-100 group-hover:text-emerald-300 transition-colors">
                Garden of Eden
              </span>
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                // COMP_BIO_AI
              </span>
            </div>
          </Link>

          {/* Central Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wide text-zinc-400">
            <Link
              href="/"
              className="hover:text-zinc-100 transition-colors"
            >
              Groves
            </Link>
            <Link
              href="/roadmap"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span>Roadmap DAG</span>
            </Link>
            <Link
              href="/workbench"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Beaker className="h-3.5 w-3.5 text-emerald-400" />
              <span>Simulation Lab</span>
            </Link>
            <Link
              href="/practice"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Target className="h-3.5 w-3.5 text-amber-400" />
              <span>Practice Drills</span>
            </Link>
            <Link
              href="/chapter/01-introduction"
              className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
              <span>Alpaydın Text</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition font-mono"
              title="Search book (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-zinc-800 rounded border border-zinc-700">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-zinc-400" />}
            </button>

            {/* Pill CTA Button matching Haumind */}
            <Link
              href="/roadmap"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700/80 hover:border-zinc-600 text-zinc-100 text-xs font-mono font-medium transition-all"
            >
              <span>Enter Garden</span>
              <ArrowRight className="h-3 w-3 text-emerald-400" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2 text-xs font-mono">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Knowledge Groves
            </Link>
            <Link
              href="/roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Concept Roadmap DAG
            </Link>
            <Link
              href="/workbench"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Simulation Workbench
            </Link>
            <Link
              href="/practice"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Deliberate Practice Drills
            </Link>
            <Link
              href="/chapter/01-introduction"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Alpaydın 19-Chapter Text
            </Link>
          </div>
        )}
      </header>

      {/* Global Cmd+K Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
