'use client';

import { useState, useEffect } from 'react';
import { PracticeExercise } from '@/lib/practiceData';
import FormattedContent from '@/components/FormattedContent';
import {
  HelpCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface ExerciseDrillProps {
  exercise: PracticeExercise;
  isMastered?: boolean;
  onToggleMastery?: () => void;
}

export default function ExerciseDrill({
  exercise,
  isMastered = false,
  onToggleMastery,
}: ExerciseDrillProps) {
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);

  const getDifficultyBadge = (diff: PracticeExercise['difficulty']) => {
    switch (diff) {
      case 'Warmup':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'Advanced':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Rigorous':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
  };

  const getCategoryBadge = (cat: PracticeExercise['category']) => {
    switch (cat) {
      case 'Derivation':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Numerical':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Algorithmic':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Conceptual':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all p-6 ${
        isMastered
          ? 'border-emerald-500/40 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.05] shadow-sm'
          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/chapter/0${exercise.chapterNum}`}
            className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hover:underline"
          >
            Ch.{exercise.chapterNum.toString().padStart(2, '0')} · {exercise.chapterTitle}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span
            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getCategoryBadge(
              exercise.category
            )}`}
          >
            {exercise.category}
          </span>
          <span
            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getDifficultyBadge(
              exercise.difficulty
            )}`}
          >
            {exercise.difficulty}
          </span>
        </div>

        <button
          onClick={onToggleMastery}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
            isMastered
              ? 'bg-emerald-600 text-white font-bold'
              : 'border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <CheckCircle className={`h-3.5 w-3.5 ${isMastered ? 'text-white' : 'text-zinc-400'}`} />
          <span>{isMastered ? 'Mastered' : 'Mark as Done'}</span>
        </button>
      </div>

      {/* Drill Title */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {exercise.title}
        </h3>
      </div>

      {/* Question Formatted Body */}
      <div className="mt-3 prose prose-zinc dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <FormattedContent content={exercise.question} />
      </div>

      {/* Hints System */}
      {exercise.hints.length > 0 && (
        <div className="mt-5 space-y-2">
          {exercise.hints.slice(0, revealedHints).map((hint, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-300"
            >
              <span className="font-mono font-bold block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                Hint #{idx + 1}:
              </span>
              <FormattedContent content={hint} />
            </div>
          ))}

          {revealedHints < exercise.hints.length && (
            <button
              onClick={() => setRevealedHints((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>
                Reveal Hint {revealedHints + 1} of {exercise.hints.length}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Solution Section */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
        >
          {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-indigo-500" />}
          <span>{showSolution ? 'Hide Complete Derivation' : 'Reveal Step-by-Step Derivation'}</span>
        </button>

        {showSolution && (
          <div className="mt-4 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/50">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Rigorous Analytical Solution</span>
              </span>
              {exercise.equationRef && (
                <span className="font-mono text-[11px] text-zinc-500">
                  Ref: Eq. {exercise.equationRef}
                </span>
              )}
            </div>
            <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              <FormattedContent content={exercise.solution} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
