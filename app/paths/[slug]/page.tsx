import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GARDEN_PATHS, getPathBySlug } from '@/lib/pathsData';
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

  const isML = path.id === 'machine-learning';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Path Header Strip */}
      <div
        className="border-b py-12 relative overflow-hidden"
        style={{
          backgroundColor: path.accentColor.tagBg,
          borderColor: path.accentColor.folderBorder,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
              style={{
                backgroundColor: path.accentColor.chipBg,
                color: path.accentColor.folderText,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>GARDEN_OF_EDEN // {path.id.toUpperCase()}</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
              style={{ color: path.accentColor.folderText }}
            >
              {path.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-800 leading-relaxed font-sans">
              {path.description}
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-zinc-200">
                {path.stats.modules} Modules
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-zinc-200">
                {path.stats.lessons} Lessons
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-zinc-200">
                {path.stats.interactiveCount} Interactive Labs
              </span>
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
                <Layers className="h-4 w-4 text-indigo-500" />
                <span>CURRICULUM_MODULES</span>
              </div>
              <span className="text-zinc-400">{path.modules.length} SEQUENCED CHAPTERS</span>
            </div>

            <div className="space-y-4">
              {path.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
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
            </div>
          </div>

          {/* Right Action Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                <Compass className="h-4 w-4 text-indigo-500" />
                <span>STUDY_ACTIONS</span>
              </div>

              {isML ? (
                <div className="space-y-2.5">
                  <Link
                    href="/chapter/01-introduction"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read Chapter 01</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/roadmap"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Interactive Concept DAG</span>
                  </Link>

                  <Link
                    href="/workbench"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Beaker className="h-4 w-4" />
                    <span>Launch Math Workbench</span>
                  </Link>

                  <Link
                    href="/roadmap"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-indigo-500" />
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
