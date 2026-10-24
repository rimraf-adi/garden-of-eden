import Link from 'next/link';
import { ArrowLeft, Compass, BookOpen } from 'lucide-react';
import { appendix } from '@/lib/bookData';
import FormattedContent from '@/components/FormattedContent';

export const metadata = {
  title: 'Appendix A: Probability - Introduction to Machine Learning',
  description: 'Elements of probability, random variables, expectation, variance, and special distributions.',
};

export default function AppendixPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Book Contents
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Compass className="h-6 w-6" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {appendix.title}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
            <span>Book pp. {appendix.pages}</span>
            <span>·</span>
            <span>PDF pp. {appendix.pdfPages}</span>
            <span>·</span>
            <span className="font-mono text-indigo-500">Foundational Mathematical Reference</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <FormattedContent content={appendix.content} />
        </div>
      </div>
    </div>
  );
}
