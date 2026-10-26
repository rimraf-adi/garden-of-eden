'use client';

interface SliderProps {
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  format?: (val: number) => string;
  description?: string;
}

export function ParameterSlider({
  label,
  symbol,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toString(),
  description,
}: SliderProps) {
  return (
    <div className="space-y-1.5 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
          {symbol && (
            <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              ({symbol})
            </span>
          )}
        </div>
        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
          {format(value)}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
      />

      {description && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
          {description}
        </p>
      )}
    </div>
  );
}
