'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getAllCurriculumModules,
  CurriculumModule,
} from '@/lib/curriculum';
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Search,
  LayoutList,
  LayoutGrid,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'math', label: 'Mathematics' },
  { id: 'ml', label: 'Statistical Learning' },
  { id: 'dl', label: 'Deep Learning' },
  { id: 'systems', label: 'Systems & Inference' },
  { id: 'infra', label: 'Distributed Infrastructure' },
  { id: 'agents', label: 'Agents & RL' },
];

export default function ModulesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const allModules = getAllCurriculumModules();

  const filteredModules = allModules.filter((mod) => {
    // Category match
    if (selectedCategory === 'math' && !mod.phaseId.includes('math')) return false;
    if (selectedCategory === 'ml' && !mod.phaseId.includes('ml')) return false;
    if (selectedCategory === 'dl' && !mod.phaseId.includes('dl')) return false;
    if (selectedCategory === 'systems' && !mod.phaseId.includes('systems')) return false;
    if (selectedCategory === 'infra' && !mod.phaseId.includes('infra')) return false;
    if (selectedCategory === 'agents' && !mod.phaseId.includes('agent')) return false;

    // Search query match
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
    <div className="min-h-screen bg-[#0a0d14] text-white">
      {/* Book-like Editorial Header */}
      <div className="border-b border-zinc-800 bg-[#0d1018] py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/60 text-xs font-mono text-cyan-400">
              <span>* TABLE_OF_CONTENTS</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-300">CURRICULUM ARCHIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Curriculum Modules
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-sans">
              Complete chronological table of contents. From first-principles pure mathematics
              and statistical learning to modern deep architectures, GPU inference engineering,
              and distributed scale. Choose where to start.
            </p>
          </div>

          {/* Category Picker Tabs & Search Toolbar */}
          <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle and Search */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg border border-zinc-800 bg-zinc-900 text-xs">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                  title="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Book-Like Table of Contents */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {filteredModules.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-2xl">
            No modules match your filter criteria.
          </div>
        ) : viewMode === 'list' ? (
          /* Book Table of Contents List Layout */
          <div className="divide-y divide-zinc-800/80 border-t border-b border-zinc-800/80">
            {filteredModules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="group py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-zinc-900/40 px-4 -mx-4 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-5">
                  {/* Numerical Chapter Number */}
                  <span className="font-mono text-xl sm:text-2xl font-bold text-zinc-600 group-hover:text-cyan-400 transition-colors w-10 shrink-0">
                    {mod.num.toString().padStart(2, '0')}
                  </span>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {mod.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl font-sans">
                      {mod.tagline}
                    </p>

                    <div className="pt-1.5 flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {mod.keyConcepts.map((concept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1 font-mono text-xs text-zinc-500">
                  <span>~{mod.estimatedHours}h read</span>
                  <span className="inline-flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Grid Cards Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredModules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-xs">
                    <span className="font-bold text-cyan-400">
                      MODULE {mod.num.toString().padStart(2, '0')}
                    </span>
                    <span className="text-zinc-500">~{mod.estimatedHours}h</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {mod.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
                  <span className="text-zinc-400">{mod.phaseName.split(' ')[0]}</span>
                  <span className="inline-flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                    <span>Open</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
