import isIndex from '@/public/data/books/inferential-statistics/index.json';
import laIndex from '@/public/data/books/linear-algebra/index.json';
import vcIndex from '@/public/data/books/vector-calculus/index.json';
import probIndex from '@/public/data/books/probability/index.json';
import odeIndex from '@/public/data/books/differential-equations/index.json';
import gateDaIndex from '@/public/data/books/gate-da/index.json';

export type Block =
  | { t: 'p'; x: string }
  | { t: 'h'; level: number; x: string; id?: string }
  | { t: 'math'; x: string; tag?: string }
  | { t: 'box'; kind: string; name: string; num?: string; title?: string | null; blocks: Block[] }
  | { t: 'list'; ordered: boolean; style: string | null; desc: boolean; items: { label?: string; blocks: Block[] }[] }
  | { t: 'fig'; num: string | null; figs: number[]; srcs?: string[]; caption: string }
  | { t: 'table'; rows: string[][]; caption?: string }
  | { t: 'code'; x: string };

export interface BookSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface BookChapter {
  book: string;
  num: number;
  label: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  wordCount: number;
  readingTimeMin: number;
  intro: Block[];
  sections: BookSection[];
}

export interface BookChapterMeta {
  book: string;
  num: number;
  label: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  wordCount: number;
  readingTimeMin: number;
  sectionCount: number;
  sections: { id: string; title: string }[];
}

export interface BookIndex {
  id: string;
  title: string;
  subtitle: string;
  chapters: BookChapterMeta[];
  figureCount: number;
}

export const BOOK_INDEX: Record<string, BookIndex> = {
  'linear-algebra': laIndex as BookIndex,
  'inferential-statistics': isIndex as BookIndex,
  'vector-calculus': vcIndex as BookIndex,
  probability: probIndex as BookIndex,
  'differential-equations': odeIndex as BookIndex,
  'gate-da': gateDaIndex as BookIndex,
};

export function getBook(id: string): BookIndex | undefined {
  return BOOK_INDEX[id];
}

export function chapterNavLabel(ch: { label: string }) {
  return /^[A-Z]$/.test(ch.label) ? `Appendix ${ch.label}` : `Chapter ${ch.label}`;
}

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ', mu: 'μ',
  nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  nabla: '∇', infty: '∞', partial: '∂', cdot: '·', times: '×', to: '→', le: '≤', ge: '≥',
};

/** Readable plain text for places that cannot render math (search results). */
export function texToPlain(s: string): string {
  return s
    .replace(/\\([a-zA-Z]+)/g, (_, n: string) => GREEK[n] ?? '')
    .replace(/[$\\{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
