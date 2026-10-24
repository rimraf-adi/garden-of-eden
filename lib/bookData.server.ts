import fs from 'fs';
import path from 'path';
import { ChapterDetail } from './bookData';

export function getChapterBySlug(slug: string): ChapterDetail | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'chapters', `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as ChapterDetail;
  } catch (e) {
    console.error(`Error loading chapter ${slug}:`, e);
    return null;
  }
}

export function getChapterRawLatex(slug: string): string {
  try {
    const texPath = path.join(process.cwd(), 'intro-to-ml', 'chapters', `${slug}.tex`);
    if (fs.existsSync(texPath)) {
      return fs.readFileSync(texPath, 'utf-8');
    }
  } catch (e) {
    console.error(`Error loading latex for ${slug}:`, e);
  }
  return '% LaTeX source not available';
}
