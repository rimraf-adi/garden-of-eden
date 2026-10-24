import { notFound } from 'next/navigation';
import {
  chaptersIndex,
  getAllChapterSlugs,
} from '@/lib/bookData';
import { getChapterBySlug, getChapterRawLatex } from '@/lib/bookData.server';
import ChapterReaderClient from './ChapterReaderClient';

export const instant = false;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ slug }));
}

export default async function ChapterPage({ params }: Props) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const rawLatex = getChapterRawLatex(slug);

  const currentIndex = chaptersIndex.findIndex((c) => c.slug === slug);
  const prevChapter = currentIndex > 0 ? chaptersIndex[currentIndex - 1] : null;
  const nextChapter = currentIndex < chaptersIndex.length - 1 ? chaptersIndex[currentIndex + 1] : null;

  return (
    <ChapterReaderClient
      chapter={chapter}
      rawLatex={rawLatex}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
