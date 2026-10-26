'use client';

import React, { useState } from 'react';
import { Eye, Info, Sparkles } from 'lucide-react';

interface BookFigureProps {
  figureId: string;
  caption: string;
}

export default function BookFigure({ figureId, caption }: BookFigureProps) {
  const [activeTab, setActiveTab] = useState<'diagram' | 'caption'>('diagram');

  return (
    <figure className="my-10 rounded-3xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 shadow-md overflow-hidden">
      {/* Figure Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Figure {figureId} · Technical Illustration
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              activeTab === 'diagram'
                ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Illustration
          </button>
          <button
            onClick={() => setActiveTab('caption')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              activeTab === 'caption'
                ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Caption Details
          </button>
        </div>
      </div>

      {/* Figure Canvas / SVG Body */}
      <div className="p-6 sm:p-8 bg-slate-50/70 dark:bg-zinc-950 flex flex-col items-center justify-center min-h-[300px] border-y border-zinc-200/60 dark:border-zinc-800">
        {renderIllustration(figureId)}
      </div>

      {/* Caption Footnote */}
      <figcaption className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
        <strong className="text-zinc-900 dark:text-zinc-100 font-semibold mr-1.5">
          Figure {figureId}:
        </strong>
        {caption.replace(new RegExp(`^Figure\\s+${figureId}\\s*`, 'i'), '')}
      </figcaption>
    </figure>
  );
}

function renderIllustration(id: string) {
  switch (id) {
    case '1.1':
      return <Fig1_1 />;
    case '1.2':
      return <Fig1_2 />;
    case '2.1':
      return <Fig2_1 />;
    case '2.2':
      return <Fig2_2 />;
    case '2.3':
      return <Fig2_3 />;
    case '2.4':
      return <Fig2_4 />;
    case '2.5':
      return <Fig2_5 />;
    case '2.10':
      return <Fig2_10 />;
    case '3.1':
      return <Fig3_1 />;
    case '4.1':
      return <Fig4_1 />;
    case '4.2':
      return <Fig4_2 />;
    case '4.4':
      return <Fig4_4 />;
    case '4.5':
      return <Fig4_5 />;
    case '4.6':
      return <Fig4_6 />;
    case '6.1':
      return <Fig6_1 />;
    case '6.7':
      return <Fig6_7 />;
    case '7.1':
      return <Fig7_1 />;
    case '7.2':
      return <Fig7_2 />;
    case '9.1':
      return <Fig9_1 />;
    case '10.1':
      return <Fig10_1 />;
    case '10.5':
      return <Fig10_5 />;
    case '11.1':
      return <Fig11_1 />;
    case '11.4':
      return <Fig11_4 />;
    case '11.5':
      return <Fig11_5 />;
    case '11.6':
      return <Fig11_6 />;
    case '13.1':
      return <Fig13_1 />;
    case '13.2':
      return <Fig13_2 />;
    case '13.6':
      return <Fig13_6 />;
    case '16.1':
      return <Fig16_1 />;
    case '18.1':
      return <Fig18_1 />;
    case '19.3':
      return <Fig19_3 />;
    case '19.4':
      return <Fig19_4 />;
    default:
      return <GenericSchematic id={id} />;
  }
}

// ==================== INDIVIDUAL CUSTOM VECTOR ILLUSTRATIONS ====================

// Figure 1.1: Customer credit classification (Income vs Savings)
function Fig1_1() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <defs>
        <pattern id="grid1_1" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <rect width="560" height="320" fill="url(#grid1_1)" />

      {/* Shaded Regions */}
      <rect x="250" y="40" width="260" height="150" fill="rgba(217, 119, 6, 0.12)" rx="8" />
      <text x="380" y="70" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">Low-Risk (Accepted)</text>

      <rect x="80" y="190" width="170" height="90" fill="rgba(239, 68, 68, 0.08)" rx="8" />
      <text x="160" y="240" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">High-Risk (Default)</text>

      {/* Decision Boundaries */}
      <line x1="250" y1="40" x2="250" y2="190" stroke="#d97706" strokeWidth="2.5" strokeDasharray="5,4" />
      <line x1="250" y1="190" x2="510" y2="190" stroke="#d97706" strokeWidth="2.5" strokeDasharray="5,4" />

      {/* Axes */}
      <line x1="80" y1="280" x2="520" y2="280" stroke="var(--diagram-axis)" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="80" y1="280" x2="80" y2="30" stroke="var(--diagram-axis)" strokeWidth="2" />
      <text x="500" y="305" fill="var(--diagram-text-muted)" fontSize="12" fontWeight="600">Income (x₁)</text>
      <text x="40" y="45" fill="var(--diagram-text-muted)" fontSize="12" fontWeight="600">Savings (x₂)</text>

      {/* Threshold Ticks */}
      <line x1="250" y1="275" x2="250" y2="285" stroke="#d97706" strokeWidth="2" />
      <text x="250" y="302" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">θ₁</text>

      <line x1="75" y1="190" x2="85" y2="190" stroke="#d97706" strokeWidth="2" />
      <text x="60" y="195" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">θ₂</text>

      {/* Low Risk Points (+) */}
      {[
        [280, 150], [330, 110], [370, 160], [420, 80], [450, 130], [390, 120]
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill="none" stroke="#d97706" strokeWidth="1.5" />
          <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#d97706" strokeWidth="1.5" />
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#d97706" strokeWidth="1.5" />
        </g>
      ))}

      {/* High Risk Points (-) */}
      {[
        [120, 260], [170, 230], [210, 250], [150, 210], [190, 220], [230, 265]
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#ef4444" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

// Figure 1.2: Used cars linear regression (Mileage vs Price)
function Fig1_2() {
  const points = [
    [110, 80],
    [160, 115],
    [210, 135],
    [270, 160],
    [340, 195],
    [410, 220],
    [450, 235],
  ];

  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <defs>
        <pattern id="grid1_2" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <rect width="560" height="320" fill="url(#grid1_2)" />

      {/* Axis frame */}
      <rect x="70" y="40" width="430" height="230" fill="none" stroke="var(--diagram-axis)" strokeWidth="1.5" />

      {/* Tick Marks */}
      {[140, 210, 280, 350, 420, 490].map((x) => (
        <line key={x} x1={x} y1="270" x2={x} y2="265" stroke="var(--diagram-axis)" strokeWidth="1" />
      ))}
      {[80, 120, 160, 200, 240].map((y) => (
        <line key={y} x1="70" y1={y} x2="75" y2={y} stroke="var(--diagram-axis)" strokeWidth="1" />
      ))}

      {/* Fitted Linear Line y = wx + w0 */}
      <line x1="70" y1="65" x2="500" y2="255" stroke="#10b981" strokeWidth="3" />
      <text x="320" y="140" fill="#34d399" fontSize="13" fontWeight="bold" transform="rotate(23 320 140)">
        y = wx + w₀ (Fitted Linear Model)
      </text>

      {/* Data points (x) */}
      {points.map(([px, py], i) => (
        <g key={i}>
          {/* Residual error vertical bar */}
          <line
            x1={px}
            y1={py}
            x2={px}
            y2={65 + (px - 70) * ((255 - 65) / (500 - 70))}
            stroke="rgba(239, 68, 68, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
          {/* Point mark x */}
          <line x1={px - 5} y1={py - 5} x2={px + 5} y2={py + 5} stroke="#f43f5e" strokeWidth="2" />
          <line x1={px + 5} y1={py - 5} x2={px - 5} y2={py + 5} stroke="#f43f5e" strokeWidth="2" />
        </g>
      ))}

      {/* Axis Labels */}
      <text x="285" y="295" fill="var(--diagram-text-muted)" fontSize="13" fontWeight="bold" textAnchor="middle">
        x: mileage
      </text>
      <text x="35" y="155" fill="var(--diagram-text-muted)" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(-90 35 155)">
        y: price
      </text>
    </svg>
  );
}

// Figure 2.1: Family Car Training Set
function Fig2_1() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Axes */}
      <line x1="70" y1="280" x2="500" y2="280" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="70" y1="280" x2="70" y2="30" stroke="var(--diagram-axis)" strokeWidth="2" />
      <text x="470" y="305" fill="var(--diagram-text-muted)" fontSize="12" fontWeight="600">x₁: Price</text>
      <text x="45" y="45" fill="var(--diagram-text-muted)" fontSize="12" fontWeight="600">x₂: Engine power</text>

      {/* Positive Class: Family car (+) clustered */}
      {[
        [220, 140], [250, 160], [280, 130], [300, 150], [260, 120], [320, 140]
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} y={y} r="9" fill="none" stroke="#d97706" strokeWidth="1.5" />
          <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke="#d97706" strokeWidth="1.5" />
          <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="#d97706" strokeWidth="1.5" />
        </g>
      ))}

      {/* Negative Class (-) outlying */}
      {[
        [140, 220], [170, 130], [240, 240], [340, 230], [420, 150], [400, 260], [370, 90], [220, 70]
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="none" stroke="var(--diagram-axis)" strokeWidth="1.5" />
          <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke="var(--diagram-axis)" strokeWidth="1.5" />
        </g>
      ))}

      <text x="270" y="185" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">+ Family Car</text>
      <text x="420" y="130" fill="var(--diagram-text-muted)" fontSize="11" textAnchor="middle">− Other</text>
    </svg>
  );
}

// Figure 2.2: Rectangle hypothesis class
function Fig2_2() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="70" y1="280" x2="500" y2="280" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="70" y1="280" x2="70" y2="30" stroke="var(--diagram-axis)" strokeWidth="2" />

      {/* Rectangle Hypothesis C */}
      <rect x="180" y="80" width="220" height="140" fill="rgba(217, 119, 6, 0.2)" stroke="#d97706" strokeWidth="2.5" />
      <text x="390" y="70" fill="#fcd34d" fontSize="14" fontWeight="bold">Class C</text>

      {/* Parameter lines */}
      <line x1="180" y1="280" x2="180" y2="220" stroke="#d97706" strokeDasharray="3,3" />
      <line x1="400" y1="280" x2="400" y2="220" stroke="#d97706" strokeDasharray="3,3" />
      <text x="180" y="300" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">p₁</text>
      <text x="400" y="300" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">p₂</text>

      <line x1="70" y1="220" x2="180" y2="220" stroke="#d97706" strokeDasharray="3,3" />
      <line x1="70" y1="80" x2="180" y2="80" stroke="#d97706" strokeDasharray="3,3" />
      <text x="50" y="225" fill="#fbbf24" fontSize="12" fontWeight="bold">e₁</text>
      <text x="50" y="85" fill="#fbbf24" fontSize="12" fontWeight="bold">e₂</text>

      <text x="290" y="155" fill="var(--diagram-text)" fontSize="13" fontWeight="bold" textAnchor="middle">
        (p₁ ≤ price ≤ p₂) ∧ (e₁ ≤ engine ≤ e₂)
      </text>
    </svg>
  );
}

// Figure 2.3: Actual class C vs Induced Hypothesis h
function Fig2_3() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Actual Class C */}
      <rect x="180" y="80" width="180" height="130" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6,4" />
      <text x="185" y="72" fill="#60a5fa" fontSize="12" fontWeight="bold">Actual Class C</text>

      {/* Induced Hypothesis h */}
      <rect x="220" y="100" width="190" height="140" fill="none" stroke="#10b981" strokeWidth="2.5" />
      <text x="390" y="260" fill="#34d399" fontSize="12" fontWeight="bold">Induced Hypothesis h</text>

      {/* False Positive Area */}
      <rect x="360" y="100" width="50" height="140" fill="rgba(239,68,68,0.2)" />
      <text x="430" y="170" fill="#f87171" fontSize="11" fontWeight="bold">False Positive (h=1, C=0)</text>

      {/* False Negative Area */}
      <rect x="180" y="80" width="40" height="130" fill="rgba(245,158,11,0.2)" />
      <text x="90" y="140" fill="#fbbf24" fontSize="11" fontWeight="bold">False Negative (C=1, h=0)</text>

      {/* Correct positive overlap */}
      <text x="290" y="150" fill="var(--diagram-text)" fontSize="12" fontWeight="bold" textAnchor="middle">True Positives</text>
    </svg>
  );
}

// Figure 2.4: S (Specific) vs G (General) Version Space
function Fig2_4() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* General Hypothesis G */}
      <rect x="120" y="50" width="320" height="210" fill="rgba(217, 119, 6, 0.08)" stroke="#d97706" strokeWidth="2" strokeDasharray="4,4" rx="6" />
      <text x="420" y="45" fill="#fbbf24" fontSize="12" fontWeight="bold">G: Most General</text>

      {/* Specific Hypothesis S */}
      <rect x="200" y="100" width="160" height="110" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" rx="4" />
      <text x="280" y="160" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">S: Most Specific</text>

      {/* Version space indicator */}
      <text x="140" y="80" fill="var(--diagram-text-muted)" fontSize="11" fontStyle="italic">Version Space (between S and G)</text>

      {/* Positive points inside S */}
      {[[220, 120], [250, 180], [330, 130], [310, 190], [270, 140]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#10b981" />
      ))}

      {/* Negative points outside G */}
      {[[80, 40], [470, 60], [460, 270], [90, 260], [280, 280]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#ef4444" />
      ))}
    </svg>
  );
}

// Figure 2.5: Maximum Margin Hypothesis
function Fig2_5() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* S and G bounds */}
      <rect x="150" y="70" width="260" height="170" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
      <rect x="190" y="100" width="180" height="110" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />

      {/* Maximum margin h halfway */}
      <rect x="170" y="85" width="220" height="140" fill="rgba(217, 119, 6, 0.15)" stroke="#d97706" strokeWidth="3" rx="4" />
      <text x="280" y="160" fill="var(--diagram-text)" fontSize="13" fontWeight="bold" textAnchor="middle">
        Max Margin Hypothesis h
      </text>

      {/* Margin arrows */}
      <line x1="170" y1="55" x2="190" y2="55" stroke="#f59e0b" strokeWidth="2" />
      <text x="180" y="45" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">margin</text>
    </svg>
  );
}

// Figure 2.10: Polynomial Curve Fitting
function Fig2_10() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <rect x="60" y="40" width="440" height="240" fill="none" stroke="var(--diagram-axis)" strokeWidth="1.5" />

      {/* Linear fit (Order 1) */}
      <line x1="60" y1="100" x2="500" y2="240" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
      <text x="420" y="260" fill="#60a5fa" fontSize="11">Order 1 (Underfit)</text>

      {/* Quadratic fit (Order 2) */}
      <path d="M 60 90 Q 280 230 500 220" fill="none" stroke="#10b981" strokeWidth="3" />
      <text x="320" y="210" fill="#34d399" fontSize="12" fontWeight="bold">Order 2 (Good Fit)</text>

      {/* High-order 6th polynomial (Wild Oscillations) */}
      <path d="M 60 70 C 120 280 180 50 250 260 C 320 50 380 280 500 270" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="150" y="295" fill="#f87171" fontSize="11">Order 6 (Overfit / Noise)</text>
    </svg>
  );
}

// Figure 3.1: Decision Regions & Boundaries
function Fig3_1() {
  return (
    <svg viewBox="0 0 560 320" className="w-full max-w-lg select-none">
      <rect width="560" height="320" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Regions */}
      <path d="M 60 40 Q 200 120 220 280 L 60 280 Z" fill="rgba(59, 130, 246, 0.12)" />
      <text x="120" y="160" fill="#60a5fa" fontSize="14" fontWeight="bold">Region R₁ (C₁)</text>

      <path d="M 220 280 Q 200 120 380 40 L 500 40 L 500 180 Q 360 200 220 280 Z" fill="rgba(16, 185, 129, 0.12)" />
      <text x="360" y="110" fill="#34d399" fontSize="14" fontWeight="bold">Region R₂ (C₂)</text>

      <path d="M 500 180 Q 360 200 220 280 L 500 280 Z" fill="rgba(245, 158, 11, 0.12)" />
      <text x="400" y="250" fill="#fbbf24" fontSize="14" fontWeight="bold">Region R₃ (C₃)</text>

      {/* Decision Boundaries */}
      <path d="M 60 40 Q 200 120 220 280" fill="none" stroke="#d97706" strokeWidth="2.5" />
      <path d="M 220 280 Q 360 200 500 180" fill="none" stroke="#d97706" strokeWidth="2.5" />
      <path d="M 200 120 Q 280 80 380 40" fill="none" stroke="#d97706" strokeWidth="2.5" />
    </svg>
  );
}

// Figure 4.1: Estimator Bias and Variance
function Fig4_1() {
  return (
    <svg viewBox="0 0 560 220" className="w-full max-w-lg select-none">
      <rect width="560" height="220" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Number line */}
      <line x1="80" y1="120" x2="480" y2="120" stroke="var(--diagram-axis)" strokeWidth="2.5" />

      {/* True Parameter Theta */}
      <circle cx="360" cy="120" r="7" fill="#ef4444" />
      <text x="360" y="150" fill="#f87171" fontSize="14" fontWeight="bold" textAnchor="middle">θ (True)</text>

      {/* Expected Value of Estimator E[d] */}
      <circle cx="260" cy="120" r="7" fill="#3b82f6" />
      <text x="260" y="150" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">E[d]</text>

      {/* Individual estimates d_i */}
      {[220, 240, 255, 275, 295, 305].map((x, i) => (
        <g key={i}>
          <line x1={x - 4} y1={116} x2={x + 4} y2={124} stroke="#10b981" strokeWidth="2" />
          <line x1={x + 4} y1={116} x2={x - 4} y2={124} stroke="#10b981" strokeWidth="2" />
        </g>
      ))}

      {/* Bias indicator */}
      <line x1="260" y1="80" x2="360" y2="80" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="310" y="70" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">Bias = E[d] − θ</text>

      {/* Variance indicator */}
      <line x1="210" y1="40" x2="310" y2="40" stroke="#8b5cf6" strokeWidth="2" />
      <text x="260" y="30" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">Variance Spread</text>
    </svg>
  );
}

// Figure 4.2: Likelihoods and Posteriors
function Fig4_2() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Axis */}
      <line x1="60" y1="220" x2="500" y2="220" stroke="var(--diagram-axis)" strokeWidth="1.5" />

      {/* Gaussian 1 */}
      <path d="M 80 220 Q 200 20 300 220" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      <text x="190" y="60" fill="#60a5fa" fontSize="12" fontWeight="bold">p(x|C₁)</text>

      {/* Gaussian 2 */}
      <path d="M 240 220 Q 360 20 480 220" fill="none" stroke="#10b981" strokeWidth="2.5" />
      <text x="370" y="60" fill="#34d399" fontSize="12" fontWeight="bold">p(x|C₂)</text>

      {/* Threshold x* */}
      <line x1="270" y1="30" x2="270" y2="220" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
      <text x="270" y="245" fill="#f87171" fontSize="12" fontWeight="bold" textAnchor="middle">
        Decision Threshold x* = (m₁ + m₂)/2
      </text>
    </svg>
  );
}

// Figure 4.4: Linear Regression with Gaussian Noise
function Fig4_4() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Regression Line */}
      <line x1="80" y1="210" x2="480" y2="70" stroke="#10b981" strokeWidth="3" />
      <text x="440" y="60" fill="#34d399" fontSize="12" fontWeight="bold">E[R|x] = wx + w₀</text>

      {/* Vertical cross-section bell curve at x* */}
      <line x1="300" y1="40" x2="300" y2="230" stroke="var(--diagram-axis)" strokeDasharray="3,3" />
      <path d="M 300 135 C 360 135 360 105 300 105" fill="rgba(217, 119, 6,0.2)" stroke="#d97706" strokeWidth="2" />
      <text x="350" y="125" fill="#fbbf24" fontSize="11" fontWeight="bold">p(r|x*) ~ N(g(x*), σ²)</text>
    </svg>
  );
}

// Figure 4.5 & 4.6: Bias-Variance Dilemma
function Fig4_5() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Sinusoid true function */}
      <path d="M 80 180 Q 200 40 300 140 T 480 100" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="4,4" />
      <text x="400" y="80" fill="var(--diagram-text-muted)" fontSize="11">True f(x) = 2sin(1.5x)</text>

      {/* Model fits */}
      <path d="M 80 200 C 180 20 280 240 480 80" fill="none" stroke="#10b981" strokeWidth="2.5" />
      <text x="240" y="240" fill="#34d399" fontSize="12" fontWeight="bold">Order 3 (Optimal Fit)</text>
    </svg>
  );
}

function Fig4_6() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="80" y1="220" x2="480" y2="220" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="80" y1="220" x2="80" y2="40" stroke="var(--diagram-axis)" strokeWidth="2" />
      <text x="440" y="240" fill="var(--diagram-text-muted)" fontSize="11">Model Order →</text>
      <text x="40" y="50" fill="var(--diagram-text-muted)" fontSize="11">Error</text>

      {/* Bias curve (decreasing) */}
      <path d="M 100 80 Q 250 160 460 190" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      <text x="140" y="110" fill="#60a5fa" fontSize="12" fontWeight="bold">Bias²</text>

      {/* Variance curve (increasing) */}
      <path d="M 100 200 Q 300 180 460 60" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      <text x="420" y="90" fill="#f87171" fontSize="12" fontWeight="bold">Variance</text>

      {/* Total Error U-curve */}
      <path d="M 100 70 Q 260 150 460 50" fill="none" stroke="#10b981" strokeWidth="3" />
      <text x="260" y="165" fill="#34d399" fontSize="13" fontWeight="bold">Total Error (Elbow at Order 3)</text>
    </svg>
  );
}

// Figure 6.1: PCA
function Fig6_1() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* 2D axes */}
      <line x1="120" y1="220" x2="120" y2="40" stroke="var(--diagram-axis)" strokeWidth="1.5" />
      <line x1="120" y1="220" x2="300" y2="220" stroke="var(--diagram-axis)" strokeWidth="1.5" />
      <text x="290" y="235" fill="var(--diagram-text-muted)" fontSize="11">x₁</text>
      <text x="105" y="50" fill="var(--diagram-text-muted)" fontSize="11">x₂</text>

      {/* Ellipse */}
      <ellipse cx="210" cy="130" rx="70" ry="30" fill="rgba(217, 119, 6,0.15)" stroke="#d97706" strokeWidth="2" transform="rotate(-30 210 130)" />

      {/* Principal Component Vector z1 */}
      <line x1="150" y1="165" x2="270" y2="95" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
      <text x="280" y="95" fill="#34d399" fontSize="13" fontWeight="bold">z₁ (1st Eigenvector)</text>
      <text x="210" y="75" fill="var(--diagram-text-muted)" fontSize="11">Rotates to maximum variance</text>
    </svg>
  );
}

// Figure 6.7: Fisher's LDA
function Fig6_7() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="80" y1="220" x2="480" y2="220" stroke="var(--diagram-axis)" strokeWidth="2" />
      {/* Projection Vector w */}
      <line x1="120" y1="210" x2="420" y2="70" stroke="#d97706" strokeWidth="3" />
      <text x="430" y="70" fill="#fbbf24" fontSize="13" fontWeight="bold">w (LDA Projection)</text>

      {/* Class 1 & 2 projected */}
      <circle cx="200" cy="172" r="8" fill="#3b82f6" />
      <text x="190" y="200" fill="#60a5fa" fontSize="12" fontWeight="bold">m₁</text>
      <circle cx="340" cy="107" r="8" fill="#ef4444" />
      <text x="340" y="95" fill="#f87171" fontSize="12" fontWeight="bold">m₂</text>

      <text x="270" y="50" fill="var(--diagram-text)" fontSize="12" fontWeight="bold" textAnchor="middle">
        Maximizes (m₁ − m₂)² / (s₁² + s₂²)
      </text>
    </svg>
  );
}

// Figure 7.1: Vector Quantization
function Fig7_1() {
  return (
    <svg viewBox="0 0 560 200" className="w-full max-w-lg select-none">
      <rect width="560" height="200" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Encoder Box */}
      <rect x="80" y="50" width="120" height="100" fill="#18181b" stroke="#d97706" strokeWidth="2" rx="10" />
      <text x="140" y="85" fill="var(--diagram-text)" fontSize="12" fontWeight="bold" textAnchor="middle">Encoder</text>
      <text x="140" y="110" fill="#fbbf24" fontSize="11" textAnchor="middle">Find closest m_i</text>

      {/* Channel */}
      <line x1="200" y1="100" x2="360" y2="100" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
      <text x="280" y="90" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">Index i (k bits)</text>

      {/* Decoder Box */}
      <rect x="360" y="50" width="120" height="100" fill="#18181b" stroke="#d97706" strokeWidth="2" rx="10" />
      <text x="420" y="85" fill="var(--diagram-text)" fontSize="12" fontWeight="bold" textAnchor="middle">Decoder</text>
      <text x="420" y="110" fill="#fbbf24" fontSize="11" textAnchor="middle">Lookup x&apos; = m_i</text>
    </svg>
  );
}

// Figure 7.2: k-Means Evolution
function Fig7_2() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* 3 Clusters */}
      {[[150, 130, '#3b82f6'], [300, 180, '#10b981'], [400, 100, '#f59e0b']].map(([cx, cy, col], i) => (
        <g key={i}>
          <circle cx={Number(cx)} cy={Number(cy)} r="45" fill="none" stroke={String(col)} strokeWidth="2" strokeDasharray="4,4" />
          <circle cx={Number(cx)} cy={Number(cy)} r="6" fill={String(col)} />
          <text x={Number(cx) + 12} y={Number(cy) + 5} fill={String(col)} fontSize="12" fontWeight="bold">m_{i+1}</text>
        </g>
      ))}
      <text x="280" y="40" fill="var(--diagram-text)" fontSize="13" fontWeight="bold" textAnchor="middle">
        Centroids iteratively minimize reconstruction error
      </text>
    </svg>
  );
}

// Figure 9.1: Decision Tree Partition
function Fig9_1() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* 2D Space partitioned */}
      <rect x="50" y="50" width="200" height="170" fill="none" stroke="var(--diagram-axis)" strokeWidth="1.5" />
      <line x1="150" y1="50" x2="150" y2="220" stroke="#d97706" strokeWidth="2.5" />
      <line x1="150" y1="130" x2="250" y2="130" stroke="#10b981" strokeWidth="2.5" />
      <text x="100" y="140" fill="#fbbf24" fontSize="12" fontWeight="bold">Class C₁</text>
      <text x="200" y="90" fill="#34d399" fontSize="12" fontWeight="bold">Class C₂</text>
      <text x="200" y="180" fill="#fbbf24" fontSize="12" fontWeight="bold">Class C₁</text>

      {/* Tree Node Structure */}
      <circle cx="380" cy="80" r="16" fill="#18181b" stroke="#d97706" strokeWidth="2" />
      <text x="380" y="84" fill="var(--diagram-text)" fontSize="10" textAnchor="middle">x₁ &gt; w₁₀</text>

      <line x1="370" y1="96" x2="330" y2="150" stroke="var(--diagram-axis)" strokeWidth="1.5" />
      <line x1="390" y1="96" x2="430" y2="150" stroke="var(--diagram-axis)" strokeWidth="1.5" />

      <rect x="310" y="150" width="40" height="24" fill="#d97706" rx="4" />
      <text x="330" y="166" fill="var(--diagram-text)" fontSize="11" fontWeight="bold" textAnchor="middle">C₁</text>

      <circle cx="430" cy="162" r="16" fill="#18181b" stroke="#10b981" strokeWidth="2" />
      <text x="430" y="166" fill="var(--diagram-text)" fontSize="10" textAnchor="middle">x₂ &gt; w₂₀</text>
    </svg>
  );
}

// Figure 10.1: Linear Discriminant Line
function Fig10_1() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="80" y1="220" x2="480" y2="220" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="80" y1="220" x2="80" y2="40" stroke="var(--diagram-axis)" strokeWidth="2" />
      {/* Hyperplane Line */}
      <line x1="140" y1="220" x2="380" y2="40" stroke="#d97706" strokeWidth="3" />
      <text x="410" y="55" fill="#fbbf24" fontSize="13" fontWeight="bold">wᵀx + w₀ = 0</text>
      <text x="180" y="100" fill="#60a5fa" fontSize="12" fontWeight="bold">g(x) &gt; 0 (Class 1)</text>
      <text x="350" y="180" fill="#f87171" fontSize="12" fontWeight="bold">g(x) &lt; 0 (Class 2)</text>
    </svg>
  );
}

// Figure 10.5: Sigmoid Function
function Fig10_5() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="60" y1="180" x2="500" y2="180" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="280" y1="220" x2="280" y2="40" stroke="var(--diagram-axis)" strokeWidth="2" />
      {/* S-curve */}
      <path d="M 80 178 C 220 178 240 60 480 60" fill="none" stroke="#10b981" strokeWidth="3.5" />
      <text x="420" y="50" fill="#34d399" fontSize="13" fontWeight="bold">y = 1</text>
      <text x="100" y="195" fill="var(--diagram-text-muted)" fontSize="13">y = 0</text>
      <text x="290" y="125" fill="#fbbf24" fontSize="12" fontWeight="bold">y = 0.5 (Threshold)</text>
    </svg>
  );
}

// Figure 11.1: Perceptron
function Fig11_1() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Input nodes */}
      {[120, 200, 280, 360].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={180} r="18" fill="#18181b" stroke="#d97706" strokeWidth="2" />
          <text x={x} y={185} fill="var(--diagram-text)" fontSize="11" textAnchor="middle">
            {i === 0 ? 'x₀=+1' : `x_${i}`}
          </text>
          {/* Connection to output */}
          <line x1={x} y1={162} x2={240} y2={78} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </g>
      ))}
      {/* Output node */}
      <circle cx={240} cy={60} r="22" fill="#b45309" stroke="#fbbf24" strokeWidth="2.5" />
      <text x={240} y={65} fill="var(--diagram-text)" fontSize="14" fontWeight="bold" textAnchor="middle">y</text>
      <text x="380" y="65" fill="#fcd34d" fontSize="12" fontWeight="bold">y = wᵀx + w₀</text>
    </svg>
  );
}

// Figure 11.4: Perceptron solving AND
function Fig11_4() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="120" y1="200" x2="360" y2="200" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="120" y1="200" x2="120" y2="40" stroke="var(--diagram-axis)" strokeWidth="2" />
      <text x="350" y="220" fill="var(--diagram-text-muted)" fontSize="11">x₁</text>
      <text x="100" y="50" fill="var(--diagram-text-muted)" fontSize="11">x₂</text>

      {/* (0,0), (0,1), (1,0) are 0 */}
      <circle cx="120" cy="200" r="7" fill="#ef4444" />
      <circle cx="120" cy="100" r="7" fill="#ef4444" />
      <circle cx="220" cy="200" r="7" fill="#ef4444" />

      {/* (1,1) is 1 */}
      <circle cx="220" cy="100" r="8" fill="#10b981" />
      <text x="235" y="95" fill="#34d399" fontSize="12" fontWeight="bold">(1, 1) = True</text>

      {/* Separating line x1 + x2 = 1.5 */}
      <line x1="100" y1="70" x2="250" y2="220" stroke="#d97706" strokeWidth="2.5" />
      <text x="220" y="60" fill="#fbbf24" fontSize="11" fontWeight="bold">x₁ + x₂ − 1.5 = 0</text>
    </svg>
  );
}

// Figure 11.5: XOR Not Linearly Separable
function Fig11_5() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="140" y1="200" x2="360" y2="200" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="140" y1="200" x2="140" y2="40" stroke="var(--diagram-axis)" strokeWidth="2" />

      {/* (0,0)=0, (1,1)=0 */}
      <circle cx="140" cy="200" r="7" fill="#ef4444" />
      <circle cx="260" cy="80" r="7" fill="#ef4444" />
      <text x="120" y="220" fill="#f87171" fontSize="11">(0,0)=0</text>
      <text x="275" y="80" fill="#f87171" fontSize="11">(1,1)=0</text>

      {/* (0,1)=1, (1,0)=1 */}
      <circle cx="140" cy="80" r="8" fill="#10b981" />
      <circle cx="260" cy="200" r="8" fill="#10b981" />
      <text x="120" y="70" fill="#34d399" fontSize="11">(0,1)=1</text>
      <text x="275" y="215" fill="#34d399" fontSize="11">(1,0)=1</text>

      <text x="320" y="140" fill="#f59e0b" fontSize="13" fontWeight="bold">
        Cannot separate with a single line!
      </text>
    </svg>
  );
}

// Figure 11.6: Multilayer Perceptron
function Fig11_6() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* 3 Input nodes */}
      {[140, 200, 260].map((y, i) => (
        <circle key={i} cx="100" cy={y} r="16" fill="#18181b" stroke="var(--diagram-axis)" strokeWidth="2" />
      ))}
      <text x="100" y="26" fill="var(--diagram-text-muted)" fontSize="11" textAnchor="middle">Input x</text>

      {/* 4 Hidden nodes */}
      {[80, 130, 180, 230].map((y, i) => (
        <circle key={i} cx="280" cy={y} r="16" fill="#18181b" stroke="#d97706" strokeWidth="2" />
      ))}
      <text x="280" y="26" fill="#fbbf24" fontSize="11" textAnchor="middle">Hidden z_h</text>

      {/* 2 Output nodes */}
      {[130, 180].map((y, i) => (
        <circle key={i} cx="460" cy={y} r="16" fill="#18181b" stroke="#10b981" strokeWidth="2" />
      ))}
      <text x="460" y="26" fill="#34d399" fontSize="11" textAnchor="middle">Output y_i</text>

      {/* Connectors */}
      {[140, 200, 260].map((y1) =>
        [80, 130, 180, 230].map((y2, j) => (
          <line key={`${y1}-${j}`} x1="116" y1={y1} x2="264" y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))
      )}
      {[80, 130, 180, 230].map((y1) =>
        [130, 180].map((y2, j) => (
          <line key={`h-${y1}-${j}`} x1="296" y1={y1} x2="444" y2={y2} stroke="rgba(217, 119, 6,0.25)" strokeWidth="1" />
        ))
      )}
    </svg>
  );
}

// Figure 13.1: SVM Maximum Margin
function Fig13_1() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Hyperplane */}
      <line x1="120" y1="210" x2="420" y2="50" stroke="#ffffff" strokeWidth="3" />
      <text x="430" y="50" fill="var(--diagram-text)" fontSize="12" fontWeight="bold">wᵀx + w₀ = 0</text>

      {/* Margins */}
      <line x1="80" y1="180" x2="380" y2="20" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4,4" />
      <line x1="160" y1="240" x2="460" y2="80" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4,4" />

      {/* Support Vectors (Circled) */}
      <circle cx="230" cy="100" r="12" fill="none" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="230" cy="100" r="5" fill="#3b82f6" />
      <text x="180" y="90" fill="#fbbf24" fontSize="11" fontWeight="bold">Support Vector</text>

      <circle cx="310" cy="160" r="12" fill="none" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="310" cy="160" r="5" fill="#ef4444" />

      {/* Margin Distance indicator */}
      <line x1="230" y1="100" x2="270" y2="120" stroke="#f59e0b" strokeWidth="2" />
      <text x="290" y="115" fill="#fbbf24" fontSize="12" fontWeight="bold">Margin = 2/||w||</text>
    </svg>
  );
}

// Figure 13.2: Soft Margin SVM with Slacks
function Fig13_2() {
  return (
    <svg viewBox="0 0 560 260" className="w-full max-w-lg select-none">
      <rect width="560" height="260" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="120" y1="220" x2="420" y2="40" stroke="#ffffff" strokeWidth="2.5" />
      <line x1="80" y1="180" x2="380" y2="0" stroke="#d97706" strokeDasharray="4,4" />
      <line x1="160" y1="260" x2="460" y2="80" stroke="#d97706" strokeDasharray="4,4" />

      {/* Outlier with slack */}
      <circle cx="340" cy="130" r="7" fill="#ef4444" />
      <line x1="340" y1="130" x2="310" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
      <text x="355" y="135" fill="#f87171" fontSize="11" fontWeight="bold">ξ_t &gt; 0 (Slack Penalty)</text>
    </svg>
  );
}

// Figure 13.6: Loss Functions
function Fig13_6() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <line x1="60" y1="200" x2="500" y2="200" stroke="var(--diagram-axis)" strokeWidth="2" />
      <line x1="280" y1="220" x2="280" y2="20" stroke="var(--diagram-axis)" strokeWidth="2" />

      {/* Hinge loss */}
      <path d="M 100 20 L 280 200 L 480 200" fill="none" stroke="#d97706" strokeWidth="3" />
      <text x="140" y="40" fill="#fbbf24" fontSize="12" fontWeight="bold">Hinge Loss: max(0, 1 - y*r)</text>

      {/* 0/1 loss */}
      <path d="M 100 80 L 280 80 L 280 200 L 480 200" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
      <text x="140" y="95" fill="#f87171" fontSize="11">0/1 Loss</text>

      {/* Squared error */}
      <path d="M 100 20 Q 280 200 460 20" fill="none" stroke="#10b981" strokeWidth="2" />
      <text x="360" y="40" fill="#34d399" fontSize="11">Squared Error (1 - y)²</text>
    </svg>
  );
}

// Figure 16.1: Bayesian Network (Rain -> Wet Grass)
function Fig16_1() {
  return (
    <svg viewBox="0 0 560 200" className="w-full max-w-lg select-none">
      <rect width="560" height="200" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Node Rain */}
      <circle cx="280" cy="50" r="28" fill="#18181b" stroke="#3b82f6" strokeWidth="2.5" />
      <text x="280" y="55" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">Rain (R)</text>
      <text x="360" y="55" fill="var(--diagram-text-muted)" fontSize="11">P(R) = 0.4</text>

      {/* Directed Arc */}
      <line x1="280" y1="78" x2="280" y2="130" stroke="#d97706" strokeWidth="2.5" markerEnd="url(#arrow)" />

      {/* Node Wet Grass */}
      <circle cx="280" cy="155" r="28" fill="#18181b" stroke="#10b981" strokeWidth="2.5" />
      <text x="280" y="160" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">Wet grass</text>
      <text x="380" y="150" fill="var(--diagram-text-muted)" fontSize="10">P(W|R) = 0.9</text>
      <text x="380" y="168" fill="var(--diagram-text-muted)" fontSize="10">P(W|~R) = 0.2</text>
    </svg>
  );
}

// Figure 18.1: Reinforcement Learning Loop
function Fig18_1() {
  return (
    <svg viewBox="0 0 560 220" className="w-full max-w-lg select-none">
      <rect width="560" height="220" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Environment Box */}
      <rect x="200" y="20" width="160" height="50" fill="#18181b" stroke="#d97706" strokeWidth="2" rx="8" />
      <text x="280" y="50" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">ENVIRONMENT</text>

      {/* Agent Box */}
      <rect x="200" y="150" width="160" height="50" fill="#18181b" stroke="#10b981" strokeWidth="2" rx="8" />
      <text x="280" y="180" fill="#34d399" fontSize="13" fontWeight="bold" textAnchor="middle">AGENT (Policy π)</text>

      {/* Action Arrow (Agent -> Env) */}
      <path d="M 330 150 C 420 150 420 70 330 70" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <text x="440" y="115" fill="#fbbf24" fontSize="12" fontWeight="bold">Action (a_t)</text>

      {/* State & Reward Arrows (Env -> Agent) */}
      <path d="M 230 70 C 140 70 140 150 230 150" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      <text x="90" y="105" fill="#60a5fa" fontSize="12" fontWeight="bold">State (s_t)</text>
      <text x="90" y="125" fill="#10b981" fontSize="12" fontWeight="bold">Reward (r_t)</text>
    </svg>
  );
}

// Figure 19.3: ROC Curve & AUC
function Fig19_3() {
  return (
    <svg viewBox="0 0 560 240" className="w-full max-w-lg select-none">
      <rect width="560" height="240" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      <rect x="100" y="30" width="200" height="170" fill="none" stroke="var(--diagram-axis)" strokeWidth="1.5" />

      {/* Diagonal random line */}
      <line x1="100" y1="200" x2="300" y2="30" stroke="var(--diagram-axis)" strokeWidth="1.5" strokeDasharray="3,3" />
      <text x="240" y="140" fill="var(--diagram-text-muted)" fontSize="10">Random (AUC=0.5)</text>

      {/* Convex ROC curve */}
      <path d="M 100 200 Q 110 50 300 30" fill="rgba(217, 119, 6,0.2)" stroke="#d97706" strokeWidth="3" />
      <text x="140" y="70" fill="#fbbf24" fontSize="13" fontWeight="bold">Classifier ROC (AUC = 0.92)</text>

      {/* Axis labels */}
      <text x="200" y="225" fill="var(--diagram-text-muted)" fontSize="11" textAnchor="middle">False Positive Rate (fp-rate)</text>
      <text x="50" y="120" fill="var(--diagram-text-muted)" fontSize="11" textAnchor="middle" transform="rotate(-90 50 120)">
        True Positive Rate (tp-rate)
      </text>
    </svg>
  );
}

// Figure 19.4: Precision & Recall Venn Diagram
function Fig19_4() {
  return (
    <svg viewBox="0 0 560 220" className="w-full max-w-lg select-none">
      <rect width="560" height="220" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />
      {/* Retrieved Circle */}
      <circle cx="230" cy="110" r="65" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="2.5" />
      <text x="180" y="115" fill="#60a5fa" fontSize="12" fontWeight="bold">Retrieved (R)</text>

      {/* Relevant Circle */}
      <circle cx="330" cy="110" r="65" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2.5" />
      <text x="370" y="115" fill="#34d399" fontSize="12" fontWeight="bold">Relevant (L)</text>

      {/* Overlap True Positives */}
      <text x="280" y="115" fill="var(--diagram-text)" fontSize="11" fontWeight="bold" textAnchor="middle">
        TP (a)
      </text>
      <text x="280" y="195" fill="var(--diagram-text-muted)" fontSize="11" textAnchor="middle">
        Precision = a / (a + b) · Recall = a / (a + c)
      </text>
    </svg>
  );
}

// Fallback technical blueprint for any other figures in the book
function GenericSchematic({ id }: { id: string }) {
  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-sm">
      <div className="inline-flex p-3 rounded-2xl bg-amber-950/60 border border-amber-900 text-amber-400">
        <Sparkles className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Figure {id} Technical Model</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Algorithmic model diagram reconstructed from Ethem Alpaydın&apos;s <em>Introduction to Machine Learning</em> (MIT Press).
        </p>
      </div>
    </div>
  );
}
