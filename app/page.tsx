import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#08090d] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* =========================================================================
          HERO SECTION: Full-Bleed Edge-to-Edge Tree of Knowledge Sanctuary
         ========================================================================= */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden -mt-16 pt-24 sm:pt-28 pb-10 sm:pb-14">
        {/* Full-Bleed Background Image (NO bento box, spans entire viewport) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/hero-tree.jpg"
            alt="Garden of Eden — Sacred Tree of Knowledge"
            fill
            priority
            className="object-cover object-center"
          />


          {/* Atmospheric Mist & Sunlight Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafc] via-[#fafafc]/50 to-transparent dark:from-[#08090d] dark:via-[#08090d]/50 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-transparent dark:from-[#08090d]/85 dark:via-transparent dark:to-transparent" />

          {/* Ambient Warm Golden Sunlight Bloom */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-b from-amber-300/25 via-amber-200/10 to-transparent blur-3xl rounded-full" />

          {/* Full-Screen Faint Sacred Geometry & Matrix Grid Lines */}
          <div className="absolute inset-0 opacity-15 dark:opacity-10 bg-[radial-gradient(#d97706_1.2px,transparent_1.2px)] [background-size:28px_28px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        </div>

        {/* Center Content: Pure Editorial Luxury Typography */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center my-auto pt-8 sm:pt-14 pb-8">
          <div className="space-y-5 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif tracking-tight text-zinc-900 dark:text-white leading-[1.12]">
              Intelligence, grown from{' '}
              <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 dark:from-amber-200 dark:via-amber-300 dark:to-yellow-100 drop-shadow-xs">
                first principles
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-zinc-700 dark:text-zinc-200/90 leading-relaxed font-sans">
              Free, rigorous syllabi in linear algebra, calculus, probability, differential
              equations and machine learning. Every theorem proved, every idea drawn.
            </p>

            {/* Action Buttons matching ATMA Wellness aesthetic */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-3 sm:pt-4">
              <Link
                href="/modules"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-sm transition-all shadow-xl shadow-zinc-950/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
