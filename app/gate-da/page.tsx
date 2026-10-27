import type { Metadata } from 'next';
import Link from 'next/link';
import map from '@/modules/gate-da/data/syllabus-map.json';
import PrepBoard from './PrepBoard';

export const metadata: Metadata = {
  title: 'GATE DA Prep Board — Garden of Eden',
  description: 'The official GATE DA syllabus mapped to notes chapters, previous-year questions and 2024–26 trends, with progress tracking.',
};

export default function GateDaHome() {
  const topics = map.topics as React.ComponentProps<typeof PrepBoard>['topics'];
  const missing = topics.filter((t) => t.status === 'missing');
  const thin = topics.filter((t) => t.status === 'partial');
  const heavyGaps = [...missing, ...thin].filter((t) => t.totalMarks > 0).sort((a, b) => b.totalMarks - a.totalMarks).slice(0, 6);
  const thinChapters = map.chapters.filter((c) => c.min <= 2 && c.pyqMarks > 0).sort((a, b) => b.pyqMarks - a.pyqMarks);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300">GATE DA · prep board</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight">Syllabus → notes → PYQs → trend</h1>
        <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-400">
          Every topic in the official syllabus ({map.syllabus}), matched to the chapters that teach it and the 195 questions asked in 2024–26.
          Source PDFs: <a className="underline" href="/gate-da/DA_GATE2027_Syllabus.pdf">GATE 2027 DA</a> · <a className="underline" href="/gate-da/DA_GATE2026_Syllabus.pdf">GATE 2026 DA</a>.
          Also: <Link className="underline" href="/gate-da/pyq-analysis">pattern analysis</Link> · <Link className="underline" href="/gate-da/pyq-bank">question bank</Link> · <Link className="underline" href="/paths/gate-da">all notes</Link>.
        </p>
      </header>

      <section className="rounded-2xl border border-rose-300/50 dark:border-rose-400/20 bg-rose-50/40 dark:bg-rose-950/10 p-5">
        <h2 className="font-serif text-xl">What the notes are missing</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Of {topics.length} syllabus topics, {missing.length} have no matching section in the notes and {thin.length} are only touched in passing. Biggest holes by marks asked in 2024–26:
        </p>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
          {heavyGaps.map((t) => (
            <li key={t.id} className="rounded-lg border border-zinc-200 dark:border-white/10 px-3 py-2">
              <span className="font-medium">{t.topic}</span>
              <span className="block font-mono text-xs text-zinc-500">{t.section} · {t.totalMarks}M over 3 papers · {t.status === 'missing' ? 'no notes' : 'thin notes'} · {t.trend}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-4 text-sm space-y-1.5 list-disc pl-5 text-zinc-600 dark:text-zinc-400">
          <li><b>Artificial Intelligence</b> (about 10M a paper) has no chapters at all: search, logic and Bayesian networks need writing.</li>
          <li><b>General Aptitude</b> (a fixed 15M) has no chapters or practice: verbal, quantitative, analytical, spatial.</li>
          {thinChapters.length > 0 && <li>One- and two-minute chapters carrying PYQ marks: {thinChapters.map((c) => `Ch ${c.num} ${c.title} (${c.pyqMarks}M)`).join(', ')}.</li>}
          <li>Asked in 2026 but not named in the syllabus: {map.unmapped.map((u) => `${u.id} ${u.topic}`).join('; ')}.</li>
        </ul>
      </section>

      <PrepBoard topics={topics} />
    </main>
  );
}
