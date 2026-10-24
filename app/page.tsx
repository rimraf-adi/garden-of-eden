'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Beaker,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Layers,
  ChevronRight,
  Sprout,
  Activity
} from 'lucide-react';
import EdenCard, { EdenCardItem } from '@/components/EdenCard';
import FolderCard from '@/components/FolderCard';
import { GARDEN_PATHS } from '@/lib/pathsData';
import { chaptersIndex, bookMeta } from '@/lib/bookData';

const EDEN_GROVES: EdenCardItem[] = [
  {
    id: 'grove-ml',
    tag: 'Foundations',
    title: 'Statistical Machine Learning',
    subtitle: 'Inductive bias, PAC generalization bounds, Bayesian decision surfaces, and kernel machines.',
    href: '/chapter/01-introduction',
    accentGlow: '#059669',
    visualType: 'mycelium',
    heightClass: 'min-h-[460px]',
  },
  {
    id: 'grove-dl',
    tag: 'Architectures',
    title: 'Deep Representations & Scaling',
    subtitle: 'Self-attention geometry, transformer scaling laws, latent diffusion, and flow matching dynamics.',
    href: '/paths/deep-learning',
    accentGlow: '#d97706',
    visualType: 'amber-bloom',
    heightClass: 'min-h-[510px] sm:-translate-y-4', // Taller staggered card matching Haumind
  },
  {
    id: 'grove-inf',
    tag: 'Uncertainty',
    title: 'Information Theory & Entropy',
    subtitle: 'Shannon entropy, channel capacity, mutual information, and the geometric measure of uncertainty.',
    href: '/paths/information-theory',
    accentGlow: '#0284c7',
    visualType: 'prism-refract',
    heightClass: 'min-h-[475px]',
  },
  {
    id: 'grove-math',
    tag: 'Geometry',
    title: 'Linear Algebra & Optimization',
    subtitle: 'Spectral decompositions, SVD projections, Riemannian gradients, and dual Lagrangian manifolds.',
    href: '/paths/linear-algebra',
    accentGlow: '#e11d48',
    visualType: 'botanical-petal',
    heightClass: 'min-h-[460px]',
  },
];

export default function HomePage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-100 selection:bg-emerald-500/25 selection:text-emerald-200">
      {/* Ambient Top Ethereal Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 eden-glow" />

      {/* Hero Section :: Haumind Aesthetic */}
      <section className="relative pt-16 sm:pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 sm:mb-20">
          <div className="max-w-2xl space-y-5">
            {/* Tag capsule */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-mono text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>The Primordial Groves</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-zinc-100 leading-[1.08]">
              Guiding you <br />
              back to{' '}
              <span className="font-serif italic text-emerald-400 font-light drop-shadow-sm">
                first principles.
              </span>
            </h1>
          </div>

          <div className="max-w-md lg:pb-2">
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Every path is different. These are the ways we cultivate mathematical intuition,
              rigorous proofs, and enduring computational mastery.
            </p>
          </div>
        </div>

        {/* Haumind Floating Ethereal Cards Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {EDEN_GROVES.map((card) => (
            <EdenCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* Philosophy / Ethos Section :: Haumind Style */}
      <section className="relative py-28 sm:py-36 border-t border-zinc-900 overflow-hidden bg-gradient-to-b from-[#0a0b0d] via-[#0d0f13] to-[#0a0b0d]">
        {/* Soft horizon dawn glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(94,234,212,0.06),transparent_60%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800/80 bg-zinc-900/40 text-xs font-mono text-zinc-400">
            <span>Philosophy</span>
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-relaxed text-zinc-300">
            At Garden of Eden, we don&apos;t rush through code —{' '}
            <span className="text-zinc-100 italic">we help it unfold with intention.</span>{' '}
            Through first-principles mathematics, interactive visual workbenches, and a steady pace,{' '}
            <span className="text-emerald-300">we support knowledge that lasts.</span>
          </blockquote>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-100 transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span>Explore Prerequisite DAG</span>
            </Link>

            <Link
              href="/workbench"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-900/60 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 transition-colors"
            >
              <Beaker className="h-3.5 w-3.5" />
              <span>Open Simulation Workbench</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Fanout-Inspired Tabbed Binder Paths */}
      <section className="py-24 border-t border-zinc-900 bg-[#090a0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest font-bold text-emerald-400/90">
              PICK YOUR PATH
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-zinc-100">
              Curriculum Portfolios
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Physical tabbed binder folders detailing comprehensive curricula, sequenced lessons,
              and interactive telemetry across 7 computing disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {GARDEN_PATHS.map((path) => (
              <FolderCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      </section>

      {/* Alpaydın Core Textbook Chapter Matrix */}
      <section className="py-20 border-t border-zinc-900 bg-[#0a0b0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-500">
                Primary Textbook Corpus
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-zinc-100 mt-1">
                Ethem Alpaydın: Introduction to Machine Learning
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                2nd Edition · The MIT Press · 19 Complete Chapters · 495 Verified Equations
              </p>
            </div>

            <Link
              href="/chapter/01-introduction"
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Begin at Chapter 1</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chaptersIndex.slice(0, 9).map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/chapter/${chapter.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 font-mono text-xs">
                    <span className="font-bold text-emerald-400/90">
                      CH.{chapter.num.toString().padStart(2, '0')}
                    </span>
                    <span className="text-zinc-500">{chapter.pages}</span>
                  </div>

                  <h3 className="font-serif text-base font-normal text-zinc-200 group-hover:text-white transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {chapter.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="text-[11px] text-zinc-400">{chapter.tag}</span>
                  <span className="flex items-center gap-1 text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/chapter/01-introduction"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Explore All 19 Textbook Chapters</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
