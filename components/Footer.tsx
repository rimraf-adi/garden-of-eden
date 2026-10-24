import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
              <BookOpen className="h-5 w-5" />
              <span>Introduction to Machine Learning</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              A comprehensive textbook by Ethem Alpaydın, published by The MIT Press in the
              Adaptive Computation and Machine Learning Series. Complete with 19 chapters,
              mathematical notations, and foundational probabilistic theory.
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Department of Computer Engineering, Boğaziçi University.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  All 19 Chapters
                </Link>
              </li>
              <li>
                <Link href="/notations" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Mathematical Notations
                </Link>
              </li>
              <li>
                <Link href="/appendix" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Appendix A: Probability
                </Link>
              </li>
              <li>
                <Link href="/frontmatter" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Preface & Foreword
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Key Algorithms
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/chapter/02-supervised-learning" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  PAC Learning & VC Dimension
                </Link>
              </li>
              <li>
                <Link href="/chapter/07-clustering" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  k-Means & EM Algorithm
                </Link>
              </li>
              <li>
                <Link href="/chapter/11-multilayer-perceptrons" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Backpropagation & MLPs
                </Link>
              </li>
              <li>
                <Link href="/chapter/13-kernel-machines" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Support Vector Machines
                </Link>
              </li>
              <li>
                <Link href="/chapter/18-reinforcement-learning" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Q Learning & Bellman Eq.
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div>
            © The MIT Press & Ethem Alpaydın. Interactive web reader created with Next.js.
          </div>
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1">
              Parsed from LaTeX & Source PDF
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
