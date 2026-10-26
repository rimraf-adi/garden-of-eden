import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GARDEN_PATHS, getPathBySlug } from '@/lib/pathsData';
import { chaptersIndex } from '@/lib/bookData';
import { getBook } from '@/lib/books';
import MathText from '@/components/book/MathText';
import {
  Compass,
  BookOpen,
  ArrowRight,
  Beaker,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export const instant = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GARDEN_PATHS.map((p) => ({ slug: p.slug }));
}

export default async function PathPage({ params }: Props) {
  const { slug } = await params;
  const path = getPathBySlug(slug);

  if (!path) {
    notFound();
  }

  const isML = path.id === 'introduction-to-ml';
  const book = getBook(path.slug);

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_55%)]">
      {/* Path Header Strip */}
      <div className="border-b border-zinc-200/60 dark:border-white/10 py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-100/50 via-transparent to-transparent dark:from-amber-400/5" />
        <div className="absolute inset-0 pointer-events-none opacity-15 dark:opacity-10 bg-[radial-gradient(#d97706_1.2px,transparent_1.2px)] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-white/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md text-amber-700 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>GARDEN_OF_EDEN // {path.id.toUpperCase()}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              {path.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {path.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
              {[`${path.stats.modules} Modules`, `${path.stats.lessons} Lessons`, `${path.stats.interactiveCount} Interactive Labs`].map((t) => (
                <span key={t} className="px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-white/80 dark:border-white/10 font-bold text-zinc-800 dark:text-zinc-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Modules List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                <Layers className="h-4 w-4 text-amber-500" />
                <span>CURRICULUM_MODULES</span>
              </div>
              <span className="text-zinc-400">{book ? book.chapters.length : isML ? chaptersIndex.length : path.modules.length} SEQUENCED CHAPTERS</span>
            </div>

            {book && (
              <div className="space-y-4">
                {book.chapters.map((ch) => (
                  <Link
                    key={ch.slug}
                    href={`/books/${book.id}/${ch.slug}`}
                    className="group block p-6 rounded-2xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md shadow-lg shadow-zinc-950/5 hover:border-amber-400/60 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        {/^[A-Z]$/.test(ch.label) ? `APPENDIX ${ch.label}` : `CHAPTER ${ch.label.padStart(2, '0')}`}
                        {ch.tag ? <span className="ml-2 font-normal text-zinc-400">· {ch.tag}</span> : null}
                      </span>
                      <span className="text-zinc-400">{ch.readingTimeMin} min read</span>
                    </div>
                    <h3 className="font-serif text-xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      <MathText x={ch.title} />
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2"><MathText x={ch.summary} /></p>
                    <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {ch.sections.slice(0, 4).map((sec) => (
                        <span key={sec.id + sec.title} className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-zinc-700 dark:text-zinc-300">
                          {sec.id} <MathText x={sec.title} />
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {isML && (
              <div className="space-y-4">
                {chaptersIndex.map((ch) => (
                  <Link
                    key={ch.slug}
                    href={`/chapter/${ch.slug}`}
                    className="group block p-6 rounded-2xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md shadow-lg shadow-zinc-950/5 hover:border-amber-400/60 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        CHAPTER {ch.num.toString().padStart(2, '0')}
                      </span>
                      <span className="text-zinc-400">{ch.readingTimeMin} min read</span>
                    </div>
                    <h3 className="font-serif text-xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {ch.summary}
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {ch.sections.slice(0, 4).map((sec) => (
                        <span key={sec.id} className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-zinc-700 dark:text-zinc-300">
                          {sec.id} {sec.title}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isML && !book && <div className="space-y-4">
              {path.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-6 rounded-2xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      MODULE {mod.num.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">~2.5h</span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {mod.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {mod.summary}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {mod.keyConcepts.map((concept, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>}
          </div>

          {/* Right Action Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-6 rounded-2xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                <Compass className="h-4 w-4 text-amber-500" />
                <span>STUDY_ACTIONS</span>
              </div>

              {book ? (
                <div className="space-y-2.5">
                  <Link
                    href={`/books/${book.id}/${book.chapters[0].slug}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md shadow-amber-600/20"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Start Chapter 1</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {book.subtitle}. {book.chapters.length} chapters,{' '}
                    {book.chapters.reduce((a, c) => a + c.wordCount, 0).toLocaleString()} words.
                  </p>
                </div>
              ) : isML ? (
                <div className="space-y-2.5">
                  <Link
                    href="/chapter/01-introduction"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md shadow-amber-600/20"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read Chapter 01</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/roadmap"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-amber-500" />
                    <span>Interactive Concept DAG</span>
                  </Link>

                  <Link
                    href="/workbench"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
                  >
                    <Beaker className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Open Simulation Workbench</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <p>
                    This domain is part of the expanded Garden of Eden curriculum. Explore related
                    foundational algorithms and mathematical mechanics in the simulation workbench.
                  </p>

                  <Link
                    href="/workbench"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md shadow-amber-600/20"
                  >
                    <Beaker className="h-4 w-4" />
                    <span>Launch Math Workbench</span>
                  </Link>

                  <Link
                    href="/roadmap"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-amber-500" />
                    <span>View Cross-Domain DAG</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
