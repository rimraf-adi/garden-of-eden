'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CURRICULUM_PHASES,
  CurriculumModule,
  CurriculumPhase,
  getAllCurriculumModules
} from '@/lib/curriculum';
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
  GitBranch,
  Clock,
  CheckCircle2,
  Filter,
  ArrowDown
} from 'lucide-react';

export default function ModulesPage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [activeModule, setActiveModule] = useState<CurriculumModule>(
    CURRICULUM_PHASES[0].modules[0]
  );

  const allModules = getAllCurriculumModules();
  const totalHours = allModules.reduce((sum, m) => sum + m.estimatedHours, 0);

  const getLevelBadgeClass = (level: CurriculumModule['level']) => {
    switch (level) {
      case 'Foundational':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Core':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Advanced':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Mastery':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      {/* Header Banner */}
      <div className="border-b border-zinc-800 bg-[#0d1018] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/60 text-xs font-mono text-cyan-400">
                <span>* CHRONOLOGICAL_CURRICULUM</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300">MATH FIRST → AI FRONTIER</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                AI Engineering Modules
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
                A bottom-up, chronological curriculum spanning foundational pure mathematics,
                statistical learning theory, deep foundation models, hardware-aware GPU inference,
                and large-scale distributed systems.
              </p>
            </div>

            {/* Quick Metrics Capsule Strip */}
            <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs p-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-md">
              <div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-wider">Phases</div>
                <div className="text-lg font-bold text-white">06</div>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-wider">Modules</div>
                <div className="text-lg font-bold text-cyan-400">{allModules.length}</div>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-wider">Total Time</div>
                <div className="text-lg font-bold text-white">~{totalHours.toFixed(0)}h</div>
              </div>
            </div>
          </div>

          {/* Phase Filter Bar */}
          <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedPhase('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedPhase === 'ALL'
                  ? 'bg-white text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              All Phases
            </button>
            {CURRICULUM_PHASES.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? 'ALL' : phase.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedPhase === phase.id
                    ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <span>{phase.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Workspace: Chronological Phased Modules */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chronological Modules List (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {CURRICULUM_PHASES.filter(
              (phase) => selectedPhase === 'ALL' || selectedPhase === phase.id
            ).map((phase, pIdx) => (
              <div key={phase.id} className="space-y-4">
                {/* Phase Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {phase.code} · {phase.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    {phase.modules.length} Modules
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  {phase.description}
                </p>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {phase.modules.map((mod) => {
                    const isSelected = activeModule.id === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setActiveModule(mod)}
                        className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/60 shadow-lg'
                            : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs font-bold text-cyan-400">
                              MODULE {mod.num.toString().padStart(2, '0')}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getLevelBadgeClass(
                                mod.level
                              )}`}
                            >
                              {mod.level}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {mod.title}
                          </h3>

                          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {mod.tagline}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                          <span>~{mod.estimatedHours}h est.</span>
                          <span className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                            <span>Inspect</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Downward chronological arrow between phases */}
                {pIdx < CURRICULUM_PHASES.length - 1 && (
                  <div className="py-2 text-center text-zinc-700 flex items-center justify-center gap-2 font-mono text-[11px]">
                    <span className="h-px w-24 bg-zinc-800" />
                    <span className="flex items-center gap-1">
                      <ArrowDown className="h-3.5 w-3.5 text-zinc-600" />
                      <span>Progression</span>
                    </span>
                    <span className="h-px w-24 bg-zinc-800" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Module Deep-Dive Inspector (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-[#0d1018] p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                  MODULE {activeModule.num.toString().padStart(2, '0')}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getLevelBadgeClass(
                    activeModule.level
                  )}`}
                >
                  {activeModule.level}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] text-zinc-500 block mb-1">
                  {activeModule.phaseName}
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {activeModule.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeModule.tagline}
                </p>
              </div>

              {/* Prerequisites Flow */}
              <div className="pt-3 border-t border-zinc-800">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Prerequisites
                </span>
                {activeModule.prerequisites.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono italic">
                    None (Entrypoint Foundation)
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {activeModule.prerequisites.map((prereqId) => (
                      <span
                        key={prereqId}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                      >
                        {prereqId}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Mathematical Formulations */}
              <div className="pt-3 border-t border-zinc-800">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Core Formulations
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {activeModule.coreEquations.map((eq, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-zinc-950 border border-zinc-800 text-cyan-300 text-[11px]"
                    >
                      <code>{eq}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Concepts */}
              <div className="pt-3 border-t border-zinc-800">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Key Concepts
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {activeModule.keyConcepts.map((concept, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href={activeModule.href}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Open Module</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
