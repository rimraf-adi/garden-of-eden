'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Layers,
  Calculator
} from 'lucide-react';
import CommandPalette from '@/features/search/CommandPalette';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
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
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#0a0d14]/95 backdrop-blur-xl text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo with Asterisk */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black text-cyan-400 group-hover:rotate-45 transition-transform duration-300">
              *
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              GardenOfEden
            </span>
          </Link>

          {/* Central Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/modules" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Modules</span>
            </Link>
            <Link href="/chapter/01-introduction" className="hover:text-white transition-colors flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Library</span>
            </Link>
            <Link href="/notations" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-zinc-400" />
              <span>Notations</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition font-mono"
              title="Search curricula (Cmd+K)"
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

            {/* Pill CTA Button */}
            <Link
              href="/modules"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition-all shadow-sm shadow-cyan-500/10"
            >
              <span>Explore</span>
              <ArrowRight className="h-3 w-3" />
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
          <div className="md:hidden border-b border-zinc-800 bg-[#0a0d14] px-4 py-3 space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Home
            </Link>
            <Link
              href="/modules"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Modules (Chronological)
            </Link>
            <Link
              href="/chapter/01-introduction"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Library Modules
            </Link>
            <Link
              href="/notations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              Mathematical Notations
            </Link>
          </div>
        )}
      </header>

      {/* Global Cmd+K Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
