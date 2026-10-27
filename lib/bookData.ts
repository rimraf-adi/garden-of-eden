import chaptersIndexRaw from '@/modules/intro-to-ml/data/chapters-index.json';
import bookMetaRaw from '@/modules/intro-to-ml/data/book-meta.json';
import notationsRaw from '@/modules/intro-to-ml/data/notations.json';
import frontmatterRaw from '@/modules/intro-to-ml/data/frontmatter.json';
import appendixRaw from '@/modules/intro-to-ml/data/appendix.json';

export interface Subsection {
  id: string;
  title: string;
  content: string;
}

export interface Section {
  id: string;
  title: string;
  intro: string;
  subsections: Subsection[];
}

export interface ChapterDetail {
  num: number;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  pages: string;
  pdfPages: string;
  summary: string;
  wordCount: number;
  readingTimeMin: number;
  sections: Section[];
  exercises: string[];
  references: string[];
  intro: string;
}

export interface ChapterMeta {
  num: number;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  pages: string;
  pdfPages: string;
  summary: string;
  wordCount: number;
  readingTimeMin: number;
  sectionCount: number;
  sections: { id: string; title: string; subsectionCount: number }[];
  exerciseCount: number;
  referenceCount: number;
}

export const bookMeta = bookMetaRaw;
export const chaptersIndex: ChapterMeta[] = chaptersIndexRaw as ChapterMeta[];
export const notations = notationsRaw as { symbol: string; meaning: string }[];
export const frontmatter = frontmatterRaw as {
  seriesForeword: string;
  preface: string;
  acknowledgments: string;
  notesSecondEdition: string;
};
export const appendix = appendixRaw as {
  title: string;
  pages: string;
  pdfPages: string;
  content: string;
};

export function getAllChapterSlugs(): string[] {
  return chaptersIndex.map((ch) => ch.slug);
}
