import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="relative bg-white/60 dark:bg-[#08090d] text-zinc-600 dark:text-zinc-400 pt-16 pb-10 overflow-hidden border-t border-zinc-200/70 dark:border-white/5">
      {/* Soft golden atmospheric mist glow at top of footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-32 bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-serif text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Garden of Eden
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed font-sans">
              Free, rigorous syllabi for the mathematics behind machine learning,
              written from first principles with every theorem proved.
            </p>

            <div className="pt-2">
              <Link
                href="/modules"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 hover:bg-black text-white dark:bg-white/90 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs transition-colors shadow-sm"
              >
                <span>Explore</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Elegant Bottom Typographic Stamp */}
        <div className="pt-10 border-t border-zinc-200/70 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <div>
            A Living Computational Arboretum. Free and open knowledge.
          </div>
          <div>
            © 2026 Garden of Eden. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
