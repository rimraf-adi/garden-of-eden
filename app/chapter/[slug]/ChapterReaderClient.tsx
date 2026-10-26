'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Copy,
  Check,
  ChevronRight,
  Menu,
  X,
  Type,
  ListOrdered,
  BookMarked,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ChapterDetail, ChapterMeta } from '@/lib/bookData';
import FormattedContent from '@/components/FormattedContent';
import IllustrationDispatcher from '@/components/visuals/IllustrationDispatcher';

interface Props {
  chapter: ChapterDetail;
  rawLatex: string;
  prevChapter: ChapterMeta | null;
  nextChapter: ChapterMeta | null;
}

interface Ste100Data {
  chapterNum: number;
  slug: string;
  title: string;
  sections: { id: string; title: string; rules: string[] }[];
}

export default function ChapterReaderClient({
  chapter,
  rawLatex,
  prevChapter,
  nextChapter,
}: Props) {
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSerif, setFontSerif] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSte100Mode, setIsSte100Mode] = useState(false);
  const [ste100Data, setSte100Data] = useState<Ste100Data | null>(null);

  useEffect(() => {
    // Try to load STE100 data if available for this chapter
    const formattedNum = String(chapter.num).padStart(2, '0');
    fetch(`/data/ste100/chapter-${formattedNum}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSte100Data(data);
      })
      .catch(() => {});
  }, [chapter.num]);

  const copyLatex = () => {
    navigator.clipboard.writeText(rawLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_55%)]">
      {/* Sticky Top Sub-header */}
      <div className="sticky top-16 z-30 border-b border-zinc-200/60 dark:border-white/10 bg-white/60 dark:bg-[#08090d]/60 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Contents</span>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Chapter {chapter.num}
            </span>
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-md">
              {chapter.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSte100Mode(!isSte100Mode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                isSte100Mode
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
              title="Toggle ASD-STE100 Simplified Technical English view"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{isSte100Mode ? 'STE100 Mode' : 'STE100 View'}</span>
            </button>
            <button
              onClick={() => setFontSerif(!fontSerif)}
              className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Toggle Serif / Sans font"
            >
              <Type className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLargeText(!largeText)}
              className="px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Toggle font size"
            >
              {largeText ? 'A-' : 'A+'}
            </button>
            <button
              onClick={() => setShowLatexModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-white px-4 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View TeX</span>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar: Chapter Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-36 rounded-2xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md p-5 shadow-lg shadow-zinc-950/5 max-h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
              <ListOrdered className="h-4 w-4" />
              <span>Chapter Navigation</span>
            </div>

            <div className="space-y-3 text-xs">
              {chapter.intro && (
                <a
                  href="#overview"
                  className="block font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  Overview & Abstract
                </a>
              )}

              {chapter.sections.map((sec, idx) => (
                <div key={sec.id} className="space-y-1">
                  <a
                    href={`#section-${idx}`}
                    className="block font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 transition"
                  >
                    {sec.id} {sec.title}
                  </a>
                  {sec.subsections.length > 0 && (
                    <div className="pl-3 border-l border-zinc-200 dark:border-zinc-800 space-y-1">
                      {sec.subsections.map((sub, sIdx) => (
                        <a
                          key={sub.id}
                          href={`#subsection-${idx}-${sIdx}`}
                          className="block text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition text-[11px]"
                        >
                          {sub.id} {sub.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {chapter.exercises.length > 0 && (
                <a
                  href="#exercises"
                  className="block font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 transition pt-2 border-t border-zinc-100 dark:border-zinc-800"
                >
                  Exercises ({chapter.exercises.length})
                </a>
              )}

              {chapter.references.length > 0 && (
                <a
                  href="#references"
                  className="block font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  References ({chapter.references.length})
                </a>
              )}
            </div>
          </aside>

          {/* Main Reading Column */}
          <main className="lg:col-span-9 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-white/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-lg shadow-zinc-950/5">
            {/* Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  Chapter {chapter.num}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {chapter.tag}
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {chapter.readingTimeMin} min read ({chapter.wordCount.toLocaleString()} words)
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-xs text-zinc-500 font-mono">
                  Book pp. {chapter.pages} (PDF {chapter.pdfPages})
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
                {chapter.title}
              </h1>
            </div>

            {/* Loopable Visual Illustration */}
            <IllustrationDispatcher chapterNum={chapter.num} />

            {/* STE100 Banner if active */}
            {isSte100Mode && (
              <div className="mb-10 p-6 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
                  <Zap className="h-4 w-4" />
                  <span>ASD-STE100 Simplified Technical English Mode</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Strict controlled technical English: max 20 words per sentence, active voice, one instruction per line, zero ambiguous terminology.
                </p>
              </div>
            )}

            {/* Content rendering: STE100 Mode vs Full Textbook Mode */}
            {isSte100Mode && ste100Data ? (
              <div className="space-y-12">
                {ste100Data.sections.map((sec, idx) => (
                  <div key={sec.id} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 space-y-4">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-mono text-base">{sec.id}</span>
                      <span>{sec.title}</span>
                    </h3>
                    <ul className="space-y-2.5 pl-5 list-disc marker:text-amber-500">
                      {sec.rules.map((rule, rIdx) => (
                        <li key={rIdx} className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Chapter Intro / Abstract */}
                {chapter.intro && (
                  <div id="overview" className="mb-12 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/60 p-6 sm:p-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                      <BookMarked className="h-4 w-4" />
                      <span>Chapter Synopsis</span>
                    </div>
                    <div className={fontSerif ? 'font-serif text-lg leading-relaxed' : 'text-base leading-relaxed'}>
                      <FormattedContent content={chapter.intro} />
                    </div>
                  </div>
                )}

                {/* Sections */}
                <div className={`space-y-16 ${fontSerif ? 'font-serif' : 'font-sans'} ${largeText ? 'text-xl' : 'text-base sm:text-lg'}`}>
                  {chapter.sections.map((sec, idx) => (
                    <section key={sec.id} id={`section-${idx}`} className="space-y-6 scroll-mt-28">
                      <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 flex items-baseline gap-3">
                          <span className="text-amber-600 dark:text-amber-400 font-mono text-xl sm:text-2xl">
                            {sec.id}
                          </span>
                          <span>{sec.title}</span>
                        </h2>
                      </div>

                      {sec.intro && <FormattedContent content={sec.intro} />}

                      {/* Subsections */}
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sub.id} id={`subsection-${idx}-${sIdx}`} className="pt-6 space-y-4 scroll-mt-28">
                          <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200 flex items-baseline gap-2.5">
                            <span className="text-amber-500 font-mono text-lg">{sub.id}</span>
                            <span>{sub.title}</span>
                          </h3>
                          <FormattedContent content={sub.content} />
                        </div>
                      ))}
                    </section>
                  ))}
                </div>
              </>
            )}

            {/* Exercises Section */}
            {chapter.exercises.length > 0 && (
              <section id="exercises" className="mt-20 pt-10 border-t-2 border-zinc-200 dark:border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    Chapter Exercises
                  </h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {chapter.exercises.length} problems
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {chapter.exercises.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 space-y-2 hover:border-amber-300 dark:hover:border-amber-800 transition"
                    >
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                        Exercise {exIdx + 1}
                      </span>
                      <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {ex.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* References Section */}
            {chapter.references.length > 0 && (
              <section id="references" className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    References & Literature
                  </h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {chapter.references.length} papers
                  </span>
                </div>

                <div className="space-y-3">
                  {chapter.references.map((ref, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono"
                    >
                      {ref}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prev / Next chapter navigation */}
            <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevChapter ? (
                <Link
                  href={`/chapter/${prevChapter.slug}`}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition group flex flex-col justify-between"
                >
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-semibold uppercase tracking-wider mb-2">
                    <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                    Previous Chapter
                  </span>
                  <div>
                    <span className="text-xs text-amber-500 font-mono">Chapter {prevChapter.num}</span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {prevChapter.title}
                    </h4>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextChapter && (
                <Link
                  href={`/chapter/${nextChapter.slug}`}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition group flex flex-col justify-between text-right"
                >
                  <span className="text-xs text-zinc-400 flex items-center justify-end gap-1 font-semibold uppercase tracking-wider mb-2">
                    Next Chapter
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div>
                    <span className="text-xs text-amber-500 font-mono">Chapter {nextChapter.num}</span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {nextChapter.title}
                    </h4>
                  </div>
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* LaTeX Source Code Modal */}
      {showLatexModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-zinc-100 font-mono">
                  {chapter.slug}.tex
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyLatex}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy LaTeX'}</span>
                </button>
                <button
                  onClick={() => setShowLatexModal(false)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed bg-zinc-950/60">
              <pre className="whitespace-pre-wrap">{rawLatex}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
