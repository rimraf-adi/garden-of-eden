'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Scale, Sliders, AlertOctagon } from 'lucide-react';

export default function Chapter3Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'likelihood-threshold' | 'prior-shift' | 'reject-option'>('likelihood-threshold');
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Normal distribution PDF helper
  const gaussian = (x: number, mean: number, std: number) => {
    const factor = 1 / (std * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - mean) / std, 2);
    return factor * Math.exp(exponent);
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

      const toCanvasX = (xVal: number) => padX + ((xVal - (-4)) / 8) * plotW;
      const toCanvasY = (yVal: number) => padY + (1 - yVal / 0.55) * plotH;

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Background grid
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(226, 232, 240, 0.85)';
      ctx.lineWidth = 1;
      for (let gx = -4; gx <= 4; gx += 1) {
        const cx = toCanvasX(gx);
        ctx.beginPath();
        ctx.moveTo(cx, padY);
        ctx.lineTo(cx, padY + plotH);
        ctx.stroke();
      }
      for (let gy = 0; gy <= 0.5; gy += 0.1) {
        const cy = toCanvasY(gy);
        ctx.beginPath();
        ctx.moveTo(padX, cy);
        ctx.lineTo(padX + plotW, cy);
        ctx.stroke();
      }

      // Axes
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
      ctx.fillText('Observable Feature (x) →', padX + plotW - 130, padY + plotH + 30);

      ctx.save();
      ctx.translate(22, padY + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Probability Density p(x|Cᵢ) · P(Cᵢ)', 0, 0);
      ctx.restore();

      // Gaussian Parameters
      const mean1 = -1.2;
      const std1 = 1.0;
      const mean2 = 1.4;
      const std2 = 1.1;

      // Class priors based on mode
      let prior1 = 0.5;
      let prior2 = 0.5;

      if (mode === 'prior-shift') {
        // Priors dynamically oscillating smoothly
        const osc = (Math.sin(t * 1.2) + 1) / 2; // 0 to 1
        prior1 = 0.25 + 0.5 * osc; // 0.25 to 0.75
        prior2 = 1 - prior1;
      } else {
        prior1 = 0.55;
        prior2 = 0.45;
      }

      // Joint density: p(x, Ci) = p(x|Ci) * P(Ci)
      const joint1 = (x: number) => gaussian(x, mean1, std1) * prior1;
      const joint2 = (x: number) => gaussian(x, mean2, std2) * prior2;

      // Find intersection threshold x* by binary search or bisection in [-3, 3]
      let threshX = 0;
      let left = -2.5,
        right = 2.5;
      for (let iter = 0; iter < 24; iter++) {
        const mid = (left + right) / 2;
        const diff = joint1(mid) - joint2(mid);
        if (diff > 0) {
          left = mid;
        } else {
          right = mid;
        }
      }
      threshX = (left + right) / 2;

      // --- 1. Shaded Risk / Error Regions ---
      if (mode !== 'reject-option') {
        // Class 1 False Alarm / Error tail (where x > threshX but class is C1)
        ctx.fillStyle = 'rgba(217, 119, 6, 0.18)';
        ctx.beginPath();
        ctx.moveTo(toCanvasX(threshX), toCanvasY(0));
        for (let x = threshX; x <= 4; x += 0.05) {
          ctx.lineTo(toCanvasX(x), toCanvasY(joint1(x)));
        }
        ctx.lineTo(toCanvasX(4), toCanvasY(0));
        ctx.closePath();
        ctx.fill();

        // Class 2 Miss / Error tail (where x < threshX but class is C2)
        ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
        ctx.beginPath();
        ctx.moveTo(toCanvasX(-4), toCanvasY(0));
        for (let x = -4; x <= threshX; x += 0.05) {
          ctx.lineTo(toCanvasX(x), toCanvasY(joint2(x)));
        }
        ctx.lineTo(toCanvasX(threshX), toCanvasY(0));
        ctx.closePath();
        ctx.fill();
      } else {
        // Reject Option Mode: define reject margin around threshX
        const rejectDelta = 0.65;
        const xRejectL = threshX - rejectDelta;
        const xRejectR = threshX + rejectDelta;

        // Reject region shaded in amber
        ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
        ctx.fillRect(toCanvasX(xRejectL), padY, toCanvasX(xRejectR) - toCanvasX(xRejectL), plotH);

        // Dashed lines for reject zone boundaries
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(xRejectL), padY);
        ctx.lineTo(toCanvasX(xRejectL), padY + plotH);
        ctx.moveTo(toCanvasX(xRejectR), padY);
        ctx.lineTo(toCanvasX(xRejectR), padY + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reject label
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px ui-sans-serif, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('DOUBT / REJECT REGION', toCanvasX(threshX), padY + 24);
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillText('Cost λ < Misclassification Risk', toCanvasX(threshX), padY + 38);
        ctx.textAlign = 'left';
      }

      // --- 2. Draw Class 1 Density Curve (Indigo) ---
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -4; x <= 4; x += 0.05) {
        const cx = toCanvasX(x);
        const cy = toCanvasY(joint1(x));
        if (x === -4) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Class 1 Label & Mean Marker
      const peak1Y = toCanvasY(joint1(mean1));
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px ui-sans-serif, system-ui';
      ctx.fillText(`p(x|C₁) · P(C₁) [P(C₁) = ${(prior1 * 100).toFixed(0)}%]`, toCanvasX(mean1) - 60, peak1Y - 14);

      // --- 3. Draw Class 2 Density Curve (Rose) ---
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -4; x <= 4; x += 0.05) {
        const cx = toCanvasX(x);
        const cy = toCanvasY(joint2(x));
        if (x === -4) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Class 2 Label & Mean Marker
      const peak2Y = toCanvasY(joint2(mean2));
      ctx.fillStyle = '#fb7185';
      ctx.font = 'bold 12px ui-sans-serif, system-ui';
      ctx.fillText(`p(x|C₂) · P(C₂) [P(C₂) = ${(prior2 * 100).toFixed(0)}%]`, toCanvasX(mean2) - 40, peak2Y - 14);

      // --- 4. Decision Threshold Line (x*) ---
      const threshCanvasX = toCanvasX(threshX);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(threshCanvasX, padY);
      ctx.lineTo(threshCanvasX, padY + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow on the threshold
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(threshCanvasX, toCanvasY(joint1(threshX)), 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillText(`Threshold x* = ${threshX.toFixed(2)}`, threshCanvasX + 8, padY + 60);

      // Decision region indicators at bottom
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px ui-sans-serif, system-ui';
      ctx.fillText('◀ Decide C₁', toCanvasX(-3.2), padY + plotH + 18);

      ctx.fillStyle = '#fb7185';
      ctx.fillText('Decide C₂ ▶', toCanvasX(2.0), padY + plotH + 18);

      // --- 5. Interactive Scanning Probe (moving back and forth) ---
      const probeX = -2.8 + 5.6 * ((Math.sin(t * 1.5) + 1) / 2);
      const probeCanvasX = toCanvasX(probeX);
      const val1 = joint1(probeX);
      const val2 = joint2(probeX);
      const totalEvidence = val1 + val2 + 1e-6;
      const post1 = val1 / totalEvidence;
      const post2 = val2 / totalEvidence;

      // Vertical scanner bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(probeCanvasX, padY + 10);
      ctx.lineTo(probeCanvasX, padY + plotH);
      ctx.stroke();

      // Probe tracker bead
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.beginPath();
      ctx.arc(probeCanvasX, toCanvasY(Math.max(val1, val2)), 5, 0, Math.PI * 2);
      ctx.fill();

      // Live HUD badge for Posterior Probability P(Ci|x)
      const hudW = 190;
      const hudH = 76;
      const hudX = Math.min(Math.max(probeCanvasX - hudW / 2, padX + 5), padX + plotW - hudW - 5);
      const hudY = padY + 10;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText(`Probe x = ${probeX.toFixed(2)}`, hudX + 10, hudY + 18);

      // Posterior bar C1
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px ui-sans-serif, system-ui';
      ctx.fillText(`P(C₁|x): ${(post1 * 100).toFixed(1)}%`, hudX + 10, hudY + 36);
      ctx.fillStyle = '#312e81';
      ctx.fillRect(hudX + 90, hudY + 28, 85, 8);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(hudX + 90, hudY + 28, 85 * post1, 8);

      // Posterior bar C2
      ctx.fillStyle = '#fb7185';
      ctx.fillText(`P(C₂|x): ${(post2 * 100).toFixed(1)}%`, hudX + 10, hudY + 56);
      ctx.fillStyle = '#4c0519';
      ctx.fillRect(hudX + 90, hudY + 48, 85, 8);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(hudX + 90, hudY + 48, 85 * post2, 8);

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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Interactive Visual · Chapter 3: Bayesian Decision Theory & Risk
          </h4>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('likelihood-threshold')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'likelihood-threshold'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            1. Optimal Threshold x*
          </button>
          <button
            onClick={() => setMode('prior-shift')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'prior-shift'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            2. Dynamic Prior Shift
          </button>
          <button
            onClick={() => setMode('reject-option')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'reject-option'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            3. Reject Option (Doubt)
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
          {mode === 'likelihood-threshold' && (
            <>
              <strong>Alpaydın Figure 3.1:</strong> Class-conditional distributions <em>p(x|C₁)</em> and <em>p(x|C₂)</em> intersect at optimal Bayes boundary <em>x*</em>. Shaded tails show minimum conditional error (expected risk 0/1 loss).
            </>
          )}
          {mode === 'prior-shift' && (
            <>
              <strong>Prior Probability Influence:</strong> When <em>P(C₁)</em> increases, the optimal threshold shifts to the right, widening class 1's decision territory to minimize total expected error rate.
            </>
          )}
          {mode === 'reject-option' && (
            <>
              <strong>Alpaydın Section 3.4 (Reject Option):</strong> When posterior certainty is low (neither class exceeds risk threshold), the system opts to reject / doubt with cost <em>λ</em>, avoiding costly high-risk misclassifications.
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
