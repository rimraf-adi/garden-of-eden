'use client';

import { GARDEN_PATHS } from '@/lib/pathsData';
import FolderCard from '@/components/FolderCard';

export default function ModulesPage() {
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

    </div>
  );
}
