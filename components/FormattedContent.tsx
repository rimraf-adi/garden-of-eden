'use client';

import React from 'react';
import BookFigure from '@/components/BookFigure';
import { MathDisplay, renderInlineMath } from '@/components/MathRenderer';

interface Props {
  content: string;
}

export default function FormattedContent({ content }: Props) {
  if (!content) return null;

  // Split content into distinct paragraphs or blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-base sm:text-lg">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Custom Drawn Figure block: Figure X.Y ...
        const figMatch = trimmed.match(/^Figure\s+(\d+\.\d+)/i);
        if (figMatch) {
          const figId = figMatch[1];
          return (
            <BookFigure
              key={idx}
              figureId={figId}
              caption={trimmed}
            />
          );
        }

        // Display Math Equation block: $$ ... $$ or $$ ... $$ (X.Y)
        const displayMathMatch = trimmed.match(/^\$\$\s*([\s\S]+?)\s*\$\$(?:\s*\(([1-9]\d*\.\d+)\))?$/);
        if (displayMathMatch) {
          const math = displayMathMatch[1].trim();
          const tag = displayMathMatch[2] ? `(${displayMathMatch[2]})` : undefined;
          return <MathDisplay key={idx} math={math} tag={tag} />;
        }

        // Fallback for equation with tag alone like (2.1) x = ... or (8.1) F(x) = ...
        const taggedEqMatch = trimmed.match(/^(\([1-9]\d*\.\d+\))\s+(.+)$/);
        if (taggedEqMatch && (trimmed.includes('=') || trimmed.includes('\\') || trimmed.includes('$') || trimmed.includes('+') || trimmed.includes('-'))) {
          const tag = taggedEqMatch[1];
          const math = taggedEqMatch[2].replace(/^\$+|\$+$/g, '').trim();
          return <MathDisplay key={idx} math={math} tag={tag} />;
        }

        // Table block
        if (trimmed.startsWith('Table ')) {
          return (
            <div
              key={idx}
              className="my-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-950/60 dark:bg-indigo-950/20 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                Book Table Reference
              </div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 italic">
                {trimmed}
              </p>
            </div>
          );
        }

        // Bullet point list
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n(?=[•\-\*]\s*)/);
          return (
            <ul key={idx} className="my-4 space-y-2.5 pl-6 list-disc marker:text-indigo-500">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-zinc-700 dark:text-zinc-300 pl-1">
                  {renderInlineMath(item.replace(/^[•\-\*]\s*/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Algorithm / Pseudocode block
        if (
          trimmed.startsWith('Initialize') ||
          trimmed.startsWith('Repeat') ||
          trimmed.startsWith('For ') ||
          trimmed.startsWith('Algorithm')
        ) {
          return (
            <div
              key={idx}
              className="my-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-6 font-mono text-sm shadow-xl"
            >
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-3 border-b border-zinc-800 pb-2 flex justify-between">
                <span>Pseudocode / Algorithm</span>
                <span>Alpaydın ML</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed font-mono text-emerald-400">
                {trimmed}
              </pre>
            </div>
          );
        }

        // Regular Text Paragraph with inline math parsing
        return (
          <p key={idx} className="text-justify font-serif sm:font-sans">
            {renderInlineMath(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
