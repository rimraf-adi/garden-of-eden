'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function Chapter1Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'classification' | 'regression' | 'clustering'>('classification');
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // Fixed points for regression
    const regPoints = [
      { x: 0.15, y: 0.75 },
      { x: 0.25, y: 0.68 },
      { x: 0.35, y: 0.62 },
      { x: 0.45, y: 0.50 },
      { x: 0.55, y: 0.44 },
      { x: 0.68, y: 0.35 },
      { x: 0.80, y: 0.28 },
      { x: 0.88, y: 0.20 },
    ];

    // Data for classification
    const classPos = [
      { x: 0.65, y: 0.25 },
      { x: 0.72, y: 0.35 },
      { x: 0.80, y: 0.20 },
      { x: 0.78, y: 0.45 },
      { x: 0.85, y: 0.30 },
      { x: 0.60, y: 0.40 },
    ];
    const classNeg = [
      { x: 0.20, y: 0.70 },
      { x: 0.30, y: 0.80 },
      { x: 0.25, y: 0.55 },
      { x: 0.35, y: 0.65 },
      { x: 0.45, y: 0.85 },
      { x: 0.15, y: 0.82 },
    ];

    // Clusters
    const cluster1 = [{ x: 0.25, y: 0.3 }, { x: 0.3, y: 0.25 }, { x: 0.22, y: 0.35 }, { x: 0.28, y: 0.32 }];
    const cluster2 = [{ x: 0.75, y: 0.3 }, { x: 0.8, y: 0.25 }, { x: 0.72, y: 0.35 }, { x: 0.78, y: 0.32 }];
    const cluster3 = [{ x: 0.5, y: 0.75 }, { x: 0.55, y: 0.8 }, { x: 0.48, y: 0.72 }, { x: 0.52, y: 0.82 }];

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.02;
      }
      const t = timeRef.current;
      // Loop phase: 0 to 1 every ~6 seconds
      const loop = (Math.sin(t) + 1) / 2;

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Background Grid
      ctx.strokeStyle = isDark ? 'rgba(150, 150, 180, 0.12)' : 'rgba(226, 232, 240, 0.85)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Axes
      ctx.strokeStyle = isDark ? 'rgba(100, 116, 139, 0.4)' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, height - 30);
      ctx.lineTo(width - 30, height - 30);
      ctx.moveTo(50, height - 30);
      ctx.lineTo(50, 30);
      ctx.stroke();

      if (mode === 'classification') {
        // Axis Labels
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText('Income (x₁) →', width - 110, height - 12);
        ctx.save();
        ctx.translate(25, 120);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Savings (x₂) →', 0, 0);
        ctx.restore();

        // Animated Decision Boundary (moving threshold)
        const thresholdX = 50 + (width - 100) * (0.45 + 0.08 * Math.sin(t * 1.5));
        const thresholdY = 30 + (height - 80) * (0.50 + 0.08 * Math.cos(t * 1.5));

        // Shaded decision regions
        ctx.fillStyle = 'rgba(217, 119, 6, 0.08)'; // Low Risk
        ctx.fillRect(thresholdX, 30, width - 30 - thresholdX, thresholdY - 30);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.06)'; // High Risk
        ctx.fillRect(50, thresholdY, thresholdX - 50, height - 30 - thresholdY);

        // Discriminant lines (Alpaydın Fig 1.1)
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(thresholdX, 30);
        ctx.lineTo(thresholdX, thresholdY);
        ctx.lineTo(width - 30, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Region labels
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Low-Risk (Accepted)', thresholdX + 15, 60);

        ctx.fillStyle = '#dc2626';
        ctx.fillText('High-Risk (Default)', 65, height - 50);

        // Threshold markers
        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`θ₁`, thresholdX - 6, height - 12);
        ctx.fillText(`θ₂`, 30, thresholdY + 4);

        // Draw Positive Points (+)
        classPos.forEach((p) => {
          const px = 50 + (width - 100) * p.x;
          const py = 30 + (height - 80) * p.y;
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(px - 6, py);
          ctx.lineTo(px + 6, py);
          ctx.moveTo(px, py - 6);
          ctx.lineTo(px, py + 6);
          ctx.stroke();

          // Subtle pulse ring
          ctx.beginPath();
          ctx.arc(px, py, 10 + 2 * Math.sin(t * 2), 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
          ctx.stroke();
        });

        // Draw Negative Points (-)
        classNeg.forEach((p) => {
          const px = 50 + (width - 100) * p.x;
          const py = 30 + (height - 80) * p.y;
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(px - 6, py);
          ctx.lineTo(px + 6, py);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 10 + 2 * Math.cos(t * 2), 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.stroke();
        });
      } else if (mode === 'regression') {
        // Used Car Price vs Mileage (Fig 1.2)
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText('Car Mileage (x) →', width - 130, height - 12);
        ctx.save();
        ctx.translate(25, 120);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Price (y) →', 0, 0);
        ctx.restore();

        // Fitted Line: y = w1*x + w0
        // Line shifts smoothly as if learning
        const slopeProgress = 0.5 + 0.5 * Math.sin(t);
        const w0 = 0.85;
        const w1 = -0.7 + 0.15 * Math.sin(t * 1.2);

        const xStart = 50;
        const yStart = 30 + (height - 80) * (1 - (w0 + w1 * 0.1));
        const xEnd = width - 40;
        const yEnd = 30 + (height - 80) * (1 - (w0 + w1 * 0.95));

        // Draw regression line
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        // Draw points and residuals
        regPoints.forEach((p) => {
          const px = 50 + (width - 100) * p.x;
          const py = 30 + (height - 80) * (1 - p.y);
          const lineY = 30 + (height - 80) * (1 - (w0 + w1 * p.x));

          // Residual error line
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, lineY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Point
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#065f46';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // Equation overlay
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`y = ${w1.toFixed(2)}x + ${w0.toFixed(2)} [E(w|X) minimized]`, 70, 50);
      } else if (mode === 'clustering') {
        // 3 Clusters with Centroids converging (Fig 7.2 / Ch 1 Unsupervised)
        const allClusters = [
          { pts: cluster1, color: '#3b82f6', target: { x: 0.26, y: 0.3 } },
          { pts: cluster2, color: '#8b5cf6', target: { x: 0.76, y: 0.3 } },
          { pts: cluster3, color: '#f59e0b', target: { x: 0.51, y: 0.77 } },
        ];

        allClusters.forEach((cl, cIdx) => {
          // Centroid wanders slightly and re-centers (simulating iterative k-means)
          const cx = 50 + (width - 100) * (cl.target.x + 0.05 * Math.sin(t * 1.8 + cIdx));
          const cy = 30 + (height - 80) * (cl.target.y + 0.04 * Math.cos(t * 1.8 + cIdx));

          // Draw cluster boundary circle
          ctx.strokeStyle = `${cl.color}40`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, 55 + 5 * Math.sin(t * 2 + cIdx), 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw points in cluster
          cl.pts.forEach((p) => {
            const px = 50 + (width - 100) * p.x;
            const py = 30 + (height - 80) * p.y;

            // Connection to centroid
            ctx.strokeStyle = `${cl.color}25`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(cx, cy);
            ctx.stroke();

            ctx.fillStyle = cl.color;
            ctx.beginPath();
            ctx.arc(px, py, 4.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // Draw Centroid (Cross)
          ctx.strokeStyle = cl.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy - 8);
          ctx.lineTo(cx + 8, cy + 8);
          ctx.moveTo(cx + 8, cy - 8);
          ctx.lineTo(cx - 8, cy + 8);
          ctx.stroke();

          ctx.fillStyle = cl.color;
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`m${cIdx + 1}`, cx + 10, cy - 10);
        });

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText('Unsupervised Density Clustering: Centroids m_i iteratively minimize reconstruction error', 60, height - 12);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, mode]);

  return (
    <div className="rounded-3xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 overflow-hidden shadow-xl my-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Loopable Interactive Visual · Chapter 1: The Three ML Paradigms
          </h4>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('classification')}
            className={`px-3 py-1 rounded-lg transition ${
              mode === 'classification'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            1. Classification
          </button>
          <button
            onClick={() => setMode('regression')}
            className={`px-3 py-1 rounded-lg transition ${
              mode === 'regression'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            2. Regression
          </button>
          <button
            onClick={() => setMode('clustering')}
            className={`px-3 py-1 rounded-lg transition ${
              mode === 'clustering'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            3. Clustering
          </button>
        </div>

        {/* Play / pause controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
            title={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              timeRef.current = 0;
            }}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
            title="Reset loop"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Canvas viewport */}
      <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-zinc-950 flex justify-center items-center border-y border-zinc-200/80 dark:border-zinc-800">
        <canvas ref={canvasRef} className="w-full max-w-3xl rounded-xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950" />
      </div>

      {/* Caption Footer */}
      <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p>
          {mode === 'classification' && (
            <>
              <strong>Figure 1.1 Emulation:</strong> Separating low-risk (+) and high-risk (−) loan applicants using dynamic decision thresholds θ₁ and θ₂.
            </>
          )}
          {mode === 'regression' && (
            <>
              <strong>Figure 1.2 Emulation:</strong> Linear model <em>y = w₁x + w₀</em> continuously fitting car price vs mileage while minimizing sum of squared errors.
            </>
          )}
          {mode === 'clustering' && (
            <>
              <strong>Figure 7.2 Emulation:</strong> Online k-means centroid updates continuously moving reference vectors <em>m_i</em> to the centers of mass.
            </>
          )}
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
