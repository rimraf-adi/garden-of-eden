'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Orbit, Grid, Activity } from 'lucide-react';

export default function Chapter7Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'kmeans-voronoi' | 'em-mixtures' | 'iterations'>('kmeans-voronoi');
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // 3 ground-truth cluster distributions in 2D normalized [-1, 1] space
  const rawClusters = [
    // Cluster 1 (Top-Left, Indigo)
    {
      color: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.25)',
      trueCenter: { x: -0.55, y: 0.45 },
      pts: [
        { x: -0.65, y: 0.55 },
        { x: -0.50, y: 0.60 },
        { x: -0.70, y: 0.40 },
        { x: -0.45, y: 0.35 },
        { x: -0.58, y: 0.48 },
        { x: -0.62, y: 0.32 },
        { x: -0.40, y: 0.50 },
        { x: -0.52, y: 0.42 },
      ],
      ellipse: { rx: 0.28, ry: 0.18, rot: 0.4 },
    },
    // Cluster 2 (Top-Right, Emerald)
    {
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.25)',
      trueCenter: { x: 0.55, y: 0.5 },
      pts: [
        { x: 0.45, y: 0.6 },
        { x: 0.65, y: 0.55 },
        { x: 0.5, y: 0.4 },
        { x: 0.7, y: 0.45 },
        { x: 0.6, y: 0.65 },
        { x: 0.42, y: 0.48 },
        { x: 0.58, y: 0.38 },
        { x: 0.62, y: 0.52 },
      ],
      ellipse: { rx: 0.25, ry: 0.22, rot: -0.3 },
    },
    // Cluster 3 (Bottom-Center, Rose)
    {
      color: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.25)',
      trueCenter: { x: 0.05, y: -0.5 },
      pts: [
        { x: -0.15, y: -0.4 },
        { x: 0.2, y: -0.45 },
        { x: 0.0, y: -0.6 },
        { x: -0.1, y: -0.55 },
        { x: 0.15, y: -0.65 },
        { x: 0.05, y: -0.38 },
        { x: -0.22, y: -0.48 },
        { x: 0.25, y: -0.58 },
      ],
      ellipse: { rx: 0.35, ry: 0.16, rot: 0.15 },
    },
  ];

  // Flattened points array
  const allPoints = rawClusters.flatMap((c) => c.pts);

  // Initial badly placed random centroids for k-means loop
  const initialCentroids = [
    { x: -0.1, y: 0.1 },
    { x: 0.2, y: 0.15 },
    { x: 0.0, y: 0.0 },
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

      const originX = displayWidth * 0.44;
      const originY = displayHeight * 0.52;
      const scale = Math.min(displayWidth, displayHeight) * 0.38;

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

      // Loop phase for k-means iteration (repeats every 8 seconds)
      const cycleLength = 8.0;
      const progress = (t % cycleLength) / cycleLength; // 0 to 1
      // 0 to 0.5: Step 1 (Assignment)
      // 0.5 to 1.0: Step 2 (Update centroids)
      const currentStep = progress < 0.5 ? 1 : 2;
      const smoothLerp = (p: number) => (1 - Math.cos(p * Math.PI)) / 2;

      // Iterative centroid positions based on progress
      const currentCentroids = rawClusters.map((c, i) => {
        const init = initialCentroids[i];
        const target = c.trueCenter;
        // Interpolate over iteration cycle
        const factor = progress < 0.5 ? 0.2 : 0.2 + 0.8 * smoothLerp((progress - 0.5) / 0.5);
        return {
          x: init.x + (target.x - init.x) * factor,
          y: init.y + (target.y - init.y) * factor,
        };
      });

      // --- 1. Voronoi Cell Approximation / Lines ---
      if (mode === 'kmeans-voronoi') {
        // Draw Voronoi bisector lines between centroids
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);

        for (let i = 0; i < 3; i++) {
          for (let j = i + 1; j < 3; j++) {
            const c1 = currentCentroids[i];
            const c2 = currentCentroids[j];

            const midX = (c1.x + c2.x) / 2;
            const midY = (c1.y + c2.y) / 2;

            // Perpendicular slope
            const dx = c2.x - c1.x;
            const dy = c2.y - c1.y;
            const perpX = -dy;
            const perpY = dx;

            const len = Math.hypot(perpX, perpY) || 1;
            const nx = perpX / len;
            const ny = perpY / len;

            ctx.beginPath();
            ctx.moveTo(toScreenX(midX - nx * 1.5), toScreenY(midY - ny * 1.5));
            ctx.lineTo(toScreenX(midX + nx * 1.5), toScreenY(midY + ny * 1.5));
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }

      // --- 2. EM Gaussian Mixture Contour Ellipses (Alpaydın Fig 7.4) ---
      if (mode === 'em-mixtures') {
        rawClusters.forEach((c) => {
          const cx = toScreenX(c.trueCenter.x);
          const cy = toScreenY(c.trueCenter.y);
          const rx = c.ellipse.rx * scale;
          const ry = c.ellipse.ry * scale;

          // Animated breathing contour
          const pulse = 1 + 0.04 * Math.sin(t * 2);

          // 2-Sigma Outer Contour
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-c.ellipse.rot);
          ctx.strokeStyle = `${c.color}30`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx * 1.8 * pulse, ry * 1.8 * pulse, 0, 0, Math.PI * 2);
          ctx.stroke();

          // 1-Sigma Inner Contour
          ctx.strokeStyle = `${c.color}90`;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx * pulse, ry * pulse, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        });
      }

      // --- 3. Draw Data Points and Assignment Lines ---
      allPoints.forEach((p) => {
        const px = toScreenX(p.x);
        const py = toScreenY(p.y);

        // Find nearest centroid
        let bestDist = Infinity;
        let bestClusterIdx = 0;
        currentCentroids.forEach((c, idx) => {
          const d = Math.hypot(p.x - c.x, p.y - c.y);
          if (d < bestDist) {
            bestDist = d;
            bestClusterIdx = idx;
          }
        });

        const activeCluster = rawClusters[bestClusterIdx];
        const assignedCentroid = currentCentroids[bestClusterIdx];

        // Assignment connector line
        if (mode === 'kmeans-voronoi' || mode === 'iterations') {
          ctx.strokeStyle = `${activeCluster.color}33`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(toScreenX(assignedCentroid.x), toScreenY(assignedCentroid.y));
          ctx.stroke();
        }

        // Draw point dot
        ctx.fillStyle = activeCluster.color;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow ring
        ctx.strokeStyle = activeCluster.glow;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.stroke();
      });

      // --- 4. Draw Cluster Centroids m_i (Bold Crosshairs) ---
      currentCentroids.forEach((c, i) => {
        const cx = toScreenX(c.x);
        const cy = toScreenY(c.y);
        const cluster = rawClusters[i];

        // Halo circle
        ctx.fillStyle = cluster.glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 + 3 * Math.sin(t * 3 + i), 0, Math.PI * 2);
        ctx.fill();

        // Centroid cross mark
        ctx.strokeStyle = cluster.color;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy - 9);
        ctx.lineTo(cx + 9, cy + 9);
        ctx.moveTo(cx + 9, cy - 9);
        ctx.lineTo(cx - 9, cy + 9);
        ctx.stroke();

        // Label
        ctx.fillStyle = cluster.color;
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText(`m${i + 1}`, cx + 12, cy - 10);
      });

      // --- 5. Status / Iteration HUD Card ---
      const hudX = displayWidth - 210;
      const hudY = 40;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, 195, 145, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillText(mode === 'em-mixtures' ? 'EM Soft Clustering' : 'k-Means Convergence', hudX + 12, hudY + 22);

      if (mode === 'em-mixtures') {
        ctx.fillStyle = '#34d399';
        ctx.font = '11px ui-sans-serif, system-ui';
        ctx.fillText('• E-step: Posterior responsibilities', hudX + 12, hudY + 46);
        ctx.fillText('• M-step: Covariance Σᵢ update', hudX + 12, hudY + 64);
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.fillText('Contour lines: 1σ and 2σ', hudX + 12, hudY + 86);
        ctx.fillText('Gaussian density mixture', hudX + 12, hudY + 104);
        ctx.fillStyle = '#6366f1';
        ctx.fillText('P(Gᵢ|xᵗ) soft assignments', hudX + 12, hudY + 126);
      } else {
        const stepName = currentStep === 1 ? '1. Reassign Voronoi cells' : '2. Update centers of mass';
        ctx.fillStyle = currentStep === 1 ? '#38bdf8' : '#34d399';
        ctx.font = 'bold 11px ui-sans-serif, system-ui';
        ctx.fillText(`Active Phase:`, hudX + 12, hudY + 46);
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillText(stepName, hudX + 12, hudY + 64);

        // Reconstruction error metric
        const reconError = 1.45 - (progress < 0.5 ? 0.3 : 0.3 + 0.8 * ((progress - 0.5) / 0.5));
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px ui-sans-serif, system-ui';
        ctx.fillText(`Reconstruction Error E:`, hudX + 12, hudY + 92);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText(`${reconError.toFixed(3)}`, hudX + 12, hudY + 110);

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '10px ui-sans-serif, system-ui';
        ctx.fillText(`Iteration: ${Math.floor(progress * 4) + 1} / 4`, hudX + 12, hudY + 130);
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Interactive Visual · Chapter 7: Clustering (k-Means & EM Mixtures)
          </h4>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center gap-1.5 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('kmeans-voronoi')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'kmeans-voronoi'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            1. k-Means & Voronoi Cells
          </button>
          <button
            onClick={() => setMode('em-mixtures')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'em-mixtures'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Orbit className="h-3.5 w-3.5" />
            2. EM Covariance Contours
          </button>
          <button
            onClick={() => setMode('iterations')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              mode === 'iterations'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            3. Convergence Cycle
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
          {mode === 'kmeans-voronoi' && (
            <>
              <strong>Alpaydın Figure 7.2:</strong> Iterative k-means clustering. Centroids <em>m_i</em> alternate between Voronoi assignment and moving to the center of mass of their assigned instances until reconstruction error converges.
            </>
          )}
          {mode === 'em-mixtures' && (
            <>
              <strong>Alpaydın Figure 7.4 (Expectation-Maximization):</strong> Bivariate Gaussian Mixture Models. Points have soft posterior probabilities <em>h_ik = P(G_i|x^t)</em>, while 1σ and 2σ covariance contour ellipses estimate cluster orientation and shape.
            </>
          )}
          {mode === 'iterations' && (
            <>
              <strong>Convergence Dynamics:</strong> Step 1 partitions the space, and Step 2 pulls reference vectors into dense clusters, proving that the sum of squared distances strictly decreases on each cycle.
            </>
          )}
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-purple-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
