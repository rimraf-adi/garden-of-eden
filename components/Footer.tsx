import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090b10] text-zinc-400 pt-16 pb-12 overflow-hidden border-t border-zinc-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Let&apos;s build the future of AI together.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              A living computational arboretum engineered from first principles.
              From hardware-aware GPU systems to high-dimensional mathematics.
            </p>
            <div className="pt-2">
              <Link
                href="/modules"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 transition-colors"
              >
                <span>Explore All Modules</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider">Curricula</div>
              <ul className="space-y-2">
                <li><Link href="/paths/linear-algebra" className="hover:text-cyan-400 transition-colors">Mathematics for AI</Link></li>
                <li><Link href="/paths/deep-learning" className="hover:text-cyan-400 transition-colors">Foundation Models</Link></li>
                <li><Link href="/paths/inference-engineering" className="hover:text-cyan-400 transition-colors">Inference Engineering</Link></li>
                <li><Link href="/paths/system-design" className="hover:text-cyan-400 transition-colors">Distributed Systems</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider">Resources</div>
              <ul className="space-y-2">
                <li><Link href="/modules" className="hover:text-cyan-400 transition-colors">Curriculum Modules</Link></li>
                <li><Link href="/notations" className="hover:text-cyan-400 transition-colors">Mathematical Notations</Link></li>
                <li><Link href="/chapter/01-introduction" className="hover:text-cyan-400 transition-colors">Module Reader</Link></li>
                <li><Link href="/appendix" className="hover:text-cyan-400 transition-colors">Probability Appendix</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider">Platform</div>
              <ul className="space-y-2">
                <li><Link href="/frontmatter" className="hover:text-cyan-400 transition-colors">Principles & Ethos</Link></li>
                <li><Link href="/modules" className="hover:text-cyan-400 transition-colors">Table of Contents</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Bottom Typographic Signature Logo */}
        <div className="pt-10 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-zinc-800 select-none flex items-center gap-2">
            <span className="text-cyan-400">*</span>
            <span>GardenOfEden</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            © 2026 Garden of Eden. All computational rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
