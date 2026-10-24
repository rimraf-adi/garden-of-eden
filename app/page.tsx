'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  ChevronRight,
  Calculator,
  Compass,
  Cpu,
  Beaker,
  Target,
  Activity,
  CheckCircle2,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { chaptersIndex, bookMeta } from '@/lib/bookData';
import { LEARNING_TRACKS, CONCEPT_NODES } from '@/lib/curriculum';
import TrackCard from '@/features/roadmap/TrackCard';

const CATEGORIES = [
  'All',
  'Foundations',
  'Parametric',
  'Unsupervised',
  'Nonparametric',
  'Tree Models',
  'Discriminative',
  'Neural Networks',
  'Kernel Methods',
  'Probabilistic',
  'Ensembles',
  'Reinforcement',
  'Evaluation',
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = chaptersIndex.filter((ch) => {
    const matchesCategory =
      selectedCategory === 'All' || ch.tag.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ch.title.toLowerCase().includes(query) ||
      ch.summary.toLowerCase().includes(query) ||
      ch.sections.some((s) => s.title.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Fanout-Inspired Engineering Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold uppercase tracking-wider">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>TOPOLOGY :: ALPAYDIN_2ND_EDITION</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold uppercase tracking-wider">
                  <Activity className="h-3 w-3" />
                  <span>SYSTEM_ONLINE</span>
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.08]">
                Introduction to Machine Learning
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-base sm:text-lg font-medium text-zinc-700 dark:text-zinc-300">
                <span>
                  By{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {bookMeta.author}
                  </strong>
                </span>
                <span className="text-zinc-400">·</span>
                <span>The MIT Press (2nd Edition)</span>
                <span className="text-zinc-400">·</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  STE-100 Compliant
                </span>
              </div>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                An interactive engineering workbench and complete online edition of Alpaydın&apos;s
                standard graduate textbook. Features 495 display equations, prerequisite DAGs,
                real-time parameter simulations, and deliberate practice drills.
              </p>

              {/* Action Buttons Matrix */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/roadmap"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore Concept Roadmap (DAG)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/workbench"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-colors"
                >
                  <Beaker className="h-4 w-4 text-emerald-500" />
                  <span>Interactive Workbench</span>
                </Link>

                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition-colors"
                >
                  <Target className="h-4 w-4 text-amber-500" />
                  <span>Practice Drills</span>
                </Link>
              </div>
            </div>

            {/* Right Telemetry Column (Fanout Control Deck) */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-6 shadow-xl shadow-zinc-900/5 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <span>CURRICULUM_TELEMETRY</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">V2.4_TURBOPACK</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      Chapters
                    </div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      19
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">Complete Textbook</div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Tracks</div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      07
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">Structured DAG</div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      Display Math
                    </div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      495
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">KaTeX Verified</div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      Simulations
                    </div>
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      11
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">Interactive Labs</div>
                  </div>
                </div>

                <div className="pt-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span>Keyboard shortcut:</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold">
                      ⌘K / Ctrl+K
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Desktop optimized:</span>
                    <span className="text-emerald-500 font-bold">Recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Tracks Strip */}
      <section className="py-12 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                07 Pedagogical Sequences
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Learning Tracks & Concept Topography
              </h2>
            </div>
            <Link
              href="/roadmap"
              className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View Full DAG</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEARNING_TRACKS.slice(0, 4).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Reader Index */}
      <section className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
              Complete Textbook Catalog
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Table of Contents & Reader
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search chapters or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-1.5 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/chapter/${chapter.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    CHAPTER {chapter.num.toString().padStart(2, '0')}
                  </span>
                  <span className="text-zinc-400">{chapter.pages}</span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {chapter.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {chapter.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px]">
                  {chapter.tag}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Read</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
