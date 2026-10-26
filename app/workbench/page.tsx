import { Suspense } from 'react';
import WorkbenchView from '@/features/workbench/WorkbenchView';
import { Beaker } from 'lucide-react';

export default function WorkbenchPage() {
  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_55%)]">
      {/* Engineering Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <Beaker className="h-3.5 w-3.5" />
                <span>LABORATORY :: INTERACTIVE_SIMULATION_WORKBENCH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Machine Learning Simulation Workbench
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
                Live numerical playground for exploring algorithmic behavior, loss topologies, regularization dynamics,
                and hyperparameter responses in real-time without running separate Python scripts.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs p-3 rounded-xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm">
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Engine</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">ACTIVE</div>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Telemetry</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">REALTIME</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workbench Viewport */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<div className="p-12 text-center text-zinc-400 font-mono">Loading Workbench Engine...</div>}>
          <WorkbenchView />
        </Suspense>
      </main>
    </div>
  );
}
