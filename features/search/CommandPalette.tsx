'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chaptersIndex } from '@/lib/bookData';
import { LEARNING_TRACKS, CONCEPT_NODES } from '@/lib/curriculum';
import { PRACTICE_EXERCISES } from '@/lib/practiceData';
import { GARDEN_PATHS } from '@/lib/pathsData';
import { BOOK_INDEX, texToPlain } from '@/lib/books';
import {
  Search,
  BookOpen,
  Compass,
  Beaker,
  Target,
  Sparkles,
  Calculator,
  FileText,
  Bookmark,
  X,
  ArrowRight
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Chapter' | 'Track' | 'Workbench' | 'Practice' | 'Reference';
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
        if (isOpen) onClose();
        else {
          // Trigger open via parent
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Construct search items
  const allItems: PaletteItem[] = [
    // Static navigation items
    {
      id: 'nav-modules',
      category: 'Track',
      title: 'Curriculum Modules & Chronological Progression',
      subtitle: 'Complete prerequisite flow from math to AI frontier across 6 phases',
      href: '/modules',
      badge: 'MODULES',
    },
    {
      id: 'nav-workbench',
      category: 'Workbench',
      title: 'Interactive Simulation Workbench',
      subtitle: 'Live parameter lab, polynomial fitting, loss surfaces, SVM, MDPs',
      href: '/workbench',
      badge: 'LAB',
    },
    {
      id: 'nav-practice',
      category: 'Practice',
      title: 'Deliberate Practice Drills',
      subtitle: 'Step-by-step mathematical proofs and calculation worksheets',
      href: '/practice',
      badge: 'DRILLS',
    },
    {
      id: 'nav-visuals',
      category: 'Workbench',
      title: 'Visual Interactive Animations',
      subtitle: 'Canvas simulations of backprop, SVM margins, and clustering',
      href: '/visuals',
    },
    {
      id: 'nav-notations',
      category: 'Reference',
      title: 'Mathematical Notations & Operators',
      subtitle: 'Matrix symbols, probability operators, and conventions',
      href: '/notations',
    },
    {
      id: 'nav-appendix',
      category: 'Reference',
      title: 'Appendix A: Probability & Statistics',
      subtitle: 'Continuous distributions, densities, and expectations',
      href: '/appendix',
    },
    // Garden Paths
    ...GARDEN_PATHS.map((p) => ({
      id: `path-${p.id}`,
      category: 'Track' as const,
      title: `Path: ${p.title}`,
      subtitle: p.description,
      href: p.href,
      badge: `${p.stats.modules} Mods`,
    })),
    // Chapters
    ...chaptersIndex.map((ch) => ({
      id: `ch-${ch.slug}`,
      category: 'Chapter' as const,
      title: `Ch.${ch.num}: ${ch.title}`,
      subtitle: ch.summary,
      href: `/chapter/${ch.slug}`,
      badge: ch.tag,
    })),
    // Book chapters (vector calculus, probability, ODE/PDE)
    ...Object.values(BOOK_INDEX).flatMap((bk) =>
      bk.chapters.map((ch) => ({
        id: `bk-${bk.id}-${ch.slug}`,
        category: 'Chapter' as const,
        title: `${bk.title} · ${/^[A-Z]$/.test(ch.label) ? 'App. ' : 'Ch.'}${ch.label}: ${texToPlain(ch.title)}`,
        subtitle: texToPlain(ch.summary),
        href: `/books/${bk.id}/${ch.slug}`,
        badge: ch.tag || bk.title,
      }))
    ),
    // Learning Tracks
    ...LEARNING_TRACKS.map((t) => ({
      id: `trk-${t.id}`,
      category: 'Track' as const,
      title: `${t.code}: ${t.name}`,
      subtitle: t.description,
      href: `/roadmap`,
      badge: `${t.chapterNums.length} Chs`,
    })),
    // Practice Drills
    ...PRACTICE_EXERCISES.map((p) => ({
      id: `drill-${p.id}`,
      category: 'Practice' as const,
      title: `Drill: ${p.title}`,
      subtitle: `Ch.${p.chapterNum} · ${p.category} (${p.difficulty})`,
      href: `/practice`,
      badge: p.difficulty,
    })),
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-zinc-950/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, chapter, algorithm, or concept (e.g. 'Bayes', 'SVM', 'TRK-01')..."
            className="w-full py-4 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-sans"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 ml-2 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs font-mono text-zinc-400">
              No matching commands or entities found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    {item.category === 'Chapter' && <BookOpen className="h-4 w-4" />}
                    {item.category === 'Track' && <Compass className="h-4 w-4" />}
                    {item.category === 'Workbench' && <Beaker className="h-4 w-4" />}
                    {item.category === 'Practice' && <Target className="h-4 w-4" />}
                    {item.category === 'Reference' && <Calculator className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span>Navigation Palette</span>
            <span>·</span>
            <span>Use ↑↓ to navigate, Enter to select</span>
          </div>
          <div>Garden of Eden ML</div>
        </div>
      </div>
    </div>
  );
}
