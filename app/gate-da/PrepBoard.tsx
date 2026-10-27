'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Topic = {
  id: string; section: string; topic: string; status: 'covered' | 'partial' | 'missing';
  chapters: { num: number; slug: string; title: string; min: number }[];
  marks: Record<string, number>; totalMarks: number; questions: number; yearsAsked: number; trend: string; pyq: string[];
};
type Level = 0 | 1 | 2 | 3; // not started, learning, practised, confident
const LEVELS = ['Not started', 'Learning', 'Practised', 'Confident'];
const KEY = 'gate-da-prep-v1';
const statusStyle = { covered: 'text-emerald-700 dark:text-emerald-300', partial: 'text-amber-700 dark:text-amber-300', missing: 'text-rose-700 dark:text-rose-300' };
const statusLabel = { covered: 'Notes: covered', partial: 'Notes: thin', missing: 'Notes: missing' };

export default function PrepBoard({ topics }: { topics: Topic[] }) {
  const [progress, setProgress] = useState<Record<string, Level>>({});
  const [section, setSection] = useState('All');
  const [view, setView] = useState<'all' | 'gaps' | 'todo'>('all');
  const [sort, setSort] = useState<'syllabus' | 'priority'>('priority');

  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v) setProgress(JSON.parse(v)); } catch {}
  }, []);
  const setLevel = (id: string, l: Level) => setProgress((p) => {
    const n = { ...p, [id]: l };
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
    return n;
  });

  const sections = useMemo(() => ['All', ...new Set(topics.map((t) => t.section))], [topics]);
  const avg = (t: Topic) => t.totalMarks / 3;
  const totalAvg = topics.reduce((a, t) => a + avg(t), 0);
  const ready = topics.reduce((a, t) => a + avg(t) * ((progress[t.id] ?? 0) / 3), 0);
  const shown = topics
    .filter((t) => (section === 'All' || t.section === section) && (view === 'all' || (view === 'gaps' ? t.status !== 'covered' : (progress[t.id] ?? 0) < 3)))
    .sort((a, b) => (sort === 'priority' ? b.totalMarks - a.totalMarks || a.id.localeCompare(b.id, undefined, { numeric: true }) : 0));
  const sectionStats = sections.slice(1).map((s) => {
    const ts = topics.filter((t) => t.section === s);
    const tot = ts.reduce((a, t) => a + avg(t), 0) || 1;
    return { s, pct: Math.round((ts.reduce((a, t) => a + avg(t) * ((progress[t.id] ?? 0) / 3), 0) / tot) * 100) };
  });

  return (
    <div>
      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl">Your readiness</h2>
          <span className="font-mono text-sm">{((ready / totalAvg) * 100).toFixed(0)}% of mark-weighted syllabus</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-white/10"><div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${(ready / totalAvg) * 100}%` }} /></div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-xs">
          {sectionStats.map((x) => (
            <button key={x.s} onClick={() => setSection(x.s)} className="flex items-center justify-between gap-2 text-left hover:text-amber-700 dark:hover:text-amber-300">
              <span className="truncate">{x.s}</span><span className="font-mono">{x.pct}%</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">Weight = average marks a topic carried per paper in 2024–26. Progress is saved in this browser only.</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <select value={section} onChange={(e) => setSection(e.target.value)} className="rounded-lg border border-zinc-300 dark:border-white/15 bg-transparent px-2 py-1.5">
          {sections.map((s) => <option key={s} className="text-zinc-900">{s}</option>)}
        </select>
        {([['all', 'All topics'], ['gaps', 'Gaps in my notes'], ['todo', 'Not yet confident']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} className={`rounded-full border px-3 py-1 ${view === v ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-200 dark:border-white/10'}`}>{l}</button>
        ))}
        <button onClick={() => setSort(sort === 'priority' ? 'syllabus' : 'priority')} className="ml-auto rounded-full border border-zinc-200 dark:border-white/10 px-3 py-1">
          Sort: {sort === 'priority' ? 'marks, high first' : 'syllabus order'}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {shown.map((t) => {
          const lvl = (progress[t.id] ?? 0) as Level;
          return (
            <li key={t.id} className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{t.topic}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.section}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span className={statusStyle[t.status]}>{statusLabel[t.status]}</span>
                  <span className="rounded border border-zinc-200 dark:border-white/10 px-1.5 py-0.5">{t.trend}</span>
                  <span title="marks 2024 / 2025 / 2026">{t.marks['2024']}·{t.marks['2025']}·{t.marks['2026']}M</span>
                  <span>{t.questions} Qs</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {t.chapters.length ? t.chapters.map((c) => (
                    <Link key={c.slug} href={`/books/gate-da/${c.slug}`} className="rounded-md border border-zinc-200 dark:border-white/10 px-2 py-0.5 hover:border-amber-500">Ch {c.num} · {c.title} · {c.min}m</Link>
                  )) : <span className="text-rose-700 dark:text-rose-300">No chapter in the notes yet</span>}
                </div>
                <div className="flex gap-1" role="group" aria-label={`Progress for ${t.topic}`}>
                  {LEVELS.map((l, i) => (
                    <button key={l} onClick={() => setLevel(t.id, i as Level)} aria-pressed={lvl === i}
                      className={`rounded-md border px-2 py-0.5 text-[11px] ${lvl === i ? 'border-amber-500 bg-amber-500/15' : 'border-zinc-200 dark:border-white/10 text-zinc-500'}`}>{l}</button>
                  ))}
                </div>
              </div>
              {t.pyq.length > 0 && (
                <details className="mt-2 text-xs text-zinc-500">
                  <summary className="cursor-pointer">PYQs ({t.pyq.length}) · asked in {t.yearsAsked} of 3 papers</summary>
                  <p className="mt-1 font-mono">{t.pyq.join(' · ')} — see the <Link href="/gate-da/pyq-bank" className="underline">question bank</Link></p>
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
