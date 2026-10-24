'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Clock,
  FileCode,
  ArrowRight,
  Layers,
  Sparkles,
  ChevronRight,
  Calculator,
  Compass,
  Cpu,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { chaptersIndex, bookMeta } from '@/lib/bookData';

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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-indigo-50/60 via-white to-zinc-50 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The MIT Press · Adaptive Computation and Machine Learning Series</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                {bookMeta.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-lg font-medium text-zinc-700 dark:text-zinc-300">
                <span>By <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{bookMeta.author}</strong></span>
                <span className="text-zinc-400">·</span>
                <span>{bookMeta.subtitle}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-sm px-2.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 font-mono text-zinc-600 dark:text-zinc-400">
                  {bookMeta.publishedYear}
                </span>
              </div>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                A unified, readable treatment of modern machine learning from basic statistics and pattern recognition to deep multilayer perceptrons, support vector machines, graphical models, and reinforcement learning.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#chapters"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all active:scale-[0.98]"
                >
                  <BookOpen className="h-4 w-4" />
                  Read Chapters
                </a>
                <Link
                  href="/notations"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Calculator className="h-4 w-4 text-indigo-500" />
                  Math Notations
                </Link>
                <Link
                  href="/appendix"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Compass className="h-4 w-4 text-indigo-500" />
                  Appendix: Probability
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
                <div className="rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 text-center sm:text-left">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">19</div>
                  <div className="text-xs font-medium text-zinc-500">Core Chapters</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 text-center sm:text-left">
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">572</div>
                  <div className="text-xs font-medium text-zinc-500">Book Pages</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 text-center sm:text-left">
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">150k+</div>
                  <div className="text-xs font-medium text-zinc-500">Extracted Words</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 text-center sm:text-left">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                  <div className="text-xs font-medium text-zinc-500">LaTeX Parsed</div>
                </div>
              </div>
            </div>

            {/* Book Cover Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group max-w-xs w-full">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-25 blur-lg group-hover:opacity-40 transition duration-500" />
                <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-2xl space-y-6">
                  <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      MIT Press Edition
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                      Introduction to Machine Learning
                    </h3>
                    <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                      Ethem Alpaydın
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span>Publisher</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">The MIT Press</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span>ISBN</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">{bookMeta.isbn}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                      <span>Series Editor</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">{bookMeta.seriesEditor}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Institution</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">Boğaziçi University</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/chapter/01-introduction"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
                    >
                      Start Reading Chapter 1
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Browser Section */}
      <section id="chapters" className="py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Complete Table of Contents
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Select any chapter to read online or copy the corresponding TeX source.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, topic..."
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <div
              key={chapter.slug}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-sm border border-indigo-100 dark:border-indigo-900">
                    {chapter.num}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {chapter.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {chapter.summary}
                  </p>
                </div>

                {/* Subsections list preview */}
                <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Sections ({chapter.sectionCount})
                  </span>
                  <div className="space-y-1">
                    {chapter.sections.slice(0, 3).map((sec) => (
                      <div key={sec.id} className="text-xs text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1.5">
                        <span className="text-indigo-500 font-mono text-[10px]">{sec.id}</span>
                        <span>{sec.title}</span>
                      </div>
                    ))}
                    {chapter.sectionCount > 3 && (
                      <span className="text-[11px] text-zinc-400 italic block">
                        +{chapter.sectionCount - 3} more sections...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {chapter.readingTimeMin} min
                  </span>
                  <span>·</span>
                  <span>pp. {chapter.pages}</span>
                </div>

                <Link
                  href={`/chapter/${chapter.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
                >
                  Read Chapter
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights / Features Banner */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Textbook Structure
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Built from Original LaTeX & Rigorous Machine Learning Foundations
            </h3>
            <p className="text-sm text-zinc-500 mt-3">
              Explore the core paradigms that formed the foundation of contemporary artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Statistical Learning & Decision Theory</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Maximum likelihood estimation, Bayes&apos; estimator, Gaussian processes, and Bayesian decision theory covering risk, loss functions, and discriminant functions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Neural Networks & Kernel Machines</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Multilayer perceptrons with backpropagation, RBF networks, Support Vector Machines (SVM), kernel trick, and multiple kernel learning.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Graphical Models & RL</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Hidden Markov Models (HMM), Belief Propagation on trees and polytrees, Markov Decision Processes, Q-learning, Sarsa, and POMDPs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
