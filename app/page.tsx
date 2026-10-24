'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Compass,
  Beaker,
  Target,
  BookOpen,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Terminal,
  Zap,
  Network,
  Calculator,
  ShieldCheck,
  Code
} from 'lucide-react';
import { GARDEN_PATHS } from '@/lib/pathsData';
import { chaptersIndex } from '@/lib/bookData';

const FAQS = [
  {
    q: 'What is the Garden of Eden?',
    a: 'Garden of Eden is an open, aesthetic computational arboretum designed for AI engineers and researchers. It bridges foundational mathematics (linear algebra, vector calculus, probability, information theory) with frontier systems (KV cache mechanics, FlashAttention, distributed consensus, and transformer architectures).',
  },
  {
    q: 'How is this different from generic AI courses?',
    a: 'Most platforms focus on surface-level framework APIs. Garden of Eden cultivates first-principles understanding: every concept includes mathematical derivations verified in KaTeX, interactive simulation workbenches, prerequisite DAGs, and deliberate practice drills.',
  },
  {
    q: 'Are the mathematical formulas and code reproducible?',
    a: 'Yes, 100%. All 495 display equations, algorithms, and interactive workbenches are formulated from open scientific principles. The simulation labs run locally in your browser with real-time analytical recalculation.',
  },
  {
    q: 'Is Garden of Eden free and open source?',
    a: 'Yes. The entire curriculum, interactive laboratories, concept DAGs, and practice worksheets are freely accessible to engineers, students, and independent researchers worldwide.',
  },
  {
    q: 'What should my learning progression be?',
    a: 'Start by picking a path from our Curriculum Portfolios or consult our Concept Roadmap (DAG) to trace prerequisite dependencies before diving into the interactive simulation workbench.',
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* =========================================================================
          HERO SECTION: AutoBiz-Inspired Midnight with Glowing Sky-Cyan Aurora
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0a0d14] text-white pt-16 sm:pt-24 pb-28 sm:pb-36">
        {/* Luminous Center-Bottom Aurora Glow fading into the section below */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[120%] max-w-6xl h-[420px] bg-gradient-to-t from-cyan-400/40 via-sky-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-700/80 bg-zinc-800/60 backdrop-blur-md text-xs font-mono text-zinc-300 mb-8">
            <span className="text-cyan-400 font-bold">*</span>
            <span>Living Garden for AI Engineering</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Main Headline */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] text-white">
                Master & engineer <br />
                modern AI with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
                  first principles
                </span>
              </h1>
            </div>

            {/* Right Subtext & Action Column */}
            <div className="lg:col-span-5 space-y-6 lg:pl-6">
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                Discover a living computational arboretum. From GPU memory hierarchies,
                FlashAttention tiling, and distributed consensus to self-attention manifolds,
                information theory, and statistical learning.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/modules"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-all shadow-lg shadow-cyan-500/10"
                >
                  <span>Explore Modules</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/chapter/01-introduction"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-white font-medium text-sm transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span>Library Modules</span>
                </Link>
              </div>

              {/* Social Proof / Trust Badge Strip */}
              <div className="pt-4 flex items-center gap-4 text-xs font-mono text-zinc-400 border-t border-zinc-800/80">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0a0d14] bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                    ∑
                  </span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0a0d14] bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[10px]">
                    GPU
                  </span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0a0d14] bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                    DAG
                  </span>
                </div>
                <span>★ 495+ Verified Formulas · 19 Comprehensive Chapters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: How Can We Help (AutoBiz 2-Column Clean Editorial Layout)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-cyan-600 block mb-2">
                The Pedagogy
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
                How the Garden cultivates AI engineers
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-zinc-600 leading-relaxed">
              <p>
                At Garden of Eden, we warmly invite you to explore the intricacies of modern intelligent systems.
                In this living arboretum, we dive into rigorous topics—including hardware-aware GPU memory tiling,
                KV-cache token budgets, high-dimensional probability, and distributed consensus algorithms.
              </p>
              <p>
                Our mission is to ensure you depart with not only actionable engineering insights,
                but also a clear mathematical roadmap to drive your technical breakthroughs from first principles.
              </p>
              <div className="pt-2">
                <Link
                  href="/modules"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900 hover:text-cyan-600 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Metric Stat Numbers (100%, 495+, 19 Modules) */}
          <div className="mt-20 pt-12 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-sans">
                100%
              </div>
              <p className="text-sm font-semibold text-zinc-800">
                Open Access & First-Principles Code
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Free for independent researchers, engineers, and students worldwide.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-cyan-600 font-sans">
                495+
              </div>
              <p className="text-sm font-semibold text-zinc-800">
                KaTeX Mathematical Verifications
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Display equations, proofs, and continuous sample complexity bounds.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 font-sans">
                19
              </div>
              <p className="text-sm font-semibold text-zinc-800">
                Sequenced Chapters & Workbenches
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Covering parametric estimation, kernels, reinforcement learning, and systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Core AI Engineering Pillars (AutoBiz-Style Clean Feature Cards)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-zinc-50/70 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-cyan-600">
              The Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
              Core AI Engineering Pillars
            </h2>
            <p className="text-sm sm:text-base text-zinc-500">
              Harnessing the power of first-principles computation for unmatched engineering precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Link
              href="/paths/inference-engineering"
              className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-cyan-600 transition-colors">
                  Inference Engineering
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  KV cache memory sizing, FlashAttention SRAM tiling, and post-training quantization budgets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-medium text-cyan-600">
                <span>Explore Grove</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/paths/deep-learning"
              className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-cyan-600 transition-colors">
                  Foundation Architectures
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Self-attention manifolds, rotary embeddings, mixture of experts, and continuous flow matching.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-medium text-cyan-600">
                <span>Explore Grove</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href="/paths/system-design"
              className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Network className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-cyan-600 transition-colors">
                  Distributed AI Systems
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Raft consensus, sharding topologies, FSDP tensor model parallelism, and storage engines.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-medium text-cyan-600">
                <span>Explore Grove</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              href="/paths/agentic-systems"
              className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-cyan-600 transition-colors">
                  Agentic Systems & RAG
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Grammar-constrained JSON decoding, ReAct loops, vector index hierarchies, and evaluation suites.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-medium text-cyan-600">
                <span>Explore Grove</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: What Disciplines We Cover (AutoBiz Dramatic Stacked Dark Section)
         ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#0a0d14] text-white overflow-hidden text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="font-mono text-xs uppercase tracking-widest font-bold text-cyan-400 block mb-3">
            Core Computational Groves
          </span>
          <h2 className="text-sm sm:text-base text-zinc-400 mb-10">
            Delving Deep into the Full Hierarchy of AI & Computer Science
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {[
              'GPU Systems & Inference Engineering',
              'Deep Learning & Foundation Models',
              'Distributed Systems & Cluster Sharding',
              'Autonomous Agents & Production RAG',
              'Linear Algebra & High-Dimensional Spaces',
              'Information Theory & Statistical Learning',
            ].map((discipline, idx) => (
              <div
                key={idx}
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-400 hover:text-white transition-colors cursor-default"
              >
                {discipline}
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm transition-all"
            >
              <span>Explore Chronological Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Frequently Asked Questions (AutoBiz Accordion Layout)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-cyan-600">
                Clarity & Access
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Everything you need to know about our first-principles AI curriculum,
                mathematical formulations, and reproducible simulation labs.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between font-semibold text-zinc-900 hover:text-cyan-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 transform transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-cyan-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: AutoBiz Dramatic Signature Footer
         ========================================================================= */}
      <footer className="bg-[#090b10] text-zinc-400 pt-20 pb-12 overflow-hidden border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start justify-between">
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Let&apos;s build the future of AI together.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
                A living garden of computational knowledge. Engineered from first principles,
                maintained by independent thinkers and engineers.
              </p>
              <div className="pt-2">
                <Link
                  href="/modules"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 transition-colors"
                >
                  <span>Explore Modules</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
              <div className="space-y-3">
                <div className="font-bold text-white uppercase tracking-wider">Curricula</div>
                <ul className="space-y-2">
                  <li><Link href="/paths/inference-engineering" className="hover:text-cyan-400 transition-colors">Inference Engineering</Link></li>
                  <li><Link href="/paths/deep-learning" className="hover:text-cyan-400 transition-colors">Foundation Models</Link></li>
                  <li><Link href="/paths/system-design" className="hover:text-cyan-400 transition-colors">Distributed Systems</Link></li>
                  <li><Link href="/paths/agentic-systems" className="hover:text-cyan-400 transition-colors">Agentic Architectures</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-white uppercase tracking-wider">Architecture</div>
                <ul className="space-y-2">
                  <li><Link href="/modules" className="hover:text-cyan-400 transition-colors">Chronological Modules</Link></li>
                  <li><Link href="/chapter/01-introduction" className="hover:text-cyan-400 transition-colors">Curriculum Modules</Link></li>
                  <li><Link href="/notations" className="hover:text-cyan-400 transition-colors">Mathematical Notations</Link></li>
                  <li><Link href="/appendix" className="hover:text-cyan-400 transition-colors">Probability Appendix</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-white uppercase tracking-wider">Platform</div>
                <ul className="space-y-2">
                  <li><Link href="/chapter/01-introduction" className="hover:text-cyan-400 transition-colors">Module Reader</Link></li>
                  <li><Link href="/frontmatter" className="hover:text-cyan-400 transition-colors">Principles & Ethos</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Giant Bottom Typographic Signature Logo */}
          <div className="pt-12 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-zinc-800 select-none flex items-center gap-2">
              <span className="text-cyan-400">*</span>
              <span>GardenOfEden</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              © 2026 Garden of Eden. All computational rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
