import Link from 'next/link';
import { ArrowLeft, Calculator, Search } from 'lucide-react';
import { notations } from '@/lib/bookData';

export const metadata = {
  title: 'Mathematical Notations - Introduction to Machine Learning',
  description: 'Complete mathematical symbols, variables, and notations used in Introduction to Machine Learning by Ethem Alpaydın.',
};

export default function NotationsPage() {
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
              <Calculator className="h-6 w-6" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Mathematical Notations
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Official mathematical conventions, vectors, matrices, random variables, and probability density functions used throughout the textbook (Book pages xxxix–xl).
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th scope="col" className="px-6 py-4 w-1/4">Symbol</th>
                  <th scope="col" className="px-6 py-4">Definition / Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {notations.map((item, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-base text-indigo-600 dark:text-indigo-400">
                      {item.symbol}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-700 dark:text-zinc-300">
                      {item.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
