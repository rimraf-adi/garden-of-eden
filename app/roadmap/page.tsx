'use client';

import { useState } from 'react';
import { LEARNING_TRACKS, CONCEPT_NODES } from '@/lib/curriculum';
import TrackCard from '@/features/roadmap/TrackCard';
import TopologyGraph from '@/features/roadmap/TopologyGraph';
import { Compass, GitMerge, BookOpen, Clock, Activity, Sparkles, LayoutGrid, Network } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'matrix'>('graph');

  const totalHours = CONCEPT_NODES.reduce((sum, n) => sum + n.estimatedHours, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Engineering Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>TOPOLOGY :: PREREQUISITE_DIRECTED_ACYCLIC_GRAPH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Machine Learning Concept Architecture
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                Structured pedagogical progression across all 19 chapters of Ethem Alpaydın&apos;s treatise.
                Navigate foundational prerequisite pathways, algorithmic hierarchies, and theoretical dependencies.
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Tracks</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">07</div>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Chapters</div>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">19</div>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Est. Time</div>
                <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">~{totalHours.toFixed(0)}h</div>
              </div>
            </div>
          </div>

          {/* Track Pills & Mode Toggle */}
          <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedTrackId(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedTrackId === null
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                All Tracks
              </button>
              {LEARNING_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrackId(selectedTrackId === t.id ? null : t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedTrackId === t.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.code}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 text-xs font-mono">
              <button
                onClick={() => setViewMode('graph')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Network className="h-3.5 w-3.5" />
                <span>Topology DAG</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'matrix'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Track Matrix</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {viewMode === 'graph' ? (
          <TopologyGraph selectedTrackId={selectedTrackId} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_TRACKS.filter((t) => !selectedTrackId || t.id === selectedTrackId).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={selectedTrackId === track.id}
                onSelect={() => setSelectedTrackId(track.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
