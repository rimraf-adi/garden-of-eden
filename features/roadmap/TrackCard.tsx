import Link from 'next/link';
import { LearningTrack, CONCEPT_NODES } from '@/lib/curriculum';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';

interface TrackCardProps {
  track: LearningTrack;
  isActive?: boolean;
  onSelect?: () => void;
}

export default function TrackCard({ track, isActive, onSelect }: TrackCardProps) {
  const chapters = CONCEPT_NODES.filter((node) => track.chapterNums.includes(node.chapterNum));
  const totalHours = chapters.reduce((sum, ch) => sum + ch.estimatedHours, 0);

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border p-5 transition-all cursor-pointer ${
        isActive
          ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-lg shadow-amber-500/10'
          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: track.color }}
          />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            {track.code}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <Clock className="h-3.5 w-3.5" />
          <span>{totalHours.toFixed(1)}h</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
        {track.name}
      </h3>
      <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
        {track.description}
      </p>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap gap-1.5">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            href={`/chapter/${ch.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-300 transition-colors"
          >
            <span>Ch.{ch.chapterNum}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
