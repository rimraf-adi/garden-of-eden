'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ParameterSlider } from './ParameterSliders';
import { LiveInspector } from './LiveInspector';
import {
  Sliders,
  RotateCcw,
  Play,
  Pause,
  Beaker,
  Maximize2,
  TrendingDown,
  Layers,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export type ExperimentType =
  | 'polynomial'
  | 'gradient-descent'
  | 'svm-margin'
  | 'kmeans'
  | 'reinforcement';

interface WorkbenchViewProps {
  initialExperiment?: ExperimentType;
}

export default function WorkbenchView({ initialExperiment = 'polynomial' }: WorkbenchViewProps) {
  const [activeExp, setActiveExp] = useState<ExperimentType>(initialExperiment);

  // Experiment 1: Polynomial Curve Fitting
  const [degree, setDegree] = useState<number>(3);
  const [lambdaReg, setLambdaReg] = useState<number>(0.001);
  const [noiseStd, setNoiseStd] = useState<number>(0.2);
  const [sampleCount, setSampleCount] = useState<number>(15);

  // Experiment 2: Gradient Descent
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [momentum, setMomentum] = useState<number>(0.3);
  const [lossSurface, setLossSurface] = useState<'quadratic' | 'rosenbrock' | 'saddle'>('quadratic');
  const [gdStep, setGdStep] = useState<number>(25);

  // Experiment 3: SVM Margin
  const [svmC, setSvmC] = useState<number>(1.0);
  const [svmKernel, setSvmKernel] = useState<'linear' | 'rbf'>('linear');
  const [rbfGamma, setRbfGamma] = useState<number>(1.5);

  // Experiment 4: k-Means
  const [kClusters, setKClusters] = useState<number>(3);
  const [kMeansStep, setKMeansStep] = useState<number>(4);

  // Experiment 5: Reinforcement Learning
  const [rlGamma, setRlGamma] = useState<number>(0.9);
  const [rlEpsilon, setRlEpsilon] = useState<number>(0.15);
  const [rlEpisodes, setRlEpisodes] = useState<number>(50);

  // Shared state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    'Initializing interactive math engine...',
    'Simulation environment ready.',
  ]);

  // Polynomial Math calculation
  const polyData = useMemo(() => {
    // Generate synthetic points on [0, 1] from sin(2 * pi * x) + noise
    const seedPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const x = i / (sampleCount - 1);
      // Pseudo-random deterministic noise based on index
      const pseudoNoise = (Math.sin(i * 12.9898 + 78.233) * 0.5) * noiseStd;
      const y = Math.sin(2 * Math.PI * x) + pseudoNoise;
      seedPoints.push({ x, y });
    }

    // Solve Normal Equations: (X^T X + lambda I) w = X^T y
    const d = degree;
    const XTX: number[][] = Array(d + 1).fill(0).map(() => Array(d + 1).fill(0));
    const XTy: number[] = Array(d + 1).fill(0);

    for (let i = 0; i <= d; i++) {
      for (let j = 0; j <= d; j++) {
        let sum = 0;
        for (const pt of seedPoints) {
          sum += Math.pow(pt.x, i + j);
        }
        XTX[i][j] = sum + (i === j ? lambdaReg : 0);
      }
      let sumY = 0;
      for (const pt of seedPoints) {
        sumY += Math.pow(pt.x, i) * pt.y;
      }
      XTy[i] = sumY;
    }

    // Gaussian elimination to solve for weights w
    const A = XTX.map((row, i) => [...row, XTy[i]]);
    const n = d + 1;
    for (let i = 0; i < n; i++) {
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k < n + 1; k++) {
        const tmp = A[maxRow][k];
        A[maxRow][k] = A[i][k];
        A[i][k] = tmp;
      }
      if (Math.abs(A[i][i]) < 1e-12) continue;
      for (let k = i + 1; k < n; k++) {
        const c = -A[k][i] / A[i][i];
        for (let j = i; j < n + 1; j++) {
          if (i === j) A[k][j] = 0;
          else A[k][j] += c * A[i][j];
        }
      }
    }
    const weights: number[] = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      if (Math.abs(A[i][i]) > 1e-12) {
        weights[i] = A[i][n] / A[i][i];
        for (let k = i - 1; k >= 0; k--) {
          A[k][n] -= A[k][i] * weights[i];
        }
      }
    }

    // Generate fitted curve points on [0, 1]
    const curvePoints: { x: number; y: number }[] = [];
    const step = 0.02;
    let totalError = 0;
    for (let x = 0; x <= 1.0001; x += step) {
      let yPred = 0;
      for (let p = 0; p <= d; p++) {
        yPred += weights[p] * Math.pow(x, p);
      }
      curvePoints.push({ x, y: yPred });
    }

    // Compute training MSE
    for (const pt of seedPoints) {
      let yPred = 0;
      for (let p = 0; p <= d; p++) {
        yPred += weights[p] * Math.pow(pt.x, p);
      }
      totalError += Math.pow(pt.y - yPred, 2);
    }
    const mse = totalError / seedPoints.length;
    const normW = Math.sqrt(weights.reduce((sum, w) => sum + w * w, 0));

    return { seedPoints, curvePoints, weights, mse, normW };
  }, [degree, lambdaReg, noiseStd, sampleCount]);

  // Gradient Descent trajectory calculation
  const gdTrajectory = useMemo(() => {
    const trajectory: { x: number; y: number; loss: number }[] = [];
    let w1 = 1.8;
    let w2 = 1.6;
    let v1 = 0;
    let v2 = 0;

    for (let s = 0; s < gdStep; s++) {
      let loss = 0;
      let grad1 = 0;
      let grad2 = 0;

      if (lossSurface === 'quadratic') {
        // E(w) = 0.5 * (w1^2 + 8 * w2^2)
        loss = 0.5 * (w1 * w1 + 8 * w2 * w2);
        grad1 = w1;
        grad2 = 8 * w2;
      } else if (lossSurface === 'rosenbrock') {
        // E(w) = (1 - w1)^2 + 10 * (w2 - w1^2)^2
        loss = Math.pow(1 - w1, 2) + 10 * Math.pow(w2 - w1 * w1, 2);
        grad1 = -2 * (1 - w1) - 40 * w1 * (w2 - w1 * w1);
        grad2 = 20 * (w2 - w1 * w1);
      } else {
        // Saddle point: E(w) = w1^2 - w2^2
        loss = 0.5 * (w1 * w1 - w2 * w2);
        grad1 = w1;
        grad2 = -w2;
      }

      trajectory.push({ x: w1, y: w2, loss });
      v1 = momentum * v1 - learningRate * grad1;
      v2 = momentum * v2 - learningRate * grad2;
      w1 += v1;
      w2 += v2;
    }
    return trajectory;
  }, [learningRate, momentum, lossSurface, gdStep]);

  return (
    <div className="space-y-6">
      {/* Experiment Tab Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs">
        {[
          { id: 'polynomial', label: '01 :: Polynomial & Bias-Variance', tag: 'Ch.2 & Ch.4' },
          { id: 'gradient-descent', label: '02 :: Gradient Descent & Loss', tag: 'Ch.10 & Ch.11' },
          { id: 'svm-margin', label: '03 :: Support Vector Margin', tag: 'Ch.13' },
          { id: 'kmeans', label: '04 :: k-Means Clustering', tag: 'Ch.7' },
          { id: 'reinforcement', label: '05 :: MDP & Q-Learning', tag: 'Ch.18' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveExp(tab.id as ExperimentType)}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeExp === tab.id
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded ${
                activeExp === tab.id
                  ? 'bg-indigo-700 text-indigo-100'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}
            >
              {tab.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Main Split-Pane Workbench Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Canvas / Visualization Engine (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden flex flex-col">
          {/* Canvas Title Bar */}
          <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                CANVAS_VIEWPORT :: {activeExp.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">Adaptive SVG Vector Plane (600x400)</div>
          </div>

          {/* SVG Viewport */}
          <div className="relative aspect-[3/2] w-full bg-zinc-950 flex items-center justify-center p-4 select-none">
            {activeExp === 'polynomial' && (
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Subtle Grid */}
                <defs>
                  <pattern id="grid-poly" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="0.75"
                      strokeDasharray="2,2"
                    />
                  </pattern>
                </defs>
                <rect width="600" height="400" fill="url(#grid-poly)" />

                {/* Axes */}
                <line x1="50" y1="350" x2="550" y2="350" stroke="#52525b" strokeWidth="1.5" />
                <line x1="50" y1="50" x2="50" y2="350" stroke="#52525b" strokeWidth="1.5" />
                <text x="540" y="370" fill="#71717a" fontSize="11" fontFamily="monospace">x ∈ [0, 1]</text>
                <text x="30" y="45" fill="#71717a" fontSize="11" fontFamily="monospace">y</text>

                {/* True Function: sin(2 * pi * x) */}
                <path
                  d={Array.from({ length: 100 }, (_, i) => {
                    const x = i / 99;
                    const y = Math.sin(2 * Math.PI * x);
                    const sx = 50 + x * 500;
                    const sy = 200 - y * 130;
                    return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity="0.85"
                />

                {/* Fitted Polynomial Curve */}
                <path
                  d={polyData.curvePoints
                    .map((pt, i) => {
                      const sx = 50 + pt.x * 500;
                      const sy = Math.max(50, Math.min(350, 200 - pt.y * 130));
                      return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3"
                />

                {/* Seed Noisy Observations */}
                {polyData.seedPoints.map((pt, i) => {
                  const sx = 50 + pt.x * 500;
                  const sy = Math.max(50, Math.min(350, 200 - pt.y * 130));
                  return (
                    <circle
                      key={i}
                      cx={sx}
                      cy={sy}
                      r="4.5"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            )}

            {activeExp === 'gradient-descent' && (
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Contour rings representing loss surface */}
                {[20, 50, 90, 140, 200, 270].map((r, idx) => (
                  <ellipse
                    key={idx}
                    cx="300"
                    cy="200"
                    rx={r * (lossSurface === 'quadratic' ? 1.4 : 1.1)}
                    ry={r * (lossSurface === 'quadratic' ? 0.7 : 1.1)}
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}

                {/* Center Minimum */}
                <circle cx="300" cy="200" r="5" fill="#10b981" />
                <text x="312" y="204" fill="#10b981" fontSize="10" fontFamily="monospace">
                  w* (Global Minimum)
                </text>

                {/* Trajectory path */}
                <path
                  d={gdTrajectory
                    .map((pt, i) => {
                      const sx = 300 + pt.x * 120;
                      const sy = 200 - pt.y * 90;
                      return `${i === 0 ? 'M' : 'L'} ${sx} ${sy}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />

                {/* Trajectory step dots */}
                {gdTrajectory.map((pt, idx) => {
                  const sx = 300 + pt.x * 120;
                  const sy = 200 - pt.y * 90;
                  return (
                    <circle
                      key={idx}
                      cx={sx}
                      cy={sy}
                      r={idx === gdTrajectory.length - 1 ? '5' : '3'}
                      fill={idx === gdTrajectory.length - 1 ? '#ef4444' : '#fbbf24'}
                    />
                  );
                })}
              </svg>
            )}

            {activeExp === 'svm-margin' && (
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Hyperplane line w^T x + w0 = 0 */}
                <line x1="80" y1="360" x2="520" y2="40" stroke="#6366f1" strokeWidth="3" />
                {/* Positive margin */}
                <line
                  x1="130"
                  y1="360"
                  x2="570"
                  y2="40"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  opacity="0.6"
                />
                {/* Negative margin */}
                <line
                  x1="30"
                  y1="360"
                  x2="470"
                  y2="40"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  opacity="0.6"
                />

                {/* Class +1 points */}
                {[
                  { x: 380, y: 100 },
                  { x: 420, y: 150 },
                  { x: 470, y: 110 },
                  { x: 350, y: 160, isSv: true }, // Support vector
                ].map((pt, i) => (
                  <g key={`p-${i}`}>
                    {pt.isSv && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="2,2"
                      />
                    )}
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#38bdf8" />
                  </g>
                ))}

                {/* Class -1 points */}
                {[
                  { x: 180, y: 280 },
                  { x: 220, y: 320 },
                  { x: 140, y: 310 },
                  { x: 250, y: 240, isSv: true }, // Support vector
                ].map((pt, i) => (
                  <g key={`m-${i}`}>
                    {pt.isSv && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="2,2"
                      />
                    )}
                    <rect x={pt.x - 4} y={pt.y - 4} width="8" height="8" fill="#ec4899" />
                  </g>
                ))}

                <text x="360" y="80" fill="#38bdf8" fontSize="11" fontFamily="monospace">
                  Class +1 (Positive)
                </text>
                <text x="140" y="350" fill="#ec4899" fontSize="11" fontFamily="monospace">
                  Class -1 (Negative)
                </text>
                <text x="360" y="220" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                  Margin 2 / ||w||
                </text>
              </svg>
            )}

            {activeExp === 'kmeans' && (
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* 3 cluster clouds */}
                {[
                  { cx: 160, cy: 150, color: '#06b6d4' },
                  { cx: 440, cy: 130, color: '#10b981' },
                  { cx: 300, cy: 300, color: '#f59e0b' },
                ].slice(0, kClusters).map((cluster, cIdx) => (
                  <g key={cIdx}>
                    {/* Centroid marker */}
                    <polygon
                      points={`${cluster.cx},${cluster.cy - 12} ${cluster.cx + 10},${
                        cluster.cy + 8
                      } ${cluster.cx - 10},${cluster.cy + 8}`}
                      fill={cluster.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Dispersed points */}
                    {Array.from({ length: 8 }, (_, pIdx) => {
                      const angle = (pIdx / 8) * Math.PI * 2;
                      const rad = 30 + (pIdx % 3) * 15;
                      const px = cluster.cx + Math.cos(angle) * rad;
                      const py = cluster.cy + Math.sin(angle) * rad;
                      return (
                        <circle
                          key={pIdx}
                          cx={px}
                          cy={py}
                          r="4"
                          fill={cluster.color}
                          opacity="0.8"
                        />
                      );
                    })}
                  </g>
                ))}
              </svg>
            )}

            {activeExp === 'reinforcement' && (
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* 4x4 Gridworld */}
                <g transform="translate(140, 40)">
                  {[0, 1, 2, 3].map((r) =>
                    [0, 1, 2, 3].map((c) => {
                      const isGoal = r === 3 && c === 3;
                      const isPit = r === 1 && c === 1;
                      const val = isGoal ? '+1.0' : isPit ? '-1.0' : (0.1 * (r + c)).toFixed(2);
                      return (
                        <g key={`${r}-${c}`} transform={`translate(${c * 80}, ${r * 80})`}>
                          <rect
                            width="76"
                            height="76"
                            fill={isGoal ? '#065f46' : isPit ? '#991b1b' : '#27272a'}
                            stroke="#3f3f46"
                            strokeWidth="1.5"
                            rx="6"
                          />
                          <text
                            x="38"
                            y="44"
                            textAnchor="middle"
                            fill="#f4f4f5"
                            fontSize="12"
                            fontFamily="monospace"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })
                  )}
                  {/* Agent marker */}
                  <circle cx="40" cy="40" r="14" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x="40"
                    y="44"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    A
                  </text>
                </g>
              </svg>
            )}
          </div>

          {/* Canvas Bottom Legend */}
          <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-wrap items-center justify-between text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-4">
              {activeExp === 'polynomial' && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>Noisy Samples</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 bg-sky-400" />
                    <span>True sin(2πx)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 bg-indigo-400" />
                    <span>Polynomial Fit g(x|w)</span>
                  </span>
                </>
              )}
              {activeExp === 'gradient-descent' && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Descent Path</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Global Minimum</span>
                  </span>
                </>
              )}
              {activeExp === 'svm-margin' && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400 border border-amber-500" />
                    <span>Support Vectors (α &gt; 0)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 bg-indigo-500" />
                    <span>Optimal Hyperplane</span>
                  </span>
                </>
              )}
            </div>

            <div className="text-[11px] text-zinc-400">Real-time analytical recalculation</div>
          </div>
        </div>

        {/* Right Side: Interactive Parameter Sliders & Live Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Parameter Sliders Box */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-500" />
                <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  PARAMETER_CONTROLS
                </span>
              </div>
              <button
                onClick={() => {
                  setDegree(3);
                  setLambdaReg(0.001);
                  setNoiseStd(0.2);
                  setSampleCount(15);
                  setLearningRate(0.08);
                  setMomentum(0.3);
                }}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Sliders per Experiment */}
            {activeExp === 'polynomial' && (
              <div className="space-y-3">
                <ParameterSlider
                  label="Polynomial Degree"
                  symbol="d"
                  value={degree}
                  min={1}
                  max={9}
                  step={1}
                  onChange={setDegree}
                  description="Higher values increase model capacity and risk overfitting."
                />
                <ParameterSlider
                  label="L2 Regularization"
                  symbol="λ"
                  value={lambdaReg}
                  min={0.0}
                  max={0.1}
                  step={0.005}
                  onChange={setLambdaReg}
                  format={(v) => v.toFixed(3)}
                  description="Shrinks weight magnitude ||w|| to prevent wild oscillations."
                />
                <ParameterSlider
                  label="Gaussian Noise"
                  symbol="σ"
                  value={noiseStd}
                  min={0.05}
                  max={0.6}
                  step={0.05}
                  onChange={setNoiseStd}
                  format={(v) => v.toFixed(2)}
                  description="Sample observation variance in synthetic training labels."
                />
                <ParameterSlider
                  label="Sample Size"
                  symbol="N"
                  value={sampleCount}
                  min={8}
                  max={30}
                  step={1}
                  onChange={setSampleCount}
                />
              </div>
            )}

            {activeExp === 'gradient-descent' && (
              <div className="space-y-3">
                <ParameterSlider
                  label="Learning Rate"
                  symbol="η"
                  value={learningRate}
                  min={0.01}
                  max={0.25}
                  step={0.01}
                  onChange={setLearningRate}
                  format={(v) => v.toFixed(2)}
                  description="Step size along the negative loss gradient."
                />
                <ParameterSlider
                  label="Momentum Coefficient"
                  symbol="β"
                  value={momentum}
                  min={0.0}
                  max={0.9}
                  step={0.05}
                  onChange={setMomentum}
                  format={(v) => v.toFixed(2)}
                  description="Dampens oscillations across high-curvature ravines."
                />
                <ParameterSlider
                  label="Optimization Steps"
                  symbol="t"
                  value={gdStep}
                  min={5}
                  max={60}
                  step={5}
                  onChange={setGdStep}
                />
              </div>
            )}

            {activeExp === 'svm-margin' && (
              <div className="space-y-3">
                <ParameterSlider
                  label="Soft Margin Penalty"
                  symbol="C"
                  value={svmC}
                  min={0.1}
                  max={10.0}
                  step={0.5}
                  onChange={setSvmC}
                  format={(v) => v.toFixed(1)}
                  description="Balances margin maximization against slack penalties."
                />
                <ParameterSlider
                  label="RBF Bandwidth"
                  symbol="γ"
                  value={rbfGamma}
                  min={0.2}
                  max={5.0}
                  step={0.2}
                  onChange={setRbfGamma}
                  format={(v) => v.toFixed(1)}
                />
              </div>
            )}

            {activeExp === 'kmeans' && (
              <div className="space-y-3">
                <ParameterSlider
                  label="Clusters"
                  symbol="K"
                  value={kClusters}
                  min={2}
                  max={5}
                  step={1}
                  onChange={setKClusters}
                  description="Number of partition centroids to estimate."
                />
              </div>
            )}

            {activeExp === 'reinforcement' && (
              <div className="space-y-3">
                <ParameterSlider
                  label="Discount Factor"
                  symbol="γ"
                  value={rlGamma}
                  min={0.1}
                  max={0.99}
                  step={0.05}
                  onChange={setRlGamma}
                  format={(v) => v.toFixed(2)}
                  description="Future reward horizon weighting."
                />
                <ParameterSlider
                  label="Epsilon Exploration"
                  symbol="ε"
                  value={rlEpsilon}
                  min={0.01}
                  max={0.5}
                  step={0.02}
                  onChange={setRlEpsilon}
                  format={(v) => v.toFixed(2)}
                  description="Probability of selecting a random exploratory action."
                />
              </div>
            )}
          </div>

          {/* Live Telemetry Inspector */}
          <LiveInspector
            status="CONVERGED"
            metrics={
              activeExp === 'polynomial'
                ? [
                    { label: 'TRAINING_MSE', value: polyData.mse.toFixed(4) },
                    { label: 'WEIGHT_NORM_||w||', value: polyData.normW.toFixed(2) },
                    { label: 'CAPACITY_DEGREE', value: `${degree}` },
                    { label: 'REG_PENALTY_λ', value: lambdaReg.toFixed(3) },
                  ]
                : activeExp === 'gradient-descent'
                ? [
                    {
                      label: 'FINAL_LOSS',
                      value: gdTrajectory[gdTrajectory.length - 1].loss.toFixed(4),
                    },
                    { label: 'ITERATION_STEPS', value: gdStep },
                    { label: 'LEARNING_RATE_η', value: learningRate.toFixed(2) },
                    { label: 'MOMENTUM_β', value: momentum.toFixed(2) },
                  ]
                : [
                    { label: 'SUPPORT_VECTORS', value: '2' },
                    { label: 'MARGIN_WIDTH', value: '0.84' },
                    { label: 'PENALTY_C', value: svmC.toFixed(1) },
                    { label: 'CONVERGENCE', value: '100%' },
                  ]
            }
            equationHint={
              activeExp === 'polynomial'
                ? 'w = (X^T X + λI)^{-1} X^T y'
                : activeExp === 'gradient-descent'
                ? 'w_{t+1} = w_t - η ∇E(w_t) + β Δw_{t-1}'
                : activeExp === 'svm-margin'
                ? 'L_d(α) = Σ α_i - 0.5 Σ Σ α_i α_j r_i r_j (x_i · x_j)'
                : 'Q(s, a) ← Q(s, a) + η [r + γ max_a\' Q(s\', a\') - Q(s, a)]'
            }
            logs={logs}
          />
        </div>
      </div>
    </div>
  );
}
