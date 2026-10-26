import fs from 'fs';
import path from 'path';
import type { BookChapter } from './books';

const root = (book: string) => path.join(process.cwd(), 'public', 'data', 'books', book);

export function getBookChapter(book: string, slug: string): BookChapter | null {
  try {
    const file = path.join(root(book), 'chapters', `${slug}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as BookChapter;
  } catch {
    return null;
  }
}

export function getBookTex(book: string, slug: string): string {
  try {
    const file = path.join(root(book), 'tex', `${slug}.tex`);
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf-8');
  } catch {}
  return '% LaTeX source not available';
}
