import MathText, { texHtml } from '@/components/book/MathText';
import FitMath from './FitMath';
import type { Block } from '@/lib/books';

function Inline({ x, className }: { x: string; className?: string }) {
  return <MathText x={x} className={className} />;
}

const BOX_STYLES: Record<string, { frame: string; label: string }> = {
  theorem: { frame: 'border-sky-500/70 bg-sky-50/70 dark:bg-sky-950/20', label: 'text-sky-700 dark:text-sky-300' },
  definition: { frame: 'border-zinc-500/60 bg-zinc-100/70 dark:bg-zinc-800/40', label: 'text-zinc-700 dark:text-zinc-300' },
  example: { frame: 'border-emerald-500/70 bg-emerald-50/60 dark:bg-emerald-950/20', label: 'text-emerald-700 dark:text-emerald-300' },
  intuition: { frame: 'border-emerald-500/70 bg-emerald-50/60 dark:bg-emerald-950/20', label: 'text-emerald-700 dark:text-emerald-300' },
  pitfall: { frame: 'border-rose-500/70 bg-rose-50/70 dark:bg-rose-950/20', label: 'text-rose-700 dark:text-rose-300' },
  interview: { frame: 'border-amber-500/70 bg-amber-50/70 dark:bg-amber-950/20', label: 'text-amber-700 dark:text-amber-300' },
  nuance: { frame: 'border-orange-500/70 bg-orange-50/70 dark:bg-orange-950/20', label: 'text-orange-700 dark:text-orange-300' },
  summary: { frame: 'border-zinc-700/70 bg-zinc-100/80 dark:bg-zinc-800/50', label: 'text-zinc-800 dark:text-zinc-200' },
  exercise: { frame: 'border-amber-600/70 bg-white/70 dark:bg-zinc-900/40', label: 'text-amber-700 dark:text-amber-300' },
};
const KIND_ALIAS: Record<string, string> = {
  lemma: 'theorem', proposition: 'theorem', corollary: 'theorem', remark: 'definition',
  key: 'interview', method: 'nuance', worked: 'example', derivation: 'definition',
  watch: 'pitfall', formulas: 'theorem', practice: 'exercise', answers: 'summary',
};

function Box({ b, figBook }: { b: Extract<Block, { t: 'box' }>; figBook: string }) {
  const body = b.blocks.map((c, i) => <BlockView key={i} b={c} book={figBook} />);
  if (b.kind === 'proof') {
    return (
      <div className="my-6 border-l-2 border-zinc-300 dark:border-zinc-700 pl-5 space-y-4">
        <div className="space-y-4">
          <span className="font-serif italic font-semibold text-zinc-700 dark:text-zinc-300">
            {b.title ? <Inline x={b.title} /> : 'Proof'}.{' '}
          </span>
          {body}
          <div className="text-right text-zinc-400" aria-hidden>∎</div>
        </div>
      </div>
    );
  }
  const style = BOX_STYLES[b.kind] ?? BOX_STYLES[KIND_ALIAS[b.kind] ?? 'definition'];
  const label = [b.name, b.num].filter(Boolean).join(' ');
  return (
    <div className={`my-7 rounded-2xl border border-l-4 p-5 sm:p-7 space-y-5 shadow-sm backdrop-blur-sm ${style.frame}`}>
      <div className={`flex flex-wrap items-baseline gap-x-2 font-mono text-xs font-bold uppercase tracking-wider ${style.label}`}>
        <span>{label}</span>
        {b.title && (
          <span className="normal-case tracking-normal font-serif font-semibold text-sm text-zinc-800 dark:text-zinc-200">
            <Inline x={b.title} />
          </span>
        )}
      </div>
      {body}
    </div>
  );
}

export function BlockView({ b, book }: { b: Block; book: string }) {
  switch (b.t) {
    case 'p':
      return <p className="leading-relaxed"><Inline x={b.x} /></p>;
    case 'h':
      return b.level === 3 ? (
        <h3 id={b.id ? `sub-${b.id}` : undefined} className="scroll-mt-28 pt-6 font-serif text-xl sm:text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 flex items-baseline gap-2.5">
          {b.id && <span className="font-mono text-base text-amber-600 dark:text-amber-400">{b.id}</span>}
          <Inline x={b.x} />
        </h3>
      ) : (
        <h4 className="pt-2 font-serif text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          <Inline x={b.x} />
        </h4>
      );
    case 'math': {
      const html = texHtml(b.x, true);
      return (
        <div className="my-5 flex items-center justify-between gap-4 overflow-x-auto rounded-2xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 px-5 py-3 shadow-sm">
          <FitMath html={html} />
          {b.tag && (
            <span className="shrink-0 font-mono text-xs font-bold text-amber-700 dark:text-amber-400">({b.tag})</span>
          )}
        </div>
      );
    }
    case 'box':
      return <Box b={b} figBook={book} />;
    case 'list': {
      const style = b.style === 'a' ? 'lower-alpha' : b.style === 'i' ? 'lower-roman' : b.ordered ? 'decimal' : 'disc';
      if (b.desc) {
        return (
          <dl className="space-y-3">
            {b.items.map((it, i) => (
              <div key={i}>
                {it.label && <dt className="font-semibold"><Inline x={it.label} /></dt>}
                <dd className="space-y-2 pl-4">{it.blocks.map((c, j) => <BlockView key={j} b={c} book={book} />)}</dd>
              </div>
            ))}
          </dl>
        );
      }
      const Tag = b.ordered ? 'ol' : 'ul';
      return (
        <Tag className="space-y-3.5 pl-7 marker:text-amber-600 dark:marker:text-amber-400" style={{ listStyleType: style }}>
          {b.items.map((it, i) => (
            <li key={i} className="pl-1 space-y-3">
              {it.blocks.map((c, j) => <BlockView key={j} b={c} book={book} />)}
            </li>
          ))}
        </Tag>
      );
    }
    case 'fig':
      return (
        <figure className="my-8 rounded-3xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {(b.srcs ?? b.figs.map((n) => `/books/${book}/fig-${n}.svg`)).map((src) => <img key={src} src={src} alt={b.caption ? b.caption.replace(/<[^>]+>|\$/g, '') : 'Figure'} className="max-h-[420px] max-w-full h-auto" loading="lazy" />)}
          </div>
          {(b.caption || b.num) && (
            <figcaption className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              {b.num && <span className="font-mono font-bold text-amber-700 dark:text-amber-400">Figure {b.num}. </span>}
              <Inline x={b.caption} />
            </figcaption>
          )}
        </figure>
      );
    case 'table':
      return (
        <div className="my-6 overflow-x-auto rounded-2xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40">
          <table className="w-full text-xs sm:text-sm">
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className={i === 0 ? 'bg-amber-50/70 dark:bg-amber-950/20 font-semibold' : 'border-t border-zinc-200/70 dark:border-white/10'}>
                  {r.map((c, j) => <td key={j} className="px-1.5 py-2 align-top sm:px-4 sm:py-2.5"><Inline x={c} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
          {b.caption && <div className="px-4 py-2 text-xs text-zinc-500"><Inline x={b.caption} /></div>}
        </div>
      );
    case 'code':
      return <pre className="my-4 overflow-x-auto rounded-2xl bg-zinc-950 p-5 font-mono text-xs text-zinc-200">{b.x}</pre>;
  }
}

export default function BlockList({ blocks, book }: { blocks: Block[]; book: string }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => <BlockView key={i} b={b} book={book} />)}
    </div>
  );
}
