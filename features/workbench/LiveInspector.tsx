'use client';

import { Activity, Gauge, Terminal } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'neutral' | 'good' | 'bad';
}

interface LiveInspectorProps {
  status: 'IDLE' | 'TRAINING' | 'CONVERGED';
  metrics: MetricItem[];
  equationHint?: string;
  logs?: string[];
}

export function LiveInspector({ status, metrics, equationHint, logs }: LiveInspectorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'TRAINING':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30 animate-pulse';
      case 'CONVERGED':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      default:
        return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30';
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-500" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            TELEMETRY_ENGINE
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-widest ${getStatusColor()}`}
        >
          {status}
        </span>
      </div>

      {/* Numerical Metrics Matrix */}
      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/40"
          >
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{m.label}</div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {m.value}
            </div>
            {m.subtext && <div className="text-[10px] text-zinc-500 mt-0.5">{m.subtext}</div>}
          </div>
        ))}
      </div>

      {/* Active Governing Equation Reference */}
      {equationHint && (
        <div className="p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-[11px] text-amber-900 dark:text-amber-300">
          <span className="font-bold block text-[10px] text-amber-500 uppercase tracking-wider mb-1">
            Governing Equation:
          </span>
          <code className="text-zinc-800 dark:text-zinc-200">{equationHint}</code>
        </div>
      )}

      {/* Execution Log stream */}
      {logs && logs.length > 0 && (
        <div className="p-2.5 rounded-lg bg-zinc-950 text-zinc-300 font-mono text-[10px] space-y-1 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-zinc-500 border-b border-zinc-800 pb-1 mb-1">
            <Terminal className="h-3 w-3" />
            <span>EVENT_LOG</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="text-zinc-400">
              <span className="text-zinc-600">&gt;</span> {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
