'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CONCEPT_NODES, LEARNING_TRACKS, ConceptNode, getTrackById } from '@/lib/curriculum';
import {
  Compass,
  ArrowRight,
  GitBranch,
  Layers,
  Sparkles,
  BookOpen,
  Beaker,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface TopologyGraphProps {
  selectedTrackId?: string | null;
}

export default function TopologyGraph({ selectedTrackId }: TopologyGraphProps) {
  const [activeNode, setActiveNode] = useState<ConceptNode>(CONCEPT_NODES[0]);
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filteredNodes = CONCEPT_NODES.filter((node) => {
    if (selectedTrackId && node.trackId !== selectedTrackId) return false;
    if (levelFilter !== 'ALL' && node.level !== levelFilter) return false;
    return true;
  });

  const activeTrack = getTrackById(activeNode.trackId);

  const getLevelBadgeClass = (level: ConceptNode['level']) => {
    switch (level) {
      case 'Foundational':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Core':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'Advanced':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Mastery':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left/Main DAG Graph Panel */}
      <div className="lg:col-span-8 space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">DIFFICULTY FILTER:</span>
            <div className="flex items-center gap-1">
              {['ALL', 'Foundational', 'Core', 'Advanced', 'Mastery'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    levelFilter === lvl
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            Displaying <span className="font-bold text-zinc-900 dark:text-zinc-100">{filteredNodes.length}</span> / 19 nodes
          </div>
        </div>

        {/* Nodes Grid by Tracks */}
        <div className="space-y-4">
          {LEARNING_TRACKS.map((track) => {
            const trackNodes = filteredNodes.filter((n) => n.trackId === track.id);
            if (trackNodes.length === 0) return null;

            return (
              <div
                key={track.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {track.code} :: {track.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {trackNodes.length} {trackNodes.length === 1 ? 'module' : 'modules'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {trackNodes.map((node) => {
                    const isSelected = activeNode.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setActiveNode(node)}
                        className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-md'
                            : 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                              CH.{node.chapterNum.toString().padStart(2, '0')}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${getLevelBadgeClass(
                                node.level
                              )}`}
                            >
                              {node.level}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">
                            {node.title}
                          </h4>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {node.tagline}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                          <span>{node.estimatedHours}h est.</span>
                          {node.workbenchAvailable && (
                            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                              <Beaker className="h-3 w-3" /> Lab
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Concept Node Deep Inspector */}
      <div className="lg:col-span-4 sticky top-24 space-y-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl shadow-zinc-900/5">
          {/* Header pill */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: activeTrack?.color || '#6366f1' }}
              />
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {activeTrack?.code} · {activeTrack?.name}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getLevelBadgeClass(
                activeNode.level
              )}`}
            >
              {activeNode.level}
            </span>
          </div>

          {/* Title and Summary */}
          <div className="mt-4">
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Chapter {activeNode.chapterNum}
            </span>
            <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {activeNode.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {activeNode.tagline}
            </p>
          </div>

          {/* Prerequisite Flow */}
          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              <GitBranch className="h-3.5 w-3.5 text-indigo-500" />
              <span>Prerequisites & Precedents</span>
            </div>
            {activeNode.prerequisites.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">None (Foundational Entrypoint)</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {activeNode.prerequisites.map((prereqId) => {
                  const prereq = CONCEPT_NODES.find((n) => n.id === prereqId);
                  return (
                    <button
                      key={prereqId}
                      onClick={() => prereq && setActiveNode(prereq)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span>Ch.{prereq ? prereq.chapterNum : prereqId}</span>
                      <ArrowRight className="h-3 w-3 opacity-60" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Key Algorithms */}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Core Algorithms</span>
            </div>
            <ul className="space-y-1.5">
              {activeNode.keyAlgorithms.map((algo) => (
                <li
                  key={algo}
                  className="text-xs text-zinc-700 dark:text-zinc-300 font-mono flex items-center gap-2"
                >
                  <span className="h-1 w-1 rounded-full bg-zinc-400" />
                  <span>{algo}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Equations */}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Key Mathematical Formulas</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {activeNode.coreEquations.map((eq) => (
                <span
                  key={eq}
                  className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px]"
                >
                  Eq. {eq}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <Link
              href={`/chapter/${activeNode.slug}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Full Chapter</span>
            </Link>

            <Link
              href={`/workbench`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
            >
              <Beaker className="h-3.5 w-3.5 text-indigo-500" />
              <span>Launch Interactive Workbench</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
