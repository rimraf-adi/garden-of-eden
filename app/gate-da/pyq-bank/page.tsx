import type { Metadata } from 'next';
import Link from 'next/link';
import bank from '@/modules/gate-da/data/pyq-bank.json';

export const metadata: Metadata = {
  title: 'GATE DA Topic-wise PYQ Bank — Garden of Eden',
  description: 'All 195 GATE DA questions from 2024–2026 grouped by subject, area and topic, with year, type, marks and official key.',
};

type Q = (typeof bank.questions)[number];

export default function PyqBankPage() {
  const bySubject = bank.subjects.map((subject) => {
    const qs = bank.questions.filter((q) => q.subject === subject);
    const areas = [...new Set(qs.map((q) => q.area))].map((area) => {
      const aq = qs.filter((q) => q.area === area);
      const topics = [...new Set(aq.map((q) => q.topic))].map((topic) => ({ topic, qs: aq.filter((q) => q.topic === topic) }));
      return { area, count: aq.length, marks: aq.reduce((a, q) => a + q.marks, 0), topics };
    }).sort((a, b) => b.marks - a.marks);
    return { subject, count: qs.length, marks: qs.reduce((a, q) => a + q.marks, 0), areas };
  });
  const chip = (q: Q) => (
    <span key={q.id} title={`${q.id} · ${q.type} · ${q.marks}M · key ${q.key}`} className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-white/10 px-1.5 py-0.5 font-mono text-[11px]">
      {q.year} · {q.type} · {q.marks}M · <span className="text-amber-700 dark:text-amber-300">{q.key}</span>
    </span>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <p className="font-mono text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300">GATE DA · PYQ bank</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight">Topic-wise previous-year questions</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        All {bank.questions.length} questions from 2024–2026 grouped by subject, area and topic, heaviest areas first. Each tag is year · type · marks · official answer key
        (NAT keys are accepted ranges). Question IDs follow the PYQ book (e.g. Q1.26.19 = chapter 1, 2026, question 19). See also the{' '}
        <Link href="/gate-da/pyq-analysis" className="underline underline-offset-2">pattern analysis</Link>.
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {bySubject.map((s, i) => <a key={s.subject} href={`#s${i}`} className="rounded-full border border-zinc-200 dark:border-white/10 px-3 py-1 hover:border-amber-500">{s.subject} · {s.marks}M</a>)}
      </nav>
      <div className="mt-10 space-y-12">
        {bySubject.map((s, i) => (
          <section key={s.subject} id={`s${i}`} className="scroll-mt-24">
            <h2 className="text-2xl font-serif">{s.subject}</h2>
            <p className="text-sm text-zinc-500">{s.count} questions · {s.marks} marks across three papers</p>
            <div className="mt-4 space-y-3">
              {s.areas.map((a) => (
                <details key={a.area} open={a === s.areas[0]} className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4">
                  <summary className="cursor-pointer font-medium">{a.area} <span className="ml-2 font-mono text-xs text-zinc-500">{a.count} Qs · {a.marks}M</span></summary>
                  <ul className="mt-3 space-y-2.5">
                    {a.topics.map((t) => (
                      <li key={t.topic} className="text-sm">
                        <p>{t.topic}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">{t.qs.map((q) => chip(q))}</div>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
