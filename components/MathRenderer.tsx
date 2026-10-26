'use client';

import React from 'react';
import katex from 'katex';

interface MathDisplayProps {
  math: string;
  tag?: string;
  displayMode?: boolean;
}

export function sanitizeMathString(math: string): string {
  if (!math) return '';
  return math
    .replace(/\$/g, '') // Strip all $ signs because KaTeX is already in math mode
    .replace(/\\textasciicircum\{\}/g, '^')
    .replace(/\\textasciicircum/g, '^')
    .replace(/#\d*\s*/g, '') // Remove stray OCR "#2" prefixes
    .replace(/allel/g, '\\|')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/•/g, '\\cdot')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .trim();
}

export function MathDisplay({ math, tag, displayMode = true }: MathDisplayProps) {
  const cleanMath = sanitizeMathString(math);
  let html = '';
  try {
    html = katex.renderToString(cleanMath, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
  } catch {
    html = `<span class="font-mono text-zinc-900 dark:text-zinc-100 font-medium">${cleanMath}</span>`;
  }

  if (!displayMode) {
    return <span dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-1" />;
  }

  return (
    <div className="my-6 flex items-center justify-between overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 px-6 py-4 shadow-sm hover:border-amber-300 dark:hover:border-amber-700 transition">
      <div className="flex-1 overflow-x-auto py-1 text-center sm:text-left">
        <span
          dangerouslySetInnerHTML={{ __html: html }}
          className="text-zinc-900 dark:text-zinc-100 text-base sm:text-lg"
        />
      </div>
      {tag && (
        <span className="ml-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900 px-2.5 py-1 rounded-lg shrink-0">
          {tag}
        </span>
      )}
    </div>
  );
}

// Pre-clean text to fix OCR artifacts and broken inline math tokens
export function precleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\$\s*allel\$/g, '$\\|$')
    .replace(/allel/g, '\\|')
    .replace(/\$\s*-\s*\$\$/g, '$-$')
    .replace(/\$-\$\$\$?/g, '$-$')
    .replace(/\$\s*\+\s*\$\$/g, '$+$')
    .replace(/\$\sigma\$\s*i2/g, '$\\sigma_i^2$')
    .replace(/\$\sigma\$\s*12/g, '$\\sigma_{12}$')
    .replace(/\$\sigma\$\s*ij/g, '$\\sigma_{ij}$')
    .replace(/\$\sigma\$\s*1/g, '$\\sigma_1$')
    .replace(/\$\sigma\$\s*2/g, '$\\sigma_2$')
    .replace(/\$\mu\$\s*i/g, '$\\mu_i$')
    .replace(/\$\mu\$\s*0/g, '$\\mu_0$')
    .replace(/\$\mu\$\s*1/g, '$\\mu_1$')
    .replace(/\$\mu\$\s*2/g, '$\\mu_2$')
    .replace(/\$\theta\$\s*\*/g, '$\\theta^*$')
    .replace(/\$\theta\$\s*1/g, '$\\theta_1$')
    .replace(/\$\theta\$\s*0/g, '$\\theta_0$')
    .replace(/\$\Sigma\$/g, '$\\boldsymbol{\\Sigma}$')
    .replace(/\$\mu\$/g, '$\\boldsymbol{\\mu}$')
    .replace(/\\in\$\$\\mathbb\{R\}\$is/g, '$\\in \\mathbb{R}$ is')
    .replace(/\$\\mathbb\{R\}\$is/g, '$\\mathbb{R}$ is')
    .replace(/\$\\mathbb\{R\}\$/g, '$\\mathbb{R}$')
    .replace(/\\textasciicircum\{\}/g, '^')
    .replace(/\\textasciicircum/g, '^')
    .replace(/\$\\le\$\s*\$\\cdot\$/g, '$\\le \\dots$')
    .replace(/\$\\le\$\s*\$/g, '$\\le ')
    .replace(/\$\\ge\$\s*\$/g, '$\\ge ')
    .replace(/–/g, '-')
    .replace(/—/g, '-');
}

// Helper to parse paragraph text and render inline LaTeX math $...$ or $$...$$
export function renderInlineMath(text: string): React.ReactNode[] {
  if (!text) return [];

  const cleaned = precleanText(text);

  // Match both $$...$$ display math inside text and $...$ inline math
  const parts = cleaned.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

  return parts.map((part, index) => {
    // Embedded display math $$...$$
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      const math = sanitizeMathString(part.slice(2, -2));
      try {
        const html = katex.renderToString(math, {
          displayMode: false,
          throwOnError: false,
          strict: false,
          output: 'htmlAndMathml',
        });
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: html }}
            className="inline-block mx-1 text-zinc-900 dark:text-zinc-100 font-sans"
          />
        );
      } catch {
        return (
          <span key={index} className="font-mono text-zinc-900 dark:text-zinc-100 text-sm">
            {math}
          </span>
        );
      }
    }

    // Standard inline math $...$
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const math = sanitizeMathString(part.slice(1, -1));
      try {
        const html = katex.renderToString(math, {
          displayMode: false,
          throwOnError: false,
          strict: false,
          output: 'htmlAndMathml',
        });
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: html }}
            className="inline-block mx-0.5 text-zinc-900 dark:text-zinc-100 font-sans"
          />
        );
      } catch {
        return (
          <span key={index} className="font-mono text-zinc-900 dark:text-zinc-100 text-sm">
            {math}
          </span>
        );
      }
    }

    return <span key={index}>{part}</span>;
  });
}
