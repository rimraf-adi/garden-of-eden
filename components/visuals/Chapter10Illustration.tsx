'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, TrendingUp, Sliders, Activity } from 'lucide-react';

export default function Chapter10Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'gradient' | 'sigmoid' | 'geometry'>('gradient');
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 760;
    let height = 380;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const newWidth = Math.max(rect.width, 320);
      width = newWidth;
      height = 380;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Two classes of 2D data points (normalized to [-1, 1] x [-1, 1])
    // Class 1 (r = 1, Cyan): Top-right cluster
    const class1 = [
      { x: 0.35, y: 0.45 },
      { x: 0.55, y: 0.65 },
      { x: 0.25, y: 0.70 },
      { x: 0.65, y: 0.35 },
      { x: 0.40, y: 0.80 },
      { x: 0.70, y: 0.60 },
      { x: 0.50, y: 0.30 },
      { x: 0.75, y: 0.40 },
    ];

    // Class 2 (r = 0, Rose): Bottom-left cluster
    const class2 = [
      { x: -0.40, y: -0.30 },
      { x: -0.60, y: -0.50 },
      { x: -0.25, y: -0.65 },
      { x: -0.55, y: -0.20 },
      { x: -0.70, y: -0.40 },
      { x: -0.35, y: -0.75 },
      { x: -0.20, y: -0.40 },
      { x: -0.65, y: -0.65 },
    ];

    // Sigmoid math function
    const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(Math.min(z, 12), -12)));

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.018;
      }
      const t = timeRef.current;
      const dpr = window.devicePixelRatio || 1;

      ctx.save();
      ctx.scale(dpr, dpr);
      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = 30;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Split canvas layout:
      // Left 52%: 2D Hyperplane separation & Gradient Descent
      // Right 48%: Sigmoid projection & Cross-entropy loss curve
      const isMobile = width < 640;
      const leftW = isMobile ? width : Math.floor(width * 0.52);
      const rightW = isMobile ? width : width - leftW;

      // -------------------------------------------------------------
      // Left Panel: 2D Feature Space (Alpaydın Fig 10.1 & 10.7)
      // -------------------------------------------------------------
      const spaceMargin = { left: 45, right: 25, top: 40, bottom: 45 };
      const plotW = leftW - spaceMargin.left - spaceMargin.right;
      const plotH = height - spaceMargin.top - spaceMargin.bottom;

      // Coordinate mapping from [-1, 1] to screen
      const toScreenX = (x: number) => spaceMargin.left + ((x + 1) / 2) * plotW;
      const toScreenY = (y: number) => spaceMargin.top + ((1 - y) / 2) * plotH;

      // Title
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Feature Space: wᵀx + w₀ = 0 (Fig 10.1)', spaceMargin.left, spaceMargin.top - 18);

      // Axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Y-axis (x1 = 0)
      ctx.moveTo(toScreenX(0), spaceMargin.top - 5);
      ctx.lineTo(toScreenX(0), spaceMargin.top + plotH + 5);
      // X-axis (x2 = 0)
      ctx.moveTo(spaceMargin.left - 5, toScreenY(0));
      ctx.lineTo(spaceMargin.left + plotW + 5, toScreenY(0));
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '11px sans-serif';
      ctx.fillText('x₁ →', spaceMargin.left + plotW - 20, toScreenY(0) + 16);
      ctx.fillText('x₂ →', toScreenX(0) + 8, spaceMargin.top + 8);

      // Loop phase: 0 to 1 over ~7 seconds
      // Gradient descent animation: line rotates from bad fit (horizontal/inverted) to optimal separating line
      const loopPhase = (Math.sin(t * 0.8) + 1) / 2; // oscillates smoothly between start and converged

      // Initial angle: 30 deg, Converged angle: 135 deg (separating diagonal)
      const targetAngle = (135 * Math.PI) / 180;
      const startAngle = (30 * Math.PI) / 180;
      const currentAngle = startAngle + loopPhase * (targetAngle - startAngle);

      // Normal vector w = (cos(theta), sin(theta)) * magnitude
      const wMag = 1.8 + loopPhase * 1.5;
      const w1 = Math.cos(currentAngle) * wMag;
      const w2 = Math.sin(currentAngle) * wMag;
      // Bias w0: shifts line slightly
      const w0 = -0.15 * Math.sin(t * 0.8);

      // Decision boundary line: w1 * x1 + w2 * x2 + w0 = 0
      // x2 = -(w1 * x1 + w0) / w2
      const lineX1 = -1.0;
      const lineY1 = -(w1 * lineX1 + w0) / (w2 || 0.001);
      const lineX2 = 1.0;
      const lineY2 = -(w1 * lineX2 + w0) / (w2 || 0.001);

      // Shaded decision regions:
      // Half-plane w^T x + w0 > 0 -> Class 1 (Cyan)
      // Half-plane w^T x + w0 <= 0 -> Class 2 (Rose)
      ctx.save();
      ctx.beginPath();
      ctx.rect(spaceMargin.left, spaceMargin.top, plotW, plotH);
      ctx.clip();

      // Draw separating boundary line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toScreenX(lineX1), toScreenY(lineY1));
      ctx.lineTo(toScreenX(lineX2), toScreenY(lineY2));
      ctx.stroke();

      // Normal vector w originating from decision line center
      const midX = 0;
      const midY = -(w1 * midX + w0) / w2;
      const normalScale = 0.45;
      const arrowTipX = midX + (w1 / wMag) * normalScale;
      const arrowTipY = midY + (w2 / wMag) * normalScale;

      ctx.strokeStyle = '#22d3ee';
      ctx.fillStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toScreenX(midX), toScreenY(midY));
      ctx.lineTo(toScreenX(arrowTipX), toScreenY(arrowTipY));
      ctx.stroke();

      // Arrowhead
      const headLen = 8;
      const headAngle = Math.atan2(toScreenY(arrowTipY) - toScreenY(midY), toScreenX(arrowTipX) - toScreenX(midX));
      ctx.beginPath();
      ctx.moveTo(toScreenX(arrowTipX), toScreenY(arrowTipY));
      ctx.lineTo(
        toScreenX(arrowTipX) - headLen * Math.cos(headAngle - Math.PI / 6),
        toScreenY(arrowTipY) - headLen * Math.sin(headAngle - Math.PI / 6)
      );
      ctx.lineTo(
        toScreenX(arrowTipX) - headLen * Math.cos(headAngle + Math.PI / 6),
        toScreenY(arrowTipY) - headLen * Math.sin(headAngle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Normal vector label w
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#22d3ee';
      ctx.fillText('w', toScreenX(arrowTipX) + 8, toScreenY(arrowTipY) - 5);

      // Distance projection to hyperplane (Alpaydın Fig 10.1: r = g(x)/||w||)
      if (mode === 'geometry') {
        const testPt = class1[0];
        const gVal = w1 * testPt.x + w2 * testPt.y + w0;
        const normDist = gVal / (wMag * wMag);
        const projX = testPt.x - normDist * w1;
        const projY = testPt.y - normDist * w2;

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toScreenX(testPt.x), toScreenY(testPt.y));
        ctx.lineTo(toScreenX(projX), toScreenY(projY));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('r = g(x)/||w||', toScreenX((testPt.x + projX) / 2) + 6, toScreenY((testPt.y + projY) / 2));
      }

      ctx.restore();

      // Draw Data Points in 2D space
      // Class 1 (Cyan circles)
      class1.forEach((p) => {
        const px = toScreenX(p.x);
        const py = toScreenY(p.y);
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Class 2 (Rose squares)
      class2.forEach((p) => {
        const px = toScreenX(p.x);
        const py = toScreenY(p.y);
        ctx.beginPath();
        ctx.rect(px - 4.5, py - 4.5, 9, 9);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Gradient Step Indicator / Convergence Status
      const isConverged = loopPhase > 0.85;
      ctx.fillStyle = isConverged ? '#10b981' : '#f59e0b';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(
        isConverged ? 'STATUS: CONVERGED (SEPARATED)' : 'STATUS: OPTIMIZING (w ← w + η(r-y)x)',
        spaceMargin.left,
        height - 14
      );

      // -------------------------------------------------------------
      // Right Panel: Sigmoid Curve & Projection (Alpaydın Fig 10.5)
      // -------------------------------------------------------------
      const rightLeft = leftW + 15;
      const rightAvailW = width - rightLeft - 20;
      const sigMargin = { left: 35, right: 20, top: 40, bottom: 45 };
      const sigPlotW = rightAvailW - sigMargin.left - sigMargin.right;
      const sigPlotH = height - sigMargin.top - sigMargin.bottom;

      // Divider line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftW + 5, 20);
      ctx.lineTo(leftW + 5, height - 20);
      ctx.stroke();

      // Sigmoid Panel Header
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Posterior: y = sigmoid(wᵀx + w₀) (Fig 10.5)', rightLeft, sigMargin.top - 18);

      // Mapping z in [-4, 4] to right plot X, and y in [0, 1] to right plot Y
      const zMin = -4;
      const zMax = 4;
      const toSigX = (z: number) => rightLeft + sigMargin.left + ((z - zMin) / (zMax - zMin)) * sigPlotW;
      const toSigY = (yVal: number) => sigMargin.top + (1 - yVal) * sigPlotH;

      // Sigmoid Axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Y-axis at z = 0
      ctx.moveTo(toSigX(0), sigMargin.top);
      ctx.lineTo(toSigX(0), sigMargin.top + sigPlotH);
      // X-axis at y = 0
      ctx.moveTo(rightLeft + sigMargin.left, toSigY(0));
      ctx.lineTo(rightLeft + sigMargin.left + sigPlotW, toSigY(0));
      ctx.stroke();

      // Threshold line at y = 0.5
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(rightLeft + sigMargin.left, toSigY(0.5));
      ctx.lineTo(rightLeft + sigMargin.left + sigPlotW, toSigY(0.5));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '9px monospace';
      ctx.fillText('y=0.5', rightLeft + sigMargin.left - 28, toSigY(0.5) + 3);
      ctx.fillText('y=1.0', rightLeft + sigMargin.left - 28, toSigY(1.0) + 4);
      ctx.fillText('z →', rightLeft + sigMargin.left + sigPlotW - 15, toSigY(0) + 16);

      // Plot Sigmoid Curve
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const numPts = 60;
      for (let i = 0; i <= numPts; i++) {
        const zVal = zMin + (i / numPts) * (zMax - zMin);
        const yVal = sigmoid(zVal);
        const sx = toSigX(zVal);
        const sy = toSigY(yVal);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Project Points onto Sigmoid
      // Class 1 (r = 1, Cyan)
      class1.forEach((p) => {
        const zVal = w1 * p.x + w2 * p.y + w0;
        const yVal = sigmoid(zVal);
        const sx = toSigX(zVal);
        const sy = toSigY(yVal);

        // Vertical drop line to axis
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, toSigY(0));
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Class 2 (r = 0, Rose)
      class2.forEach((p) => {
        const zVal = w1 * p.x + w2 * p.y + w0;
        const yVal = sigmoid(zVal);
        const sx = toSigX(zVal);
        const sy = toSigY(yVal);

        ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, toSigY(0));
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(sx - 3.5, sy - 3.5, 7, 7);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Real-time Cross-Entropy Loss computation
      let totalLoss = 0;
      class1.forEach((p) => {
        const yVal = sigmoid(w1 * p.x + w2 * p.y + w0);
        totalLoss -= Math.log(Math.max(yVal, 1e-6));
      });
      class2.forEach((p) => {
        const yVal = sigmoid(w1 * p.x + w2 * p.y + w0);
        totalLoss -= Math.log(Math.max(1 - yVal, 1e-6));
      });
      const avgLoss = (totalLoss / (class1.length + class2.length)).toFixed(3);

      // Loss badge
      const badgeX = rightLeft + 15;
      const badgeY = height - 42;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, rightAvailW - 30, 28, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`CROSS-ENTROPY LOSS E(w): ${avgLoss}`, badgeX + 12, badgeY + 18);

      ctx.restore();
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, mode]);

  return (
    <div className="w-full my-8 bg-white/70 dark:bg-zinc-900/50 border border-white/80 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg shadow-zinc-950/5">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Chapter 10: Linear Discrimination
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Rotating Hyperplane wᵀx + w₀ = 0 with Gradient Updates and Sigmoid Posterior (Alpaydın Figs 10.1, 10.5, 10.7)
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setMode('gradient')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'gradient'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Gradient Descent
          </button>
          <button
            onClick={() => setMode('sigmoid')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'sigmoid'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Sigmoid Mapping
          </button>
          <button
            onClick={() => setMode('geometry')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'geometry'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Geometry & Normal w
          </button>
        </div>

        {/* Play/Pause and Reset controls */}
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
        <canvas ref={canvasRef} className="w-full max-w-4xl rounded-xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950" />
      </div>

      {/* Caption Footer */}
      <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p>
          <strong>Figure 10.1 & 10.5 Emulation:</strong> Left panel displays online weight updates rotating normal vector{' '}
          <em>w</em> and boundary line <em>wᵀx + w₀ = 0</em>. Right panel shows scalar projection <em>z</em> mapped through{' '}
          <em>y = σ(z)</em>, pulling class posteriors to 0 and 1 while minimizing cross-entropy loss.
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
