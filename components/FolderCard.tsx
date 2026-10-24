'use client';

import Link from 'next/link';
import { LearningPath } from '@/lib/pathsData';
import { ArrowRight } from 'lucide-react';

interface FolderCardProps {
  path: LearningPath;
}

export default function FolderCard({ path }: FolderCardProps) {
  const { accentColor } = path;

  // Render stylized SVG background artwork for the folder cover
  const renderFolderArtwork = () => {
    switch (path.folderGraphic) {
      case 'coral-brain':
        return (
          <svg
            className="absolute inset-0 w-full h-full opacity-30 mix-blend-multiply pointer-events-none"
            viewBox="0 0 240 200"
            fill="none"
          >
            <path
              d="M20 40 C60 10, 100 80, 140 30 C180 -10, 220 50, 230 110 C240 170, 190 190, 130 170 C70 150, 40 180, 10 140 C-20 100, -10 60, 20 40 Z"
              stroke={accentColor.folderText}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M40 60 C80 35, 110 90, 150 50 C180 20, 200 70, 205 110 C210 150, 175 165, 125 150 C80 135, 55 155, 30 125 C10 95, 15 75, 40 60 Z"
              stroke={accentColor.folderText}
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              d="M70 80 C100 65, 120 105, 150 75 C170 55, 185 85, 185 115 C185 140, 160 150, 120 135 C90 120, 75 135, 55 115 C40 95, 50 85, 70 80 Z"
              stroke={accentColor.folderText}
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        );

      case 'system-lines':
        return (
          <svg
            className="absolute inset-0 w-full h-full opacity-35 mix-blend-multiply pointer-events-none"
            viewBox="0 0 240 200"
            fill="none"
          >
            {[-40, -20, 0, 20, 40, 60, 80].map((offset, i) => (
              <path
                key={i}
                d={`M${20 + i * 25} 30 C${80 + offset} 90, ${160 - offset} 110, ${220 - i * 15} 170`}
                stroke={accentColor.folderText}
                strokeWidth="1.8"
              />
            ))}
            <line x1="30" y1="140" x2="210" y2="140" stroke={accentColor.folderText} strokeWidth="1.2" strokeDasharray="4 4" />
            <line x1="30" y1="160" x2="210" y2="160" stroke={accentColor.folderText} strokeWidth="1.2" strokeDasharray="4 4" />
          </svg>
        );

      case 'math-torus':
        return (
          <svg
            className="absolute inset-0 w-full h-full opacity-30 mix-blend-multiply pointer-events-none"
            viewBox="0 0 240 200"
            fill="none"
          >
            {[40, 70, 100, 130, 160].map((cy, i) => (
              <ellipse
                key={i}
                cx="120"
                cy={cy}
                rx={60 + i * 8}
                ry={22 + i * 4}
                stroke={accentColor.folderText}
                strokeWidth="1.4"
              />
            ))}
            <line x1="120" y1="20" x2="120" y2="180" stroke={accentColor.folderText} strokeWidth="1.2" strokeDasharray="3 3" />
          </svg>
        );

      case 'network-graph':
        return (
          <svg
            className="absolute inset-0 w-full h-full opacity-35 mix-blend-multiply pointer-events-none"
            viewBox="0 0 240 200"
            fill="none"
          >
            <circle cx="60" cy="70" r="5" fill={accentColor.folderText} />
            <circle cx="120" cy="50" r="6" fill={accentColor.folderText} />
            <circle cx="180" cy="80" r="5" fill={accentColor.folderText} />
            <circle cx="80" cy="140" r="5" fill={accentColor.folderText} />
            <circle cx="150" cy="130" r="6" fill={accentColor.folderText} />
            <line x1="60" y1="70" x2="120" y2="50" stroke={accentColor.folderText} strokeWidth="1.5" />
            <line x1="120" y1="50" x2="180" y2="80" stroke={accentColor.folderText} strokeWidth="1.5" />
            <line x1="60" y1="70" x2="80" y2="140" stroke={accentColor.folderText} strokeWidth="1.5" />
            <line x1="120" y1="50" x2="150" y2="130" stroke={accentColor.folderText} strokeWidth="1.5" />
            <line x1="80" y1="140" x2="150" y2="130" stroke={accentColor.folderText} strokeWidth="1.5" />
            <line x1="180" y1="80" x2="150" y2="130" stroke={accentColor.folderText} strokeWidth="1.5" />
          </svg>
        );

      default:
        return (
          <svg
            className="absolute inset-0 w-full h-full opacity-25 mix-blend-multiply pointer-events-none"
            viewBox="0 0 240 200"
            fill="none"
          >
            {[30, 60, 90, 120, 150, 180, 210].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="180" stroke={accentColor.folderText} strokeWidth="1" strokeDasharray="3 3" />
            ))}
            {[40, 70, 100, 130, 160].map((y) => (
              <line key={y} x1="20" y1={y} x2="220" y2={y} stroke={accentColor.folderText} strokeWidth="1" strokeDasharray="3 3" />
            ))}
          </svg>
        );
    }
  };

  return (
    <Link
      href={path.href}
      className="group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
      style={{
        backgroundColor: accentColor.tagBg,
      }}
    >
      {/* Tabbed Folder Cover inside the tinted card */}
      <div
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between p-5 select-none"
        style={{
          backgroundColor: accentColor.folderBg,
          border: `1px solid ${accentColor.folderBorder}`,
        }}
      >
        {/* Physical Folder Tab in Upper Right */}
        <div
          className="absolute -top-0.5 right-3 h-5 w-14 rounded-t-md border-t border-l border-r pointer-events-none"
          style={{
            backgroundColor: accentColor.folderBg,
            borderColor: accentColor.folderBorder,
          }}
        />

        {/* Ambient SVG Artwork */}
        {renderFolderArtwork()}

        {/* Top Folder Header */}
        <div
          className="relative z-10 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider"
          style={{ color: accentColor.folderText }}
        >
          <span className="uppercase opacity-80">{path.id.replace(/-/g, '_')}</span>
        </div>

        {/* Middle Folder Title & Typography */}
        <div className="relative z-10 my-auto py-2">
          <h2
            className="text-2xl sm:text-[26px] font-black tracking-tight leading-tight"
            style={{ color: accentColor.folderText }}
          >
            {path.folderTitle}
          </h2>
        </div>

        {/* Bottom Folder Stamp */}
        <div
          className="relative z-10 flex items-center justify-between font-mono text-[10px]"
          style={{ color: accentColor.folderText }}
        >
          <span className="font-semibold lowercase opacity-75">eden</span>
        </div>
      </div>

      {/* Path Metadata & Details matching Fanout */}
      <div className="mt-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-zinc-950 tracking-tight leading-snug">
            {path.title}
          </h3>

          {/* Bullet points with '+' icons matching Fanout */}
          <ul className="mt-3 space-y-1.5 text-xs text-zinc-700">
            {path.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-zinc-500 font-bold select-none">+</span>
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 space-y-3">
          {/* Monospace Capsule Stats Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-white/75 border border-zinc-200/80 text-zinc-800 shadow-2xs">
            <span>{path.stats.modules} MODULES</span>
            <span className="opacity-40">·</span>
            <span>{path.stats.lessons} LESSONS</span>
            <span className="opacity-40">·</span>
            <span>FREE</span>
          </div>

          {/* Open CTA Link */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-950/10 text-sm font-semibold text-zinc-950 group-hover:text-cyan-700 transition-colors">
            <span>Open</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
