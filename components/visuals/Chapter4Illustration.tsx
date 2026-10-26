'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, TrendingUp, Cpu, Shuffle } from 'lucide-react';

export default function Chapter4Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [orderMode, setOrderMode] = useState<'compare' | 'tradeoff-curve' | 'ensemble'>('compare');
  const [selectedDegree, setSelectedDegree] = useState<1 | 3 | 6>(3);
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Base training dataset sampled from f(x) = sin(2*pi*x) on [0, 1] with noise
  const basePoints = [
    { x: 0.08, y: 0.38 },
    { x: 0.18, y: 0.88 },
    { x: 0.28, y: 0.95 },
    { x: 0.38, y: 0.65 },
    { x: 0.48, y: 0.08 },
    { x: 0.58, y: -0.45 },
    { x: 0.68, y: -0.92 },
    { x: 0.78, y: -0.85 },
    { x: 0.88, y: -0.55 },
    { x: 0.95, y: -0.05 },
  ];

  // Fit polynomial helper using normal equations
  const fitPolynomial = (pts: { x: number; y: number }[], degree: number) => {
    const m = degree + 1;
    const XTX: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
    const XTY: number[] = Array(m).fill(0);

    for (const p of pts) {
      const powers: number[] = [1];
      for (let i = 1; i <= 2 * degree; i++) {
        powers[i] = powers[i - 1] * p.x;
      }
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < m; c++) {
          XTX[r][c] += powers[r + c];
        }
        XTY[r] += p.y * powers[r];
      }
    }

    // Gaussian elimination with partial pivoting
    const A = XTX.map((row, i) => [...row, XTY[i]]);
    for (let i = 0; i < m; i++) {
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < m; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k < m + 1; k++) {
        const tmp = A[maxRow][k];
        A[maxRow][k] = A[i][k];
        A[i][k] = tmp;
      }

      if (Math.abs(A[i][i]) < 1e-12) continue;

      for (let k = i + 1; k < m; k++) {
        const c = -A[k][i] / A[i][i];
        for (let j = i; j < m + 1; j++) {
          if (i === j) {
            A[k][j] = 0;
          } else {
            A[k][j] += c * A[i][j];
          }
        }
      }
    }

    const coeffs = Array(m).fill(0);
    for (let i = m - 1; i >= 0; i--) {
      coeffs[i] = A[i][m] / (A[i][i] || 1e-10);
      for (let k = i - 1; k >= 0; k--) {
        A[k][m] -= A[k][i] * coeffs[i];
      }
    }

    return (x: number) => {
      let val = 0;
      let xPow = 1;
      for (let i = 0; i < m; i++) {
        val += coeffs[i] * xPow;
        xPow *= x;
      }
      return val;
    };
  };

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

      const padX = 65;
      const padY = 40;
      const plotW = displayWidth - padX - 40;
      const plotH = displayHeight - padY - 55;

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      if (orderMode === 'tradeoff-curve') {
        // --- VIEW: Alpaydın Figure 4.6 Bias / Variance Trade-off ---
        // Axes
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padX, padY);
        ctx.lineTo(padX, padY + plotH);
        ctx.lineTo(padX + plotW, padY + plotH);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '500 12px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('Model Complexity / Capacity (Polynomial Order k) →', padX + plotW - 280, padY + plotH + 32);

        ctx.save();
        ctx.translate(22, padY + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Expected Generalization Error E(g|X) →', 0, 0);
        ctx.restore();

        // Analytical curves across k in [1, 8]
        const getMetrics = (k: number) => {
          // Bias^2 starts high at k=1, drops fast
          const biasSq = 0.75 * Math.exp(-0.8 * (k - 1)) + 0.05;
          // Variance starts low at k=1, explodes for k > 4
          const variance = 0.04 * Math.exp(0.55 * (k - 1));
          const noise = 0.08;
          const total = biasSq + variance + noise;
          return { biasSq, variance, noise, total };
        };

        const toCurveX = (k: number) => padX + ((k - 1) / 7) * plotW;
        const toCurveY = (err: number) => padY + (1 - err / 1.05) * plotH;

        // Draw Bias² Curve (Cyan)
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let k = 1; k <= 8; k += 0.1) {
          const cx = toCurveX(k);
          const cy = toCurveY(getMetrics(k).biasSq);
          if (k === 1) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // Draw Variance Curve (Amber)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let k = 1; k <= 8; k += 0.1) {
          const cx = toCurveX(k);
          const cy = toCurveY(getMetrics(k).variance);
          if (k === 1) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // Draw Total Expected Error Curve (Rose)
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let k = 1; k <= 8; k += 0.1) {
          const cx = toCurveX(k);
          const cy = toCurveY(getMetrics(k).total);
          if (k === 1) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // Moving operating point along curve
        const animK = 1 + 7 * ((Math.sin(t * 1.2) + 1) / 2);
        const { biasSq, variance, total } = getMetrics(animK);
        const curCX = toCurveX(animK);
        const curCY = toCurveY(total);

        // Optimal Capacity vertical guide at k ≈ 3.2
        const optK = 3.2;
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(toCurveX(optK), padY);
        ctx.lineTo(toCurveX(optK), padY + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px ui-sans-serif, system-ui';
        ctx.fillText('Optimal Capacity k*', toCurveX(optK) - 45, padY + 16);

        // Indicator dot on total error
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(curCX, curCY, 6, 0, Math.PI * 2);
        ctx.fill();

        // HUD overlay in top-right
        const hudX = padX + plotW - 220;
        const hudY = padY + 10;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, 210, 110, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText(`Degree k = ${animK.toFixed(1)}`, hudX + 12, hudY + 22);

        ctx.fillStyle = '#f43f5e';
        ctx.font = '11px ui-sans-serif, system-ui';
        ctx.fillText(`Total Error: ${total.toFixed(3)}`, hudX + 12, hudY + 44);

        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`Bias² (Underfitting): ${biasSq.toFixed(3)}`, hudX + 12, hudY + 66);

        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Variance (Overfitting): ${variance.toFixed(3)}`, hudX + 12, hudY + 88);

        // Underfitting & Overfitting region text
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px ui-sans-serif, system-ui';
        ctx.fillText('High Bias (Underfit)', padX + 20, padY + plotH - 20);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText('High Variance (Overfit)', padX + plotW - 140, padY + plotH - 20);
      } else {
        // --- VIEW: Polynomial Fits (Compare or Ensemble) ---
        const toCanvasX = (nx: number) => padX + nx * plotW;
        const toCanvasY = (ny: number) => padY + (1 - (ny + 1.4) / 2.8) * plotH;

        // Background zero line
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX, toCanvasY(0));
        ctx.lineTo(padX + plotW, toCanvasY(0));
        ctx.stroke();

        // True function f(x) = sin(2*pi*x) (White dashed line)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let x = 0; x <= 1.0; x += 0.02) {
          const cy = toCanvasY(Math.sin(2 * Math.PI * x));
          if (x === 0) ctx.moveTo(toCanvasX(x), cy);
          else ctx.lineTo(toCanvasX(x), cy);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated points jittering slightly to represent varying samples
        const dynamicPoints = basePoints.map((p, i) => ({
          x: p.x,
          y: p.y + 0.08 * Math.sin(t * 2 + i * 1.5),
        }));

        if (orderMode === 'ensemble') {
          // Draw 8 fits for Order 1, 3, or 6
          ctx.lineWidth = 1.2;
          for (let e = 0; e < 8; e++) {
            const ensemblePoints = basePoints.map((p, i) => ({
              x: p.x,
              y: p.y + 0.15 * Math.sin(t * 1.5 + e * 0.9 + i),
            }));
            const fn = fitPolynomial(ensemblePoints, selectedDegree);

            ctx.strokeStyle =
              selectedDegree === 1
                ? 'rgba(56, 189, 248, 0.25)'
                : selectedDegree === 3
                ? 'rgba(52, 211, 153, 0.28)'
                : 'rgba(244, 63, 94, 0.28)';

            ctx.beginPath();
            for (let x = 0; x <= 1.0; x += 0.02) {
              const cy = toCanvasY(fn(x));
              if (x === 0) ctx.moveTo(toCanvasX(x), cy);
              else ctx.lineTo(toCanvasX(x), cy);
            }
            ctx.stroke();
          }
        }

        // Fit functions for current dynamic points
        const fit1 = fitPolynomial(dynamicPoints, 1);
        const fit3 = fitPolynomial(dynamicPoints, 3);
        const fit6 = fitPolynomial(dynamicPoints, 6);

        if (orderMode === 'compare') {
          // Draw Order 1 (Linear - High Bias)
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x <= 1.0; x += 0.02) {
            const cy = toCanvasY(fit1(x));
            if (x === 0) ctx.moveTo(toCanvasX(x), cy);
            else ctx.lineTo(toCanvasX(x), cy);
          }
          ctx.stroke();

          // Draw Order 3 (Optimal)
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          for (let x = 0; x <= 1.0; x += 0.02) {
            const cy = toCanvasY(fit3(x));
            if (x === 0) ctx.moveTo(toCanvasX(x), cy);
            else ctx.lineTo(toCanvasX(x), cy);
          }
          ctx.stroke();

          // Draw Order 6 (Overfit - High Variance)
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x <= 1.0; x += 0.01) {
            const cy = toCanvasY(fit6(x));
            if (x === 0) ctx.moveTo(toCanvasX(x), cy);
            else ctx.lineTo(toCanvasX(x), cy);
          }
          ctx.stroke();
        } else {
          // Ensemble active single primary line
          const primaryFn = selectedDegree === 1 ? fit1 : selectedDegree === 3 ? fit3 : fit6;
          ctx.strokeStyle = selectedDegree === 1 ? '#38bdf8' : selectedDegree === 3 ? '#10b981' : '#f43f5e';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          for (let x = 0; x <= 1.0; x += 0.01) {
            const cy = toCanvasY(primaryFn(x));
            if (x === 0) ctx.moveTo(toCanvasX(x), cy);
            else ctx.lineTo(toCanvasX(x), cy);
          }
          ctx.stroke();
        }

        // Draw Data Points
        dynamicPoints.forEach((p, idx) => {
          const cx = toCanvasX(p.x);
          const cy = toCanvasY(p.y);

          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Legend box
        const legX = padX + 15;
        const legY = padY + 15;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(legX, legY, 180, 95, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px ui-sans-serif, system-ui';
        ctx.fillText('--- True f(x) = sin(2πx)', legX + 12, legY + 20);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText('— Order 1 (Linear, High Bias)', legX + 12, legY + 40);

        ctx.fillStyle = '#34d399';
        ctx.fillText('— Order 3 (Cubic, Optimal)', legX + 12, legY + 60);

        ctx.fillStyle = '#f43f5e';
        ctx.fillText('— Order 6 (Overfit, High Var)', legX + 12, legY + 80);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, orderMode, selectedDegree]);

  return (
    <div className="rounded-3xl border border-white/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 overflow-hidden shadow-xl my-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Interactive Visual · Chapter 4: Parametric Fits & Bias-Variance
          </h4>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setOrderMode('compare')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              orderMode === 'compare'
                ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            1. Polynomial Comparison
          </button>
          <button
            onClick={() => setOrderMode('tradeoff-curve')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              orderMode === 'tradeoff-curve'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            2. Bias-Variance Curve
          </button>
          <button
            onClick={() => setOrderMode('ensemble')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              orderMode === 'ensemble'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Shuffle className="h-3.5 w-3.5" />
            3. Dataset Ensemble
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {orderMode === 'ensemble' && (
            <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setSelectedDegree(1)}
                className={`px-2 py-0.5 rounded ${selectedDegree === 1 ? 'bg-cyan-500 text-white' : 'text-zinc-400'}`}
              >
                k=1
              </button>
              <button
                onClick={() => setSelectedDegree(3)}
                className={`px-2 py-0.5 rounded ${selectedDegree === 3 ? 'bg-emerald-500 text-white' : 'text-zinc-400'}`}
              >
                k=3
              </button>
              <button
                onClick={() => setSelectedDegree(6)}
                className={`px-2 py-0.5 rounded ${selectedDegree === 6 ? 'bg-rose-500 text-white' : 'text-zinc-400'}`}
              >
                k=6
              </button>
            </div>
          )}
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
          {orderMode === 'compare' && (
            <>
              <strong>Alpaydın Figure 4.5:</strong> Linear fit (Order 1, cyan) underfits with high bias. Cubic fit (Order 3, green) captures the underlying sine signal cleanly. Polynomial fit (Order 6, rose) overfits noise, causing extreme boundary variance.
            </>
          )}
          {orderMode === 'tradeoff-curve' && (
            <>
              <strong>Alpaydın Figure 4.6 (Bias-Variance Dilemma):</strong> As model capacity <em>k</em> increases, bias² drops monotonically while variance grows. Total error achieves its global minimum at optimal capacity <em>k*</em>.
            </>
          )}
          {orderMode === 'ensemble' && (
            <>
              <strong>Sampling Variation over Datasets:</strong> Demonstrating variance across 8 random sample draws from the ground truth. High-order models flail wildly between runs, while low-order models remain tightly clustered.
            </>
          )}
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
