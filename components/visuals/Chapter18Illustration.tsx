'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Compass, Waves, Target } from 'lucide-react';

export default function Chapter18Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'qlearning' | 'backup' | 'policy'>('qlearning');
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

    // Grid world dimensions: 6 cols x 4 rows (Alpaydın Fig 18.1 style)
    const COLS = 6;
    const ROWS = 4;

    // Obstacles, hazards, start, goal
    const START = { c: 0, r: 0 };
    const GOAL = { c: 5, r: 3 };
    const OBSTACLES = [
      { c: 2, r: 1 },
      { c: 2, r: 2 },
    ];
    const HAZARD = { c: 3, r: 1 };

    // Precalculated Manhattan-like discounted values toward GOAL (discount gamma = 0.9)
    // Distance from goal avoiding obstacles
    const distances: number[][] = [
      [8, 7, 8, 7, 6, 5],
      [7, 6, -1, -2, 5, 4], // -1 obstacle, -2 hazard
      [6, 5, -1, 3, 2, 1],
      [5, 4, 3, 2, 1, 0],
    ];

    // Compute synthetic Q-values for 4 actions: [North, East, South, West]
    const computeQ = (c: number, r: number, progress: number) => {
      if (c === GOAL.c && r === GOAL.r) return [100, 100, 100, 100];
      if (distances[r][c] < 0) return [0, 0, 0, 0];

      const d = distances[r][c];
      const maxVal = 100 * Math.pow(0.85, d) * progress;

      // Directions: 0=Up(North), 1=Right(East), 2=Down(South), 3=Left(West)
      const q = [maxVal * 0.7, maxVal * 0.7, maxVal * 0.7, maxVal * 0.7];

      // Favor movement towards lower distance
      if (r > 0 && distances[r - 1][c] >= 0 && distances[r - 1][c] < d) q[0] = maxVal;
      if (c < COLS - 1 && distances[r][c + 1] >= 0 && distances[r][c + 1] < d) q[1] = maxVal;
      if (r < ROWS - 1 && distances[r + 1][c] >= 0 && distances[r + 1][c] < d) q[2] = maxVal;
      if (c > 0 && distances[r][c - 1] >= 0 && distances[r][c - 1] < d) q[3] = maxVal;

      return q;
    };

    // Agent navigation trajectory along optimal path
    const path = [
      { c: 0, r: 0 },
      { c: 1, r: 0 },
      { c: 1, r: 1 },
      { c: 1, r: 2 },
      { c: 1, r: 3 },
      { c: 2, r: 3 },
      { c: 3, r: 3 },
      { c: 4, r: 3 },
      { c: 5, r: 3 }, // Goal
    ];

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.016;
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

      // Subtle background grid
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

      const isMobile = width < 640;
      const gridPanelW = isMobile ? width : Math.floor(width * 0.62);
      const hudPanelW = isMobile ? width : width - gridPanelW;

      // -------------------------------------------------------------
      // Left Panel: Grid World Environment (Alpaydın Figs 18.1, 18.4)
      // -------------------------------------------------------------
      const margin = { left: 35, right: 20, top: 40, bottom: 45 };
      const availW = gridPanelW - margin.left - margin.right;
      const availH = height - margin.top - margin.bottom;

      const cellSize = Math.min(availW / COLS, availH / ROWS);
      const gridW = cellSize * COLS;
      const gridH = cellSize * ROWS;
      const gridX = margin.left + (availW - gridW) / 2;
      const gridY = margin.top + (availH - gridH) / 2;

      // Header
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Grid World & State-Action Values Q(s, a) (Fig 18.1, 18.4)', margin.left, margin.top - 18);

      // Training progression loop (0 to 1 over ~8 seconds)
      const loopTime = (t * 0.6) % 8.0;
      const trainProgress = Math.min(Math.max((loopTime - 0.5) / 5.0, 0.2), 1.0);

      // Draw Grid Cells & Q-Triangles
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cx = gridX + c * cellSize;
          const cy = gridY + r * cellSize;

          const isObstacle = OBSTACLES.some((o) => o.c === c && o.r === r);
          const isHazard = HAZARD.c === c && HAZARD.r === r;
          const isGoal = GOAL.c === c && GOAL.r === r;
          const isStart = START.c === c && START.r === r;

          if (isObstacle) {
            // Wall / Obstacle Cell
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(cx, cy, cellSize, cellSize);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(cx, cy, cellSize, cellSize);

            // Cross-hatch pattern
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + cellSize, cy + cellSize);
            ctx.moveTo(cx + cellSize, cy);
            ctx.lineTo(cx, cy + cellSize);
            ctx.stroke();
            continue;
          }

          if (isHazard) {
            // Hazard Pit (-50)
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.fillRect(cx, cy, cellSize, cellSize);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.strokeRect(cx, cy, cellSize, cellSize);

            ctx.fillStyle = '#f87171';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TRAP -50', cx + cellSize / 2, cy + cellSize / 2);
            continue;
          }

          if (isGoal) {
            // Goal (+100)
            const goalPulse = (Math.sin(t * 6) + 1) / 2;
            ctx.fillStyle = `rgba(234, 179, 8, ${0.25 + goalPulse * 0.15})`;
            ctx.fillRect(cx, cy, cellSize, cellSize);
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(cx, cy, cellSize, cellSize);

            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('GOAL +100', cx + cellSize / 2, cy + cellSize / 2);
            continue;
          }

          // Normal cell: Draw 4 Q-value Triangles (Alpaydın Figure 18.4)
          const q = computeQ(c, r, trainProgress);
          const midX = cx + cellSize / 2;
          const midY = cy + cellSize / 2;

          // Helper to color triangle based on Q-value [0, 100]
          const qColor = (val: number) => {
            const ratio = Math.min(Math.max(val / 80, 0), 1);
            return `rgba(6, 182, 212, ${0.05 + ratio * 0.45})`;
          };

          // North Triangle (Up action)
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellSize, cy);
          ctx.lineTo(midX, midY);
          ctx.closePath();
          ctx.fillStyle = qColor(q[0]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.stroke();

          // East Triangle (Right action)
          ctx.beginPath();
          ctx.moveTo(cx + cellSize, cy);
          ctx.lineTo(cx + cellSize, cy + cellSize);
          ctx.lineTo(midX, midY);
          ctx.closePath();
          ctx.fillStyle = qColor(q[1]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.stroke();

          // South Triangle (Down action)
          ctx.beginPath();
          ctx.moveTo(cx + cellSize, cy + cellSize);
          ctx.lineTo(cx, cy + cellSize);
          ctx.lineTo(midX, midY);
          ctx.closePath();
          ctx.fillStyle = qColor(q[2]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.stroke();

          // West Triangle (Left action)
          ctx.beginPath();
          ctx.moveTo(cx, cy + cellSize);
          ctx.lineTo(cx, cy);
          ctx.lineTo(midX, midY);
          ctx.closePath();
          ctx.fillStyle = qColor(q[3]);
          ctx.fill();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.stroke();

          // Cell boundary border
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx, cy, cellSize, cellSize);

          // Draw Optimal Policy Arrow π*(s) (Alpaydın Fig 18.12)
          if (mode === 'policy' || trainProgress > 0.6) {
            let maxA = 0;
            let maxVal = q[0];
            for (let a = 1; a < 4; a++) {
              if (q[a] > maxVal) {
                maxVal = q[a];
                maxA = a;
              }
            }

            const arrowLen = cellSize * 0.22;
            ctx.strokeStyle = '#38bdf8';
            ctx.fillStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();

            let targetX = midX;
            let targetY = midY;
            if (maxA === 0) targetY -= arrowLen;
            if (maxA === 1) targetX += arrowLen;
            if (maxA === 2) targetY += arrowLen;
            if (maxA === 3) targetX -= arrowLen;

            ctx.moveTo(midX, midY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();

            // Arrow tip
            ctx.beginPath();
            ctx.arc(targetX, targetY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          if (isStart) {
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('START', cx + 18, cy + 12);
          }
        }
      }

      // Bellman Backup Waves (Mode 2: Concentric reward waves from Goal)
      if (mode === 'backup') {
        const goalCenterX = gridX + GOAL.c * cellSize + cellSize / 2;
        const goalCenterY = gridY + GOAL.r * cellSize + cellSize / 2;

        const waveRadius = ((t * 80) % (width * 0.6)) + 10;
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(goalCenterX, goalCenterY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Animated Agent Traversal (Robot Agent moving from Start to Goal)
      const pathIdxRaw = (loopTime / 8.0) * (path.length - 1);
      const currIdx = Math.min(Math.floor(pathIdxRaw), path.length - 2);
      const segT = pathIdxRaw - currIdx;

      const p0 = path[currIdx];
      const p1 = path[currIdx + 1];

      const agentX = gridX + (p0.c + (p1.c - p0.c) * segT + 0.5) * cellSize;
      const agentY = gridY + (p0.r + (p1.r - p0.r) * segT + 0.5) * cellSize;

      // Draw Agent Trail
      for (let i = 0; i <= currIdx; i++) {
        const ptX = gridX + (path[i].c + 0.5) * cellSize;
        const ptY = gridY + (path[i].r + 0.5) * cellSize;
        ctx.beginPath();
        ctx.arc(ptX, ptY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fill();
      }

      // Bellman TD error pulse wave back to previous state
      if (segT > 0.3 && segT < 0.7) {
        const prevPtX = gridX + (p0.c + 0.5) * cellSize;
        const prevPtY = gridY + (p0.r + 0.5) * cellSize;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(agentX, agentY);
        ctx.lineTo(prevPtX, prevPtY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Agent Robot Avatar
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(agentX, agentY, cellSize * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Agent eye/lens
      ctx.beginPath();
      ctx.arc(agentX, agentY, 3, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.fill();

      // -------------------------------------------------------------
      // Right Panel: Bellman Equation HUD & Learning Metrics
      // -------------------------------------------------------------
      const rightLeft = gridPanelW + 15;
      const rightAvailW = width - rightLeft - 20;

      // Divider line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gridPanelW + 5, 20);
      ctx.lineTo(gridPanelW + 5, height - 20);
      ctx.stroke();

      // Right Header
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Bellman Optimality Backup (Fig 18.12)', rightLeft, margin.top - 18);

      // Bellman Equation Card
      const cardY = margin.top;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rightLeft, cardY, rightAvailW, 90, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('TEMPORAL DIFFERENCE UPDATE', rightLeft + 12, cardY + 20);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = '10px monospace';
      ctx.fillText('Q(s, a) ← Q(s, a) + η·δ', rightLeft + 12, cardY + 40);

      ctx.fillStyle = '#fbbf24';
      ctx.fillText('δ = r + γ·maxₐ Q(s′, a′) - Q(s, a)', rightLeft + 12, cardY + 58);

      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '9px sans-serif';
      ctx.fillText('Discount γ = 0.90  |  Learning Rate η = 0.20', rightLeft + 12, cardY + 76);

      // Episode Metrics Box
      const epY = cardY + 105;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rightLeft, epY, rightAvailW, 85, 8);
      ctx.fill();
      ctx.stroke();

      const epNum = Math.floor(t * 1.5) % 100 + 1;
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`EPISODE: #${epNum}`, rightLeft + 12, epY + 20);

      ctx.fillStyle = '#10b981';
      ctx.fillText(`STEPS TO GOAL: 8 (Optimal)`, rightLeft + 12, epY + 38);

      ctx.fillStyle = '#eab308';
      const cumReward = (100 * Math.pow(0.85, 8)).toFixed(1);
      ctx.fillText(`DISCOUNTED RETURN: +${cumReward}`, rightLeft + 12, epY + 56);

      // Exploitation vs Exploration (Epsilon-greedy)
      ctx.fillStyle = '#c084fc';
      ctx.font = '9px monospace';
      ctx.fillText('POLICY: ε-greedy (ε = 0.10)', rightLeft + 12, epY + 74);

      // Bottom Legend
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '9px sans-serif';
      ctx.fillText('▲/▶/▼/◀ = Q(s, North/East/South/West)', rightLeft, height - 16);

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
    <div className="w-full my-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Chapter 18: Reinforcement Learning
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Grid World Navigation, Action-Value Q-Triangles, and Bellman TD Backups (Alpaydın Figs 18.1, 18.4, 18.12)
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setMode('qlearning')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'qlearning'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Q-Learning Agent
          </button>
          <button
            onClick={() => setMode('backup')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'backup'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Waves className="h-3.5 w-3.5" />
            Value Wave Backup
          </button>
          <button
            onClick={() => setMode('policy')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'policy'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            Optimal Policy π*
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
          <strong>Figure 18.1, 18.4 & 18.12 Emulation:</strong> Grid world agent navigates to Goal (+100) while avoiding
          obstacles and traps (-50). Each cell displays 4 directional action triangles with intensities proportional to{' '}
          <em>Q(s, a)</em>, updated via Bellman temporal difference backups.
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
