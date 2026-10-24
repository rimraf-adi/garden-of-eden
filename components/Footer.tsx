import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#08090d] text-zinc-400 pt-20 pb-14 overflow-hidden border-t border-white/5">
      {/* Soft golden atmospheric mist glow at top of footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-32 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start justify-between">
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex flex-col items-center justify-center w-7 h-7">
                <div className="w-2.5 h-1.5 rounded-full bg-amber-400/80 mb-0.5" />
                <div className="w-4 h-2 rounded-full bg-amber-500/80 mb-0.5" />
                <div className="w-5.5 h-2.5 rounded-full bg-amber-600/80" />
              </div>
              <span className="font-serif text-xl font-medium tracking-tight text-zinc-100">
                Garden of Eden
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-sans">
              A serene computational sanctuary engineered from first principles.
              Cultivating deep mathematical rigor, hardware-aware intuition, and reproducible foundation models.
            </p>

            <div className="pt-2">
              <Link
                href="/modules"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 hover:bg-white text-zinc-950 font-medium text-xs transition-colors shadow-sm"
              >
                <span>Explore All 25 Modules</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-sans">
            <div className="space-y-3.5">
              <div className="font-serif text-sm text-zinc-200 tracking-wide">Curricula</div>
              <ul className="space-y-2.5 text-zinc-400">
                <li><Link href="/paths/linear-algebra" className="hover:text-amber-300 transition-colors">Mathematics for AI</Link></li>
                <li><Link href="/paths/information-theory" className="hover:text-amber-300 transition-colors">Information Theory</Link></li>
                <li><Link href="/paths/statistical-learning" className="hover:text-amber-300 transition-colors">Statistical Learning</Link></li>
                <li><Link href="/paths/inference-engineering" className="hover:text-amber-300 transition-colors">Inference Engineering</Link></li>
                <li><Link href="/paths/agentic-systems" className="hover:text-amber-300 transition-colors">Agentic Systems</Link></li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <div className="font-serif text-sm text-zinc-200 tracking-wide">Explorations</div>
              <ul className="space-y-2.5 text-zinc-400">
                <li><Link href="/modules" className="hover:text-amber-300 transition-colors">Curriculum Index</Link></li>
                <li><Link href="/notations" className="hover:text-amber-300 transition-colors">Mathematical Notations</Link></li>
                <li><Link href="/workbench" className="hover:text-amber-300 transition-colors">Simulation Workbench</Link></li>
                <li><Link href="/practice" className="hover:text-amber-300 transition-colors">Deliberate Practice</Link></li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <div className="font-serif text-sm text-zinc-200 tracking-wide">Sanctuary</div>
              <ul className="space-y-2.5 text-zinc-400">
                <li><Link href="/frontmatter" className="hover:text-amber-300 transition-colors">First Principles & Ethos</Link></li>
                <li><Link href="/appendix" className="hover:text-amber-300 transition-colors">Probability Appendix</Link></li>
                <li><Link href="/chapter/01-introduction" className="hover:text-amber-300 transition-colors">Reader Interface</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Elegant Bottom Typographic Stamp */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
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
