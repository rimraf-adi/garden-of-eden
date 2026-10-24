'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Menu, X, FileText, Bookmark, Calculator, Sparkles, Sun, Moon } from 'lucide-react';
import { chaptersIndex } from '@/lib/bookData';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference or class
    const isDarkMode = document.documentElement.classList.contains('dark') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !document.documentElement.classList.contains('light'));
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
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

  const filteredChapters = searchQuery.trim()
    ? chaptersIndex.filter(
        (ch) =>
          ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.sections.some((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

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
              <span className="block text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Ethem Alpaydın · 2nd Edition · MIT Press
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Chapters
            </Link>
            <Link href="/visuals" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Visual Animations
            </Link>
            <Link href="/notations" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Calculator className="h-4 w-4" />
              Notations
            </Link>
            <Link href="/appendix" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Appendix A
            </Link>
            <Link href="/frontmatter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <Bookmark className="h-4 w-4" />
              Preface
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
              title="Search book (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search book...</span>
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
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Chapters Overview
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
            <Link
              href="/frontmatter"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Preface & Notes
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
            <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
              <Search className="h-5 w-5 text-zinc-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 19 chapters, sections, and topics..."
                className="w-full py-4 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-2">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-sm text-zinc-400">
                  Type a topic (e.g. &ldquo;Bayes&rdquo;, &ldquo;SVM&rdquo;, &ldquo;Q learning&rdquo;, &ldquo;PAC&rdquo;, &ldquo;Decision Trees&rdquo;)
                </div>
              ) : filteredChapters.length === 0 ? (
                <div className="text-center py-8 text-sm text-zinc-400">
                  No chapters found matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredChapters.map((ch) => (
                  <Link
                    key={ch.slug}
                    href={`/chapter/${ch.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="block p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Chapter {ch.num} · {ch.tag}
                      </span>
                      <span className="text-xs text-zinc-400">{ch.pages}</span>
                    </div>
                    <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {ch.title}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{ch.summary}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
