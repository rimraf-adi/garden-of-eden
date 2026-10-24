'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GARDEN_PATHS } from '@/lib/pathsData';
import FolderCard from '@/components/FolderCard';
import { getAllCurriculumModules } from '@/lib/curriculum';
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Search,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const allModules = getAllCurriculumModules();

  const filteredModules = allModules.filter((mod) => {
    if (selectedPhase !== 'all' && !mod.phaseId.includes(selectedPhase)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        mod.title.toLowerCase().includes(q) ||
        mod.tagline.toLowerCase().includes(q) ||
        mod.keyConcepts.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* =========================================================================
          FANOUT-INSPIRED HEADER: PICK YOUR PATH / Choose where to start
         ========================================================================= */}
      <section className="pt-16 sm:pt-20 pb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-3xl space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400">
            PICK YOUR PATH
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Choose where to start
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Sequenced book portfolios from foundational pure mathematics to frontier AI systems.
            Select any field binder to begin exploring its chapters.
          </p>
        </div>

        {/* Fanout-Inspired Tabbed Folder Books Grid (Strictly Chronological) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {GARDEN_PATHS.map((path) => (
            <FolderCard key={path.id} path={path} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          BOOK-LIKE COMPLETE TABLE OF CONTENTS (Chronological Modules 01 -> 25)
         ========================================================================= */}
      <section className="py-16 sm:py-24 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
              Complete Table of Contents
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mt-1">
              Curriculum Index
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Chronologically ordered from pure mathematics to agentic systems
            </p>
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search chapters or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pb-6 font-mono text-xs">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'math', label: '1. Mathematics' },
            { id: 'ml', label: '2. Statistical Learning' },
            { id: 'dl', label: '3. Deep Learning' },
            { id: 'systems', label: '4. Systems & GPU' },
            { id: 'infra', label: '5. Distributed Infra' },
            { id: 'agent', label: '6. Agentic Systems' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPhase(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedPhase === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Book-Style Table of Contents Rows */}
        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 border-t border-b border-zinc-200/80 dark:border-zinc-800/80">
          {filteredModules.map((mod) => (
            <Link
              key={mod.id}
              href={mod.href}
              className="group py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 px-4 -mx-4 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Chapter Number */}
                <span className="font-mono text-xl sm:text-2xl font-bold text-zinc-400 dark:text-zinc-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors w-9 shrink-0">
                  {mod.num.toString().padStart(2, '0')}
                </span>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-sans">
                    {mod.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-sans">
                    {mod.tagline}
                  </p>

                  <div className="pt-1.5 flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {mod.keyConcepts.map((concept, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                <span>~{mod.estimatedHours}h read</span>
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
