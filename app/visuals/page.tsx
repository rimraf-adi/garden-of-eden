import Link from 'next/link';
import { Sparkles, ArrowLeft, Play, Eye } from 'lucide-react';
import IllustrationDispatcher from '@/components/visuals/IllustrationDispatcher';

export const metadata = {
  title: 'Visual Illustrations & Loopable Animations - Introduction to Machine Learning',
  description: 'Interactive, 60fps GIF-style loopable visual animations illustrating core machine learning concepts from Ethem Alpaydın’s textbook.',
};

const VISUAL_CHAPTERS = [
  { num: 1, slug: '01-introduction', title: 'Chapter 1: Introduction', concept: 'Classification vs. Regression vs. Clustering paradigms in action' },
  { num: 2, slug: '02-supervised-learning', title: 'Chapter 2: Supervised Learning', concept: 'Version Space, Most Specific (S) vs. Most General (G) hypothesis bounds' },
  { num: 3, slug: '03-bayesian-decision-theory', title: 'Chapter 3: Bayesian Decision Theory', concept: 'Prior, Likelihood, Posterior threshold dynamics and Reject risk' },
  { num: 4, slug: '04-parametric-methods', title: 'Chapter 4: Parametric Methods', concept: 'Bias-Variance Dilemma: Underfitting (order 1) vs Overfitting (order 6)' },
  { num: 6, slug: '06-dimensionality-reduction', title: 'Chapter 6: Dimensionality Reduction', concept: 'Principal Component Analysis (PCA) rotation and projection' },
  { num: 7, slug: '07-clustering', title: 'Chapter 7: Clustering', concept: 'k-Means centroid migration and Expectation-Maximization (EM) covariance' },
  { num: 9, slug: '09-decision-trees', title: 'Chapter 9: Decision Trees', concept: 'Recursive axis-aligned orthogonal space partitioning' },
  { num: 10, slug: '10-linear-discrimination', title: 'Chapter 10: Linear Discrimination', concept: 'Gradient descent weight updating and logistic sigmoid decision boundary' },
  { num: 11, slug: '11-multilayer-perceptrons', title: 'Chapter 11: Multilayer Perceptrons', concept: 'Forward activation flow and Backpropagation gradient propagation' },
  { num: 13, slug: '13-kernel-machines', title: 'Chapter 13: Kernel Machines & SVM', concept: 'Support Vectors, Maximum Margin Hyperplane corridor 2/||w||, and Slack variables' },
  { num: 18, slug: '18-reinforcement-learning', title: 'Chapter 18: Reinforcement Learning', concept: 'Grid world exploration vs exploitation and Bellman value iteration backups' },
];

export default function VisualsGalleryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
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
              <Sparkles className="h-6 w-6" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Visual Concept Animations
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Interactive, 60fps loopable canvas simulations modeling core mathematical mechanisms from Ethem Alpaydın&apos;s textbook. Each animation runs seamlessly in real-time.
          </p>
        </div>

        {/* Gallery items */}
        <div className="space-y-16">
          {VISUAL_CHAPTERS.map((item) => (
            <div
              key={item.num}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Interactive Demonstration
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                    {item.title}
                  </h2>
                </div>
                <Link
                  href={`/chapter/${item.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Read Chapter {item.num}</span>
                </Link>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.concept}
              </p>

              <div className="pt-2">
                <IllustrationDispatcher chapterNum={item.num} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
