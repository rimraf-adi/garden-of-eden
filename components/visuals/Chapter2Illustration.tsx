'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, ShieldCheck, Target, Layers } from 'lucide-react';

export default function Chapter2Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'version-space' | 'max-margin' | 'online-learning'>('version-space');
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Positive samples (Family Cars: moderate price, moderate engine power)
  const positivePoints = [
    { x: 0.38, y: 0.44 },
    { x: 0.48, y: 0.38 },
    { x: 0.42, y: 0.58 },
    { x: 0.56, y: 0.50 },
    { x: 0.50, y: 0.62 },
    { x: 0.62, y: 0.45 },
    { x: 0.45, y: 0.48 },
    { x: 0.58, y: 0.58 },
  ];

  // Negative samples (Luxury sports cars or economy subcompacts)
  const negativePoints = [
    { x: 0.18, y: 0.25 },
    { x: 0.22, y: 0.60 },
    { x: 0.28, y: 0.82 },
    { x: 0.42, y: 0.85 },
    { x: 0.72, y: 0.78 },
    { x: 0.82, y: 0.62 },
    { x: 0.85, y: 0.35 },
    { x: 0.75, y: 0.22 },
    { x: 0.52, y: 0.18 },
    { x: 0.32, y: 0.20 },
  ];

  // Static tight bounds (S) and general bounds (G) in normalized coords [0, 1]
  const baseS = { x1: 0.38, y1: 0.38, x2: 0.62, y2: 0.62 };
  const baseG = { x1: 0.29, y1: 0.26, x2: 0.71, y2: 0.76 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let displayWidth = canvas.parentElement?.clientWidth || 700;
    let displayHeight = 380;

    const resize = () => {
      if (!canvas) return;
      displayWidth = canvas.parentElement?.clientWidth || 700;
      displayHeight = 380;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.02;
      }
      const t = timeRef.current;

      const padX = 75;
      const padY = 40;
      const plotW = displayWidth - padX - 45;
      const plotH = displayHeight - padY - 45;

      const toCanvasX = (nx: number) => padX + nx * plotW;
      const toCanvasY = (ny: number) => padY + (1 - ny) * plotH;

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Subtle background grid
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(226, 232, 240, 0.85)';
      ctx.lineWidth = 1;
      const gridSteps = 10;
      for (let i = 0; i <= gridSteps; i++) {
        const gx = padX + (i / gridSteps) * plotW;
        const gy = padY + (i / gridSteps) * plotH;
        ctx.beginPath();
        ctx.moveTo(gx, padY);
        ctx.lineTo(gx, padY + plotH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padX, gy);
        ctx.lineTo(padX + plotW, gy);
        ctx.stroke();
      }

      // Axes lines
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padX, padY);
      ctx.lineTo(padX, padY + plotH);
      ctx.lineTo(padX + plotW, padY + plotH);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '500 12px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('Price (p) →', padX + plotW - 70, padY + plotH + 28);

      ctx.save();
      ctx.translate(24, padY + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Engine Power (e) →', 0, 0);
      ctx.restore();

      // Pulsing or animated values for S and G
      let sX1 = baseS.x1;
      let sY1 = baseS.y1;
      let sX2 = baseS.x2;
      let sY2 = baseS.y2;

      let gX1 = baseG.x1;
      let gY1 = baseG.y1;
      let gX2 = baseG.x2;
      let gY2 = baseG.y2;

      let activePosCount = positivePoints.length;
      let activeNegCount = negativePoints.length;

      if (mode === 'online-learning') {
        // Stream of 6 training steps repeating every 10 seconds
        const cycle = (t % 12) / 12; // 0 to 1
        const step = Math.min(Math.floor(cycle * 6), 5);

        // Gradually reveal points and adapt bounds
        activePosCount = Math.min(2 + step, positivePoints.length);
        activeNegCount = Math.min(2 + step, negativePoints.length);

        const progress = (cycle * 6) % 1;
        const expandFactor = 0.05 * Math.sin(progress * Math.PI);

        sX1 = 0.44 - step * 0.015 - expandFactor;
        sY1 = 0.45 - step * 0.015 - expandFactor;
        sX2 = 0.52 + step * 0.02 + expandFactor;
        sY2 = 0.52 + step * 0.02 + expandFactor;

        gX1 = 0.24 + step * 0.01;
        gY1 = 0.20 + step * 0.012;
        gX2 = 0.78 - step * 0.015;
        gY2 = 0.82 - step * 0.012;
      } else if (mode === 'version-space') {
        // Subtle breathing effect on intermediate hypotheses
        const breathe = 0.008 * Math.sin(t * 1.5);
        sX1 = baseS.x1 - breathe;
        sY1 = baseS.y1 - breathe;
        sX2 = baseS.x2 + breathe;
        sY2 = baseS.y2 + breathe;
      }

      // Convert rectangle bounds to canvas coordinates
      // Note: y in canvas is inverted (1 - y)
      const sLeft = toCanvasX(sX1);
      const sRight = toCanvasX(sX2);
      const sTop = toCanvasY(sY2);
      const sBottom = toCanvasY(sY1);

      const gLeft = toCanvasX(gX1);
      const gRight = toCanvasX(gX2);
      const gTop = toCanvasY(gY2);
      const gBottom = toCanvasY(gY1);

      // --- 1. Version Space Shading (Area between G and S) ---
      // Draw G filled with translucent indigo
      ctx.fillStyle = 'rgba(217, 119, 6, 0.14)';
      ctx.fillRect(gLeft, gTop, gRight - gLeft, gBottom - gTop);

      // Clear the S inner area from version space
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.fillRect(sLeft, sTop, sRight - sLeft, sBottom - sTop);

      // Version Space hatched pattern lines in the difference region (G \ S)
      ctx.save();
      ctx.beginPath();
      ctx.rect(gLeft, gTop, gRight - gLeft, gBottom - gTop);
      ctx.rect(sLeft, sTop, sRight - sLeft, sBottom - sTop);
      // EvenOdd clipping to clip S out of G
      ctx.clip('evenodd');

      ctx.strokeStyle = 'rgba(129, 140, 248, 0.18)';
      ctx.lineWidth = 1;
      const stripeSpacing = 16;
      for (let sx = gLeft - gBottom; sx < gRight + gBottom; sx += stripeSpacing) {
        ctx.beginPath();
        ctx.moveTo(sx, gBottom);
        ctx.lineTo(sx + (gBottom - gTop), gTop);
        ctx.stroke();
      }
      ctx.restore();

      // --- 2. Draw Most General Hypothesis G (Outer Rectangle) ---
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 5]);
      ctx.strokeRect(gLeft, gTop, gRight - gLeft, gBottom - gTop);
      ctx.setLineDash([]);

      // Label for G
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillText('G: Most General', gLeft + 10, gTop - 8);

      // --- 3. Draw Most Specific Hypothesis S (Inner Rectangle) ---
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(sLeft, sTop, sRight - sLeft, sBottom - sTop);

      // Label for S
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillText('S: Most Specific', sLeft + 8, sBottom - 10);

      // --- 4. Intermediate Hypothesis / Maximum Margin Hypothesis (h) ---
      const hLeft = (sLeft + gLeft) / 2;
      const hRight = (sRight + gRight) / 2;
      const hTop = (sTop + gTop) / 2;
      const hBottom = (sBottom + gBottom) / 2;

      if (mode === 'version-space') {
        // Dynamic consistent hypothesis sweeping inside Version Space
        const alpha = 0.5 + 0.45 * Math.sin(t * 1.8);
        const curLeft = sLeft + (gLeft - sLeft) * alpha;
        const curRight = sRight + (gRight - sRight) * alpha;
        const curTop = sTop + (gTop - sTop) * alpha;
        const curBottom = sBottom + (gBottom - sBottom) * alpha;

        ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(curLeft, curTop, curRight - curLeft, curBottom - curTop);
        ctx.setLineDash([]);

        ctx.fillStyle = '#f472b6';
        ctx.font = '600 11px ui-sans-serif, system-ui';
        ctx.fillText('Consistent h ∈ VS(H)', curRight - 120, curTop + 16);
      }

      if (mode === 'max-margin') {
        // Highlight Maximum Margin h = (S + G) / 2
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.strokeRect(hLeft, hTop, hRight - hLeft, hBottom - hTop);

        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText('h: Max Margin [h = (S + G)/2]', hLeft + 10, hTop + 18);

        // Draw Margin arrows (ρ) on the 4 borders
        const drawMarginArrow = (x1: number, y1: number, x2: number, y2: number, label: string) => {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Arrow heads
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          ctx.fillStyle = '#38bdf8';
          ctx.font = '10px ui-monospace, monospace';
          ctx.fillText(label, midX + 3, midY - 3);
        };

        // Left margin
        const midY = (hTop + hBottom) / 2;
        drawMarginArrow(gLeft, midY, sLeft, midY, '2ρ₁');

        // Right margin
        drawMarginArrow(sRight, midY, gRight, midY, '2ρ₁');

        // Top margin
        const midX = (hLeft + hRight) / 2;
        drawMarginArrow(midX, gTop, midX, sTop, '2ρ₂');

        // Bottom margin
        drawMarginArrow(midX, sBottom, midX, gBottom, '2ρ₂');
      }

      // --- 5. Draw Positive Points (Family Cars '+') ---
      for (let i = 0; i < activePosCount; i++) {
        const p = positivePoints[i];
        const px = toCanvasX(p.x);
        const py = toCanvasY(p.y);

        // Glow ring
        ctx.beginPath();
        ctx.arc(px, py, 9 + 2 * Math.sin(t * 3 + i), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();

        // Plus mark
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px - 5, py);
        ctx.lineTo(px + 5, py);
        ctx.moveTo(px, py - 5);
        ctx.lineTo(px, py + 5);
        ctx.stroke();
      }

      // --- 6. Draw Negative Points (Non-Family Cars '−') ---
      for (let i = 0; i < activeNegCount; i++) {
        const p = negativePoints[i];
        const px = toCanvasX(p.x);
        const py = toCanvasY(p.y);

        // Glow ring
        ctx.beginPath();
        ctx.arc(px, py, 9 + 2 * Math.cos(t * 3 + i), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fill();

        // Minus mark
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px - 5, py);
        ctx.lineTo(px + 5, py);
        ctx.stroke();
      }

      // Legend in top-right corner
      const legX = displayWidth - 190;
      const legY = padY + 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(legX - 10, legY - 14, 155, 78, 8);
      ctx.fill();
      ctx.stroke();

      // Legend items
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(legX, legY);
      ctx.lineTo(legX + 8, legY);
      ctx.moveTo(legX + 4, legY - 4);
      ctx.lineTo(legX + 4, legY + 4);
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px ui-sans-serif, system-ui';
      ctx.fillText('Positive (+): Family Car', legX + 16, legY + 3);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(legX, legY + 20);
      ctx.lineTo(legX + 8, legY + 20);
      ctx.stroke();
      ctx.fillText('Negative (−): Non-Family', legX + 16, legY + 23);

      ctx.fillStyle = 'rgba(217, 119, 6, 0.5)';
      ctx.fillRect(legX, legY + 36, 10, 8);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.strokeRect(legX, legY + 36, 10, 8);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('Version Space VS(H)', legX + 16, legY + 44);

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Interactive Visual · Chapter 2: Version Space & Hypothesis Bounds
          </h4>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('version-space')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'version-space'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            1. Version Space (S vs G)
          </button>
          <button
            onClick={() => setMode('max-margin')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'max-margin'
                ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            2. Max Margin h
          </button>
          <button
            onClick={() => setMode('online-learning')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'online-learning'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            3. Sequential Updates
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
          {mode === 'version-space' && (
            <>
              <strong>Alpaydın Figures 2.2 – 2.4:</strong> Most Specific hypothesis <em>S</em> (green) tightly bounds all positive instances (+). Most General hypothesis <em>G</em> (purple) extends to the negative boundaries (−). The shaded region is the <em>Version Space</em> containing all consistent hypotheses.
            </>
          )}
          {mode === 'max-margin' && (
            <>
              <strong>Alpaydın Figure 2.5:</strong> The maximum margin hypothesis <em>h = (S + G)/2</em> sits symmetrically halfway between <em>S</em> and <em>G</em>, maximizing the clearance margin <em>2ρ</em> to reduce generalization error.
            </>
          )}
          {mode === 'online-learning' && (
            <>
              <strong>Candidate Elimination Algorithm:</strong> As positive instances (+) arrive, <em>S</em> generalizes outward. As negative instances (−) arrive, <em>G</em> specializes inward until the version space shrinks.
            </>
          )}
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
