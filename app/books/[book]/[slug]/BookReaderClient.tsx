'use client';

import { useState } from 'react';
import Link from 'next/link';
import MathText from '@/components/book/MathText';
import { ArrowLeft, ArrowRight, Clock, FileText, Copy, Check, Menu, X, Type, ListOrdered } from 'lucide-react';

interface NavChapter {
  slug: string;
  title: string;
  label: string;
}

interface Props {
  book: string;
  pathHref: string;
  bookTitle: string;
  chapterLabel: string;
  title: string;
  tag: string;
  readingTimeMin: number;
  wordCount: number;
  sections: { id: string; title: string; subs: { id: string; title: string }[] }[];
  prev: NavChapter | null;
  next: NavChapter | null;
  tex: string;
  children: React.ReactNode;
}

const labelOf = (l: string) => (/^[A-Z]$/.test(l) ? `Appendix ${l}` : `Chapter ${l}`);

export default function BookReaderClient({
  book, pathHref, bookTitle, chapterLabel, title, tag, readingTimeMin, wordCount, sections, prev, next, tex, children,
}: Props) {
  const [showTex, setShowTex] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serif, setSerif] = useState(true);
  const [large, setLarge] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const copyTex = () => {
    navigator.clipboard.writeText(tex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nav = (
    <div className="space-y-3 text-xs">
      {sections.map((sec) => (
        <div key={sec.id + sec.title} className="space-y-1">
          <a
            href={`#sec-${sec.id || sec.title}`}
            onClick={() => setNavOpen(false)}
            className="block font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-700 dark:hover:text-amber-300 transition"
          >
            {sec.id} <MathText x={sec.title} />
          </a>
          {sec.subs.length > 0 && (
            <div className="pl-3 border-l border-zinc-200 dark:border-white/10 space-y-1">
              {sec.subs.map((s) => (
                <a key={s.id} href={`#sub-${s.id}`} onClick={() => setNavOpen(false)} className="block text-zinc-500 hover:text-amber-700 dark:hover:text-amber-300 transition text-[11px]">
                  {s.id} <MathText x={s.title} />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_55%)]">
      <div className="sticky top-16 z-30 border-b border-zinc-200/60 dark:border-white/10 bg-white/60 dark:bg-[#08090d]/60 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={pathHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-700 dark:hover:text-amber-300 transition shrink-0">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{bookTitle}</span>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider shrink-0">{labelOf(chapterLabel)}</span>
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate hidden sm:block"><MathText x={title} /></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSerif(!serif)} className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" title="Toggle serif / sans">
              <Type className="h-4 w-4" />
            </button>
            <button onClick={() => setLarge(!large)} className="px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" title="Toggle font size">
              {large ? 'A-' : 'A+'}
            </button>
            <button onClick={() => setShowTex(true)} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-white px-4 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View TeX</span>
            </button>
            <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {navOpen && (
        <div className="lg:hidden mx-4 mt-4 rounded-2xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 max-h-[60vh] overflow-y-auto">
          {nav}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-3 sticky top-36 rounded-2xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md p-5 shadow-lg shadow-zinc-950/5 max-h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
              <ListOrdered className="h-4 w-4" />
              <span>In this chapter</span>
            </div>
            {nav}
          </aside>

          <main className="lg:col-span-9 min-w-0 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-white/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-lg shadow-zinc-950/5">
            <div className="border-b border-zinc-200 dark:border-white/10 pb-8 mb-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  {labelOf(chapterLabel)}
                </span>
                {tag && <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{tag}</span>}
                <span className="text-zinc-400">·</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTimeMin} min read ({wordCount.toLocaleString()} words)
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100"><MathText x={title} /></h1>
            </div>

            <div className={`space-y-14 text-zinc-700 dark:text-zinc-300 ${serif ? 'font-serif' : 'font-sans'} ${large ? 'text-xl' : 'text-base sm:text-lg'}`}>
              {children}
            </div>

            <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev ? (
                <Link href={`/books/${book}/${prev.slug}`} className="p-5 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-amber-400/60 hover:bg-amber-50/40 dark:hover:bg-amber-400/5 transition group">
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-semibold uppercase tracking-wider mb-2">
                    <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Previous
                  </span>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-mono">{labelOf(prev.label)}</span>
                  <h4 className="font-serif text-lg text-zinc-900 dark:text-zinc-100"><MathText x={prev.title} /></h4>
                </Link>
              ) : <div />}
              {next && (
                <Link href={`/books/${book}/${next.slug}`} className="p-5 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-amber-400/60 hover:bg-amber-50/40 dark:hover:bg-amber-400/5 transition group text-right">
                  <span className="text-xs text-zinc-400 flex items-center justify-end gap-1 font-semibold uppercase tracking-wider mb-2">
                    Next <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-mono">{labelOf(next.label)}</span>
                  <h4 className="font-serif text-lg text-zinc-900 dark:text-zinc-100"><MathText x={next.title} /></h4>
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      {showTex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <h3 className="text-sm font-bold text-zinc-100 font-mono">{title.replace(/\$/g, '')}.tex</h3>
              <div className="flex items-center gap-2">
                <button onClick={copyTex} className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy LaTeX'}</span>
                </button>
                <button onClick={() => setShowTex(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed bg-zinc-950/60">
              <pre className="whitespace-pre-wrap">{tex}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
