'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Cpu,
  Calculator,
  Compass,
  CheckCircle2,
  Atom,
  Zap,
  Activity
} from 'lucide-react';

export default function HomePage() {
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
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* =========================================================================
          HERO SECTION: Full-Bleed Edge-to-Edge Tree of Knowledge Sanctuary
         ========================================================================= */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden -mt-16 pt-24 sm:pt-28 pb-10 sm:pb-14">
        {/* Full-Bleed Background Image (NO bento box, spans entire viewport) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/hero-tree.jpg"
            alt="Garden of Eden — Sacred Tree of Knowledge"
            fill
            priority
            className="object-cover object-center scale-100"
          />

          {/* Atmospheric Mist & Sunlight Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafc] via-[#fafafc]/50 to-transparent dark:from-[#08090d] dark:via-[#08090d]/50 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-transparent dark:from-[#08090d]/85 dark:via-transparent dark:to-transparent" />

          {/* Ambient Warm Golden Sunlight Bloom */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-b from-amber-300/25 via-amber-200/10 to-transparent blur-3xl rounded-full" />

          {/* Full-Screen Faint Sacred Geometry & Matrix Grid Lines */}
          <div className="absolute inset-0 opacity-15 dark:opacity-10 bg-[radial-gradient(#d97706_1.2px,transparent_1.2px)] [background-size:28px_28px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        </div>

        {/* Center Content: Pure Editorial Luxury Typography */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center my-auto pt-8 sm:pt-14 pb-8">
          <div className="space-y-5 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif tracking-tight text-zinc-900 dark:text-white leading-[1.12]">
              The Art of{' '}
              <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 dark:from-amber-200 dark:via-amber-300 dark:to-yellow-100 drop-shadow-xs">
                Intelligent Systems
              </span>{' '}
              Platform
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-zinc-700 dark:text-zinc-200/90 leading-relaxed font-sans">
              A personal sanctuary to cultivate first-principles mastery, mathematical rigor,
              and architectural clarity through science-backed open curricula.
            </p>

            {/* Action Buttons matching ATMA Wellness aesthetic */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-3 sm:pt-4">
              <Link
                href="/modules"
                className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-xs sm:text-sm transition-all shadow-xl shadow-zinc-950/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Begin Your Journey
              </Link>

              <Link
                href="#table-of-contents"
                className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full border border-zinc-400/80 dark:border-white/20 bg-white/70 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs sm:text-sm backdrop-blur-md transition-all shadow-xs"
              >
                Practice & Explore
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Bottom Grove Strip (Edge-to-Edge Container, Floating Over Mist) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md py-3.5 sm:py-4 px-6 sm:px-8 shadow-lg shadow-zinc-950/5">
            <div className="flex flex-wrap items-center justify-around gap-4 sm:gap-8 text-xs font-serif text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2 group hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default">
                <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span>Foundations & Geometry</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default">
                <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span>Probability & Information</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default">
                <div className="w-2 h-2 rounded-full bg-sky-500/80" />
                <span>Statistical Learning Theory</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default">
                <div className="w-2 h-2 rounded-full bg-indigo-500/80" />
                <span>Neural Architectures</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default">
                <div className="w-2 h-2 rounded-full bg-purple-500/80" />
                <span>Autonomous Agents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PICK YOUR PATH / Choose where to start (The 7 Curated Binders)
         ========================================================================= */}
      <section className="py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-3xl space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400">
            PICK YOUR PATH
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-zinc-950 dark:text-white leading-tight">
            Choose where to start
          </h2>
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
          SECTION 3: THREE SANCTUARY PILLARS (Clean, Non-Redundant Engineering Rigor)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white/60 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400">
              The Pedagogy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-zinc-950 dark:text-white">
              Cultivated from First Principles
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every concept is mathematically anchored and verified in KaTeX, hardware-aware, and reproducible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                ∑
              </div>
              <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white">
                495+ Verified Formulas
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Full mathematical derivations in KaTeX—from orthogonal projections and spectral theorems to Vapnik-Chervonenkis generalization bounds.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white">
                Hardware-Aware Systems
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Hardware memory hierarchies: SRAM tiling, KV cache footprint budgeting, FlashAttention online softmax, and distributed consensus topologies.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white">
                Interactive Laboratories
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Real-time browser simulation workbenches. Test decision boundaries, learning dynamics, and KV cache mechanics with live analytical updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COMPLETE CHRONOLOGICAL TABLE OF CONTENTS (Curriculum Index)
         ========================================================================= */}
      <section id="table-of-contents" className="py-16 sm:py-24 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-amber-500 shadow-2xs font-sans"
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
