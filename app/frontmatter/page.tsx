import Link from 'next/link';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { frontmatter, bookMeta } from '@/lib/bookData';
import FormattedContent from '@/components/FormattedContent';

export const metadata = {
  title: 'Preface & Notes - Introduction to Machine Learning',
  description: 'Preface, Series Foreword, Acknowledgments, and Notes for the Second Edition by Ethem Alpaydın.',
};

export default function FrontmatterPage() {
  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_55%)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Book Contents
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bookmark className="h-6 w-6" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Preface, Foreword & Notes
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Introductory remarks and historical reflections by author Ethem Alpaydın and series editor Thomas Dietterich (The MIT Press).
          </p>
        </div>

        {/* Series Foreword */}
        <section className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Series Introduction
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Series Foreword
            </h2>
          </div>
          <FormattedContent content={frontmatter.seriesForeword} />
        </section>

        {/* Preface */}
        <section className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Author&apos;s Preface
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Preface
            </h2>
          </div>
          <FormattedContent content={frontmatter.preface} />
        </section>

        {/* Notes for the Second Edition */}
        <section className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Second Edition
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Notes for the Second Edition
            </h2>
          </div>
          <FormattedContent content={frontmatter.notesSecondEdition} />
        </section>

        {/* Acknowledgments */}
        <section className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Colleagues & Mentors
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Acknowledgments
            </h2>
          </div>
          <FormattedContent content={frontmatter.acknowledgments} />
        </section>
      </div>
    </div>
  );
}
