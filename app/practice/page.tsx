'use client';

import { useState, useEffect } from 'react';
import { PRACTICE_EXERCISES, PracticeExercise } from '@/lib/practiceData';
import ExerciseDrill from '@/features/practice/ExerciseDrill';
import { Target, Search, CheckCircle2, Filter, Sparkles, BookOpen } from 'lucide-react';

export default function PracticePage() {
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mastered_exercises');
      if (saved) setMasteredIds(JSON.parse(saved));
    } catch (e) {
      // ignore localstorage errors
    }
  }, []);

  const toggleMastery = (id: string) => {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('mastered_exercises', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const filteredExercises = PRACTICE_EXERCISES.filter((ex) => {
    if (selectedDifficulty !== 'ALL' && ex.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'ALL' && ex.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.question.toLowerCase().includes(q) ||
        ex.chapterTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_55%)]">
      {/* Engineering Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <Target className="h-3.5 w-3.5" />
                <span>DRILLS :: DELIBERATE_PRACTICE_SYSTEM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Deliberate Practice & Analytical Drills
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                Step-by-step mathematical derivations, algorithmic edge cases, sample complexity calculations, and proofs
                modeled directly on Alpaydın&apos;s textbook exercises.
              </p>
            </div>

            {/* Mastery Score Progress */}
            <div className="flex items-center gap-4 font-mono text-xs p-3.5 rounded-xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm">
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Mastered</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {masteredIds.length} / {PRACTICE_EXERCISES.length}
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Completion</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {Math.round((masteredIds.length / PRACTICE_EXERCISES.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty selector */}
              <div className="flex items-center gap-1 font-mono text-xs">
                {['ALL', 'Warmup', 'Intermediate', 'Advanced', 'Rigorous'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />

              {/* Category selector */}
              <div className="flex items-center gap-1 font-mono text-xs">
                {['ALL', 'Derivation', 'Numerical', 'Algorithmic', 'Conceptual'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search drills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Drills List */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredExercises.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 font-mono text-sm border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
              No practice drills match your active filter criteria.
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <ExerciseDrill
                key={exercise.id}
                exercise={exercise}
                isMastered={masteredIds.includes(exercise.id)}
                onToggleMastery={() => toggleMastery(exercise.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
