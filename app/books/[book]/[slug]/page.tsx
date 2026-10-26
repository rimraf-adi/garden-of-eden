import { notFound } from 'next/navigation';
import { BOOK_INDEX, getBook } from '@/lib/books';
import { getBookChapter, getBookTex } from '@/lib/books.server';
import BlockList from '@/components/book/BlockRenderer';
import MathText from '@/components/book/MathText';
import BookReaderClient from './BookReaderClient';

export const instant = false;

interface Props {
  params: Promise<{ book: string; slug: string }>;
}

export function generateStaticParams() {
  return Object.entries(BOOK_INDEX).flatMap(([book, idx]) => idx.chapters.map((c) => ({ book, slug: c.slug })));
}

export default async function BookChapterPage({ params }: Props) {
  const { book, slug } = await params;
  const index = getBook(book);
  const chapter = index && getBookChapter(book, slug);
  if (!index || !chapter) notFound();

  const pos = index.chapters.findIndex((c) => c.slug === slug);
  const pick = (c?: (typeof index.chapters)[number]) => (c ? { slug: c.slug, title: c.title, label: c.label } : null);

  const sections = chapter.sections.map((s) => ({
    id: s.id,
    title: s.title,
    subs: s.blocks.filter((b) => b.t === 'h' && b.level === 3 && b.id).map((b) => ({ id: (b as { id: string }).id, title: (b as { x: string }).x })),
  }));

  return (
    <BookReaderClient
      book={book}
      pathHref={`/paths/${book}`}
      bookTitle={index.title}
      chapterLabel={chapter.label}
      title={chapter.title}
      tag={chapter.tag}
      readingTimeMin={chapter.readingTimeMin}
      wordCount={chapter.wordCount}
      sections={sections}
      prev={pick(index.chapters[pos - 1])}
      next={pick(index.chapters[pos + 1])}
      tex={getBookTex(book, slug)}
    >
      {chapter.intro.length > 0 && <BlockList blocks={chapter.intro} book={book} />}
      {chapter.sections.map((s) => (
        <section key={s.id + s.title} id={`sec-${s.id || s.title}`} className="scroll-mt-28 space-y-6">
          <h2 className="border-b border-zinc-200 dark:border-white/10 pb-3 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 flex items-baseline gap-3">
            {s.id && <span className="font-mono text-xl sm:text-2xl text-amber-700 dark:text-amber-400">{s.id}</span>}
            <MathText x={s.title} />
          </h2>
          <BlockList blocks={s.blocks} book={book} />
        </section>
      ))}
    </BookReaderClient>
  );
}
