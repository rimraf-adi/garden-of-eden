'use client';

import { useEffect, useRef } from 'react';

/** Display math that shrinks (down to 62%) to fit its container instead of scrolling sideways. */
export default function FitMath({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '1em';
      const over = el.scrollWidth / el.clientWidth;
      if (over > 1.001) el.style.fontSize = `${Math.max(0.62, 1 / over - 0.01)}em`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [html]);

  return <div ref={ref} className="flex-1 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
}
