import katex from 'katex';
import macros from '@/lib/katexMacros.json';

export function texHtml(src: string, display: boolean): string {
  return katex.renderToString(src, {
    macros: { ...macros },
    displayMode: display,
    throwOnError: false,
    strict: 'ignore',
    output: 'html',
  });
}

/** Mini-markup (<b>, <i>, <code>, $math$) to an HTML string. */
export function inlineHtml(x: string): string {
  const parts = x.split(/((?<!\\)\$(?:\\.|[^$\\])+?\$)/g);
  return parts
    .map((part) => {
      if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) {
        return texHtml(part.slice(1, -1), false);
      }
      return part
        .replace(/&(?!lt;|gt;)/g, '&amp;')
        .replace(/\\\$/g, '$')
        .replace(/\n/g, '<br/>');
    })
    .join('');
}

/** Renders text that may contain $inline math$ (titles, summaries, chips). */
export default function MathText({ x, className }: { x: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: inlineHtml(x) }} />;
}
