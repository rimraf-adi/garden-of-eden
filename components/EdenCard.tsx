'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface EdenCardItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  tag: string;
  heightClass?: string;
  accentGlow: string;
  visualType: 'mycelium' | 'amber-bloom' | 'prism-refract' | 'botanical-petal' | 'cobalt-mesh';
}

interface EdenCardProps {
  card: EdenCardItem;
}

export default function EdenCard({ card }: EdenCardProps) {
  const renderVisual = () => {
    switch (card.visualType) {
      case 'mycelium':
        return (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Deep misty teal gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-zinc-950/70 to-zinc-950" />
            <svg
              className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
              viewBox="0 0 300 450"
              fill="none"
            >
              <defs>
                <radialGradient id="teal-glow" cx="50%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#059669" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="150" cy="180" r="140" fill="url(#teal-glow)" />
              {/* Organic contour lines representing decision boundary manifolds */}
              <path
                d="M40 120 C100 80, 140 190, 200 130 C250 80, 280 180, 260 260 C230 350, 120 330, 80 280 C40 220, 0 170, 40 120 Z"
                stroke="#5eead4"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              <path
                d="M60 150 C110 120, 150 200, 190 160 C230 120, 250 200, 230 250 C210 300, 140 300, 100 250 C70 210, 30 180, 60 150 Z"
                stroke="#34d399"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <path
                d="M90 180 C120 160, 160 210, 180 190 C200 170, 210 210, 195 240 C180 270, 140 270, 120 240 C105 215, 80 200, 90 180 Z"
                stroke="#a7f3d0"
                strokeWidth="1.8"
              />
            </svg>
          </div>
        );

      case 'amber-bloom':
        return (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Deep luminous golden amber lens */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-zinc-950/70 to-zinc-950" />
            <svg
              className="absolute inset-0 w-full h-full opacity-65 mix-blend-screen pointer-events-none"
              viewBox="0 0 300 450"
              fill="none"
            >
              <defs>
                <radialGradient id="amber-glow" cx="50%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#d97706" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="150" cy="180" r="150" fill="url(#amber-glow)" />
              {/* High-dimensional torus / attention coordinate rays */}
              {[40, 70, 100, 130, 160].map((r, idx) => (
                <ellipse
                  key={idx}
                  cx="150"
                  cy="180"
                  rx={r * 1.2}
                  ry={r * 0.65}
                  stroke="#fbbf24"
                  strokeWidth="1.2"
                  opacity={0.3 + idx * 0.12}
                />
              ))}
              <circle cx="150" cy="180" r="8" fill="#fef3c7" />
              <line x1="150" y1="60" x2="150" y2="300" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          </div>
        );

      case 'prism-refract':
        return (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Misty cyan prism refraction */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-zinc-950/70 to-zinc-950" />
            <svg
              className="absolute inset-0 w-full h-full opacity-65 mix-blend-screen pointer-events-none"
              viewBox="0 0 300 450"
              fill="none"
            >
              <defs>
                <linearGradient id="prism-beam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points="50,60 250,140 180,320 20,220" fill="url(#prism-beam)" />
              {/* Entropy wave ripples */}
              {[60, 100, 140, 180, 220].map((y, idx) => (
                <path
                  key={idx}
                  d={`M20 ${y} Q80 ${y - 25} 150 ${y} T280 ${y}`}
                  stroke="#7dd3fc"
                  strokeWidth="1.2"
                  opacity={0.4 + idx * 0.1}
                />
              ))}
            </svg>
          </div>
        );

      case 'botanical-petal':
        return (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Soft rose / peach botanical bloom */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-zinc-950/70 to-zinc-950" />
            <svg
              className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
              viewBox="0 0 300 450"
              fill="none"
            >
              <defs>
                <radialGradient id="rose-glow" cx="50%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#e11d48" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="150" cy="180" r="140" fill="url(#rose-glow)" />
              {/* Petal geometry */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 150 180)`}>
                  <path
                    d="M150 180 C130 110 170 110 150 180 Z"
                    stroke="#fda4af"
                    strokeWidth="1.2"
                    fill="#f43f5e"
                    fillOpacity="0.08"
                  />
                </g>
              ))}
              <circle cx="150" cy="180" r="5" fill="#fff1f2" />
            </svg>
          </div>
        );

      case 'cobalt-mesh':
        return (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Deep cobalt blueprint */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-zinc-950/70 to-zinc-950" />
            <svg
              className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
              viewBox="0 0 300 450"
              fill="none"
            >
              {/* Distributed consensus topology */}
              <circle cx="150" cy="180" r="85" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="150" cy="95" r="8" fill="#93c5fd" />
              <circle cx="230" cy="150" r="7" fill="#60a5fa" />
              <circle cx="205" cy="245" r="7" fill="#60a5fa" />
              <circle cx="95" cy="245" r="7" fill="#60a5fa" />
              <circle cx="70" cy="150" r="7" fill="#60a5fa" />
              <line x1="150" y1="95" x2="230" y2="150" stroke="#3b82f6" strokeWidth="1.2" />
              <line x1="230" y1="150" x2="205" y2="245" stroke="#3b82f6" strokeWidth="1.2" />
              <line x1="205" y1="245" x2="95" y2="245" stroke="#3b82f6" strokeWidth="1.2" />
              <line x1="95" y1="245" x2="70" y2="150" stroke="#3b82f6" strokeWidth="1.2" />
              <line x1="70" y1="150" x2="150" y2="95" stroke="#3b82f6" strokeWidth="1.2" />
            </svg>
          </div>
        );
    }
  };

  return (
    <Link
      href={card.href}
      className={`group relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden ${
        card.heightClass || 'min-h-[440px]'
      }`}
    >
      {/* Background visual artwork */}
      {renderVisual()}

      {/* Subtle hover gradient reflection */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

      {/* Top Header */}
      <div className="relative z-10 space-y-1">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-emerald-400 transition-colors">
          {card.tag}
        </span>
        <h3 className="font-serif text-2xl sm:text-[26px] font-normal tracking-tight text-zinc-100 group-hover:text-white transition-colors leading-snug">
          {card.title}
        </h3>
      </div>

      {/* Bottom Description */}
      <div className="relative z-10 pt-8 mt-auto space-y-3">
        <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
          {card.subtitle}
        </p>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400/90 font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
          <span>Enter Grove</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
