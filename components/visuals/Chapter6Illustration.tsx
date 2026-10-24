'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Compass, Split, Eye } from 'lucide-react';

export default function Chapter6Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'pca-variance' | 'eigenvectors' | 'pca-vs-lda'>('pca-variance');
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Correlated 2D point cloud for PCA (mean around origin, elongated along ~35 deg)
  const pcaPoints = [
    { x: -1.8, y: -1.2 },
    { x: -1.4, y: -0.7 },
    { x: -1.1, y: -1.0 },
    { x: -0.8, y: -0.3 },
    { x: -0.5, y: -0.6 },
    { x: -0.3, y: 0.1 },
    { x: -0.1, y: -0.2 },
    { x: 0.1, y: 0.2 },
    { x: 0.3, y: -0.1 },
    { x: 0.6, y: 0.4 },
    { x: 0.9, y: 0.8 },
    { x: 1.2, y: 0.6 },
    { x: 1.5, y: 1.1 },
    { x: 1.7, y: 0.9 },
    { x: 2.1, y: 1.4 },
    { x: -0.9, y: -0.8 },
    { x: 0.0, y: 0.1 },
    { x: 1.0, y: 0.5 },
  ];

  // Two classes for LDA comparison (Alpaydın Fig 6.7)
  // Classes are horizontally separated but individually tilted
  const ldaClass1 = [
    { x: -1.2, y: -0.8 },
    { x: -1.0, y: -0.2 },
    { x: -0.8, y: 0.3 },
    { x: -0.6, y: 0.8 },
    { x: -0.4, y: 1.2 },
    { x: -1.1, y: 0.1 },
    { x: -0.7, y: 0.6 },
    { x: -0.9, y: -0.5 },
  ];

  const ldaClass2 = [
    { x: 0.4, y: -1.2 },
    { x: 0.6, y: -0.8 },
    { x: 0.8, y: -0.3 },
    { x: 1.0, y: 0.2 },
    { x: 1.2, y: 0.7 },
    { x: 0.5, y: -0.6 },
    { x: 0.9, y: -0.1 },
    { x: 1.1, y: 0.4 },
  ];

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

      const originX = displayWidth * 0.45;
      const originY = displayHeight * 0.52;
      const scale = Math.min(displayWidth, displayHeight) * 0.18;

      const toScreenX = (x: number) => originX + x * scale;
      const toScreenY = (y: number) => originY - y * scale;

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Subtle Background Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < displayWidth; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, displayHeight);
        ctx.stroke();
      }
      for (let y = 0; y < displayHeight; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(displayWidth, y);
        ctx.stroke();
      }

      // Main Axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originX - scale * 2.6, originY);
      ctx.lineTo(originX + scale * 2.6, originY);
      ctx.moveTo(originX, originY - scale * 2.2);
      ctx.lineTo(originX, originY + scale * 2.2);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '11px ui-sans-serif, system-ui';
      ctx.fillText('x₁', originX + scale * 2.6 + 5, originY + 4);
      ctx.fillText('x₂', originX - 6, originY - scale * 2.2 - 6);

      if (mode === 'pca-variance' || mode === 'eigenvectors') {
        // Principal orientation is around 34 degrees (0.59 rad)
        const principalAngle = 0.58;

        // Current rotation angle of projection line w
        let curAngle = principalAngle;
        if (mode === 'pca-variance') {
          // Oscillate or rotate through angles
          curAngle = principalAngle + 0.9 * Math.sin(t * 1.2);
        }

        const wx = Math.cos(curAngle);
        const wy = Math.sin(curAngle);

        // Orthogonal vector
        const vx = -Math.sin(curAngle);
        const vy = Math.cos(curAngle);

        // Calculate variance along w
        let sumSq = 0;
        pcaPoints.forEach((p) => {
          const projDist = p.x * wx + p.y * wy;
          sumSq += projDist * projDist;
        });
        const currentVariance = sumSq / pcaPoints.length;

        // Draw Projection Line (Vector w)
        const lineLen = scale * 2.8;
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(originX - wx * lineLen, originY + wy * lineLen);
        ctx.lineTo(originX + wx * lineLen, originY - wy * lineLen);
        ctx.stroke();

        // Arrow head for w
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText('w (Projection Axis)', originX + wx * (lineLen - 10) + 10, originY - wy * (lineLen - 10));

        // Draw orthogonal eigenvector v2 if in eigenvectors mode
        if (mode === 'eigenvectors') {
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(originX - vx * lineLen * 0.6, originY + vy * lineLen * 0.6);
          ctx.lineTo(originX + vx * lineLen * 0.6, originY - vy * lineLen * 0.6);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#c084fc';
          ctx.fillText('v₂ (2nd Component)', originX + vx * lineLen * 0.6 + 10, originY - vy * lineLen * 0.6);

          // Draw principal covariance ellipse
          ctx.save();
          ctx.translate(originX, originY);
          ctx.rotate(-principalAngle);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, scale * 2.1, scale * 0.7, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Draw Points and their Perpendicular Projection drops
        pcaPoints.forEach((p, idx) => {
          const px = toScreenX(p.x);
          const py = toScreenY(p.y);

          // Projected point onto w
          const projDist = p.x * wx + p.y * wy;
          const projX = originX + wx * projDist * scale;
          const projY = originY - wy * projDist * scale;

          // Projection line / reconstruction residual error
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(projX, projY);
          ctx.stroke();
          ctx.setLineDash([]);

          // 2D Point
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Projected 1D marker on w
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(projX, projY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Variance HUD Meter on the right panel
        const meterX = displayWidth - 200;
        const meterY = 50;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(meterX, meterY, 180, 150, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText('PCA Optimization', meterX + 12, meterY + 24);

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px ui-sans-serif, system-ui';
        ctx.fillText('Variance along w: σ²(w)', meterX + 12, meterY + 48);

        // Progress bar for variance
        const maxVar = 2.45;
        const normVar = Math.min(Math.max(currentVariance / maxVar, 0), 1);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(meterX + 12, meterY + 58, 156, 12);
        ctx.fillStyle = normVar > 0.85 ? '#10b981' : '#06b6d4';
        ctx.fillRect(meterX + 12, meterY + 58, 156 * normVar, 12);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillText(`${currentVariance.toFixed(2)} / ${maxVar.toFixed(2)}`, meterX + 12, meterY + 86);

        ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
        ctx.font = '10px ui-sans-serif, system-ui';
        ctx.fillText(`Angle θ: ${(curAngle * (180 / Math.PI)).toFixed(0)}°`, meterX + 12, meterY + 110);
        ctx.fillStyle = normVar > 0.88 ? '#34d399' : '#94a3b8';
        ctx.fillText(
          normVar > 0.88 ? '★ Maximum Variance (v₁)' : 'Rotating Axis...',
          meterX + 12,
          meterY + 130
        );
      } else {
        // --- VIEW: PCA vs Fisher's LDA (Alpaydın Figure 6.7) ---
        // PCA direction: maximizes total variance, which is diagonal (~45 deg)
        // LDA direction: separates class means while minimizing spread, which is nearly horizontal (~0 deg)
        const ldaAngle = -0.15; // horizontal separation
        const pcaAngle = 1.1; // diagonal total variance

        // Toggle or animate between PCA and LDA directions
        const tCycle = (Math.sin(t * 1.4) + 1) / 2; // 0 to 1
        const activeAngle = ldaAngle * (1 - tCycle) + pcaAngle * tCycle;
        const isNearLDA = tCycle < 0.4;

        const dirX = Math.cos(activeAngle);
        const dirY = Math.sin(activeAngle);

        // Draw Projection Line
        const lineLen = scale * 2.8;
        ctx.strokeStyle = isNearLDA ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX - dirX * lineLen, originY + dirY * lineLen);
        ctx.lineTo(originX + dirX * lineLen, originY - dirY * lineLen);
        ctx.stroke();

        // Label
        ctx.fillStyle = isNearLDA ? '#34d399' : '#fbbf24';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText(
          isNearLDA ? 'Fisher LDA Axis (Class Separated)' : 'PCA Axis (Classes Overlap!)',
          originX + dirX * (lineLen - 20) - 40,
          originY - dirY * (lineLen - 20) - 12
        );

        // Draw Class 1 Points (Indigo) & Projections
        ldaClass1.forEach((p) => {
          const px = toScreenX(p.x);
          const py = toScreenY(p.y);
          const projDist = p.x * dirX + p.y * dirY;
          const projX = originX + dirX * projDist * scale;
          const projY = originY - dirY * projDist * scale;

          ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(projX, projY);
          ctx.stroke();

          ctx.fillStyle = '#6366f1';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#818cf8';
          ctx.beginPath();
          ctx.arc(projX, projY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw Class 2 Points (Rose) & Projections
        ldaClass2.forEach((p) => {
          const px = toScreenX(p.x);
          const py = toScreenY(p.y);
          const projDist = p.x * dirX + p.y * dirY;
          const projX = originX + dirX * projDist * scale;
          const projY = originY - dirY * projDist * scale;

          ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(projX, projY);
          ctx.stroke();

          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fb7185';
          ctx.beginPath();
          ctx.arc(projX, projY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // HUD explanation
        const hudX = displayWidth - 220;
        const hudY = 50;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, 200, 110, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText('PCA vs Fisher LDA', hudX + 12, hudY + 22);

        ctx.fillStyle = isNearLDA ? '#34d399' : '#fbbf24';
        ctx.font = 'bold 11px ui-sans-serif, system-ui';
        ctx.fillText(isNearLDA ? 'Mode: Fisher LDA' : 'Mode: Unsupervised PCA', hudX + 12, hudY + 44);

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '10px ui-sans-serif, system-ui';
        if (isNearLDA) {
          ctx.fillText('• Maximizes between-class scatter (SB)', hudX + 12, hudY + 66);
          ctx.fillText('• Minimizes within-class scatter (SW)', hudX + 12, hudY + 82);
          ctx.fillText('✓ Perfect 1D class separation', hudX + 12, hudY + 98);
        } else {
          ctx.fillText('• Maximizes total sample variance', hudX + 12, hudY + 66);
          ctx.fillText('• Ignores class labels completely', hudX + 12, hudY + 82);
          ctx.fillText('✗ Classes overlap in 1D projection', hudX + 12, hudY + 98);
        }
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
  }, [isPlaying, mode]);

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl my-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Interactive Visual · Chapter 6: Dimensionality Reduction (PCA & LDA)
          </h4>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('pca-variance')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'pca-variance'
                ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            1. PCA Variance Rotation
          </button>
          <button
            onClick={() => setMode('eigenvectors')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'eigenvectors'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            2. Eigenvectors & Ellipse
          </button>
          <button
            onClick={() => setMode('pca-vs-lda')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'pca-vs-lda'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Split className="h-3.5 w-3.5" />
            3. PCA vs Fisher's LDA
          </button>
        </div>

        {/* Controls */}
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
          {mode === 'pca-variance' && (
            <>
              <strong>Alpaydın Figure 6.1 (PCA):</strong> Rotating projection vector <em>w</em> to find the principal direction that maximizes projected variance <em>σ²(w) = wᵀΣw</em> while minimizing perpendicular reconstruction error.
            </>
          )}
          {mode === 'eigenvectors' && (
            <>
              <strong>Spectral Decomposition:</strong> Orthogonal eigenvectors <em>v₁</em> and <em>v₂</em> form the natural coordinate axes of the data covariance ellipse with eigenvalues <em>λ₁ ≥ λ₂</em>.
            </>
          )}
          {mode === 'pca-vs-lda' && (
            <>
              <strong>Alpaydın Figure 6.7 (PCA vs LDA):</strong> While PCA seeks direction of largest variance irrespective of class labels, Fisher's Linear Discriminant (LDA) maximizes between-class separation over within-class spread.
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
