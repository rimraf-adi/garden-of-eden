'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Network, Layers, Cpu } from 'lucide-react';

export default function Chapter11Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'propagation' | 'ridges' | 'surface'>('propagation');
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

    const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(Math.min(z, 10), -10)));

    // Non-linear dataset (XOR-like or circular island) in [-1, 1] x [-1, 1]
    const classPos = [
      { x: -0.4, y: 0.4 },
      { x: 0.4, y: -0.4 },
      { x: -0.5, y: 0.2 },
      { x: 0.2, y: -0.5 },
      { x: -0.2, y: 0.5 },
      { x: 0.5, y: -0.2 },
    ];
    const classNeg = [
      { x: -0.5, y: -0.5 },
      { x: 0.5, y: 0.5 },
      { x: -0.7, y: -0.3 },
      { x: 0.6, y: 0.3 },
      { x: -0.3, y: -0.7 },
      { x: 0.3, y: 0.7 },
      { x: 0.0, y: 0.0 },
    ];

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.02;
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
      const leftW = isMobile ? width : Math.floor(width * 0.54);
      const rightW = isMobile ? width : width - leftW;

      // -------------------------------------------------------------
      // Left Panel: Multilayer Perceptron Network Architecture & Flow
      // -------------------------------------------------------------
      const netLeft = 15;
      const netW = leftW - 30;

      // Header
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Multilayer Perceptron: Flow & Backpropagation (Fig 11.10)', netLeft + 15, 25);

      // Node coordinates for 3 layers:
      // Layer 0 (Input): x1, x2 (and bias x0)
      // Layer 1 (Hidden): z1, z2, z3, z4
      // Layer 2 (Output): y
      const layer0X = netLeft + netW * 0.16;
      const layer1X = netLeft + netW * 0.54;
      const layer2X = netLeft + netW * 0.88;

      const inputNodes = [
        { label: 'x₁', x: layer0X, y: height * 0.35, val: 0.7 },
        { label: 'x₂', x: layer0X, y: height * 0.65, val: 0.4 },
      ];

      const hiddenNodes = [
        { label: 'z₁', x: layer1X, y: height * 0.20, val: 0.85, angle: 0.4 },
        { label: 'z₂', x: layer1X, y: height * 0.40, val: 0.25, angle: 1.8 },
        { label: 'z₃', x: layer1X, y: height * 0.60, val: 0.90, angle: 3.5 },
        { label: 'z₄', x: layer1X, y: height * 0.80, val: 0.15, angle: 5.1 },
      ];

      const outputNodes = [{ label: 'y', x: layer2X, y: height * 0.50, val: 0.82 }];

      // Loop phase: 0 to 6 seconds cycle
      // 0.0 - 2.8s: Forward pass (signal pulses x -> z -> y)
      // 2.8 - 3.4s: Output error evaluation (r - y)
      // 3.4 - 5.8s: Backpropagation pass (error delta pulses y -> z -> x)
      // 5.8 - 6.0s: Pause & reset
      const cycle = t % 6.0;
      const isForward = cycle < 3.0;
      const isErrorEval = cycle >= 3.0 && cycle < 3.6;
      const isBackprop = cycle >= 3.6 && cycle < 5.8;

      // Draw Connections (Synapses)
      // Layer 0 to Layer 1 (Inputs to Hidden)
      inputNodes.forEach((inp, i) => {
        hiddenNodes.forEach((hid, j) => {
          ctx.beginPath();
          ctx.moveTo(inp.x, inp.y);
          ctx.lineTo(hid.x, hid.y);
          // Color based on weight sign/strength
          const isPos = (i + j) % 2 === 0;
          ctx.strokeStyle = isPos ? 'rgba(56, 189, 248, 0.25)' : 'rgba(168, 85, 247, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });
      });

      // Layer 1 to Layer 2 (Hidden to Output)
      hiddenNodes.forEach((hid, j) => {
        outputNodes.forEach((out) => {
          ctx.beginPath();
          ctx.moveTo(hid.x, hid.y);
          ctx.lineTo(out.x, out.y);
          const isPos = j % 2 === 0;
          ctx.strokeStyle = isPos ? 'rgba(56, 189, 248, 0.35)' : 'rgba(236, 72, 153, 0.35)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        });
      });

      // Animated Pulses along Synapses
      if (isForward) {
        // Forward propagation pulse:
        // Input -> Hidden pulse phase: cycle 0.0 to 1.4
        // Hidden -> Output pulse phase: cycle 1.4 to 2.8
        const fProg1 = Math.min(cycle / 1.4, 1);
        const fProg2 = Math.max(Math.min((cycle - 1.4) / 1.4, 1), 0);

        // Pulses from Layer 0 to 1
        inputNodes.forEach((inp) => {
          hiddenNodes.forEach((hid) => {
            const px = inp.x + (hid.x - inp.x) * fProg1;
            const py = inp.y + (hid.y - inp.y) * fProg1;
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
        });

        // Pulses from Layer 1 to 2
        if (cycle >= 1.4) {
          hiddenNodes.forEach((hid) => {
            outputNodes.forEach((out) => {
              const px = hid.x + (out.x - hid.x) * fProg2;
              const py = hid.y + (out.y - hid.y) * fProg2;
              ctx.beginPath();
              ctx.arc(px, py, 4, 0, Math.PI * 2);
              ctx.fillStyle = '#818cf8';
              ctx.shadowColor = '#818cf8';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0;
            });
          });
        }
      } else if (isBackprop) {
        // Backprop error pulse:
        // Output -> Hidden phase: cycle 3.6 to 4.7
        // Hidden -> Input phase: cycle 4.7 to 5.8
        const bProg1 = Math.min((cycle - 3.6) / 1.1, 1);
        const bProg2 = Math.max(Math.min((cycle - 4.7) / 1.1, 1), 0);

        // Pulses flowing BACK from Layer 2 to Layer 1
        outputNodes.forEach((out) => {
          hiddenNodes.forEach((hid) => {
            const px = out.x - (out.x - hid.x) * bProg1;
            const py = out.y - (out.y - hid.y) * bProg1;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
        });

        // Pulses flowing BACK from Layer 1 to Layer 0
        if (cycle >= 4.7) {
          hiddenNodes.forEach((hid) => {
            inputNodes.forEach((inp) => {
              const px = hid.x - (hid.x - inp.x) * bProg2;
              const py = hid.y - (hid.y - inp.y) * bProg2;
              ctx.beginPath();
              ctx.arc(px, py, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#f43f5e';
              ctx.shadowColor = '#f43f5e';
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            });
          });
        }
      }

      // Draw Nodes
      // Helper function to draw node with active halo
      const drawNode = (
        x: number,
        y: number,
        r: number,
        label: string,
        subtitle: string,
        color: string,
        isActive: boolean
      ) => {
        ctx.save();
        if (isActive) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 14;
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#090d16';
        ctx.fill();
        ctx.strokeStyle = isActive ? '#ffffff' : color;
        ctx.lineWidth = isActive ? 2.5 : 1.8;
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(label, x, y - (subtitle ? 4 : 0));

        if (subtitle) {
          ctx.fillStyle = color;
          ctx.font = '8px sans-serif';
          ctx.fillText(subtitle, x, y + 8);
        }
      };

      // Input Nodes
      inputNodes.forEach((node) => {
        drawNode(node.x, node.y, 20, node.label, 'Input', '#38bdf8', isForward && cycle < 1.4);
      });

      // Hidden Nodes
      hiddenNodes.forEach((node, i) => {
        const isAct = (isForward && cycle >= 1.4 && cycle < 2.8) || (isBackprop && cycle >= 3.6 && cycle < 4.7);
        drawNode(node.x, node.y, 18, node.label, 'σ(wᵀx)', '#a855f7', isAct);
      });

      // Output Node
      const outAct = isErrorEval || (isForward && cycle >= 2.5);
      drawNode(
        outputNodes[0].x,
        outputNodes[0].y,
        22,
        outputNodes[0].label,
        isErrorEval ? 'δ = r-y' : 'Output',
        isErrorEval ? '#f43f5e' : '#10b981',
        outAct
      );

      // Phase Status Banner at bottom of network panel
      ctx.fillStyle = isForward ? '#38bdf8' : isErrorEval ? '#fbbf24' : '#f43f5e';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        isForward
          ? '▸ PHASE 1: FORWARD PASS (Activations z_h = σ(w_hᵀx))'
          : isErrorEval
          ? '▸ PHASE 2: ERROR SIGNAL COMPUTATION (δ = (r - y) y(1 - y))'
          : '▸ PHASE 3: BACKPROPAGATION (Gradient Updates Δw_hj = η δ_h x_j)',
        netLeft + 15,
        height - 18
      );

      // -------------------------------------------------------------
      // Right Panel: Feature Space & Ridge Combination (Fig 11.6)
      // -------------------------------------------------------------
      const rightLeft = leftW + 10;
      const rightAvailW = width - rightLeft - 20;
      const spaceMargin = { left: 35, right: 15, top: 40, bottom: 45 };
      const plotW = rightAvailW - spaceMargin.left - spaceMargin.right;
      const plotH = height - spaceMargin.top - spaceMargin.bottom;

      // Divider
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftW + 5, 20);
      ctx.lineTo(leftW + 5, height - 20);
      ctx.stroke();

      // Title
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Hidden Unit Ridges & Decision Region (Fig 11.6)', rightLeft, spaceMargin.top - 18);

      const toScreenX = (x: number) => rightLeft + spaceMargin.left + ((x + 1) / 2) * plotW;
      const toScreenY = (y: number) => spaceMargin.top + ((1 - y) / 2) * plotH;

      // Draw non-linear decision region contour
      // Combining 4 sigmoids forms a convex diamond/ellipse in the center
      ctx.save();
      ctx.beginPath();
      ctx.rect(rightLeft + spaceMargin.left, spaceMargin.top, plotW, plotH);
      ctx.clip();

      // Shaded non-linear decision region
      const pulseSize = 0.45 + 0.04 * Math.sin(t * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const numPts = 36;
      for (let i = 0; i <= numPts; i++) {
        const theta = (i / numPts) * Math.PI * 2;
        // Bounded diamond-like curve from intersecting 4 hyperplanes
        const rx = pulseSize * Math.cos(theta) * (0.8 + 0.2 * Math.cos(2 * theta));
        const ry = pulseSize * Math.sin(theta) * (0.8 - 0.2 * Math.cos(2 * theta));
        const sx = toScreenX(rx);
        const sy = toScreenY(ry);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw the 4 individual hidden unit hyperplanes (w_h^T x + w_h0 = 0)
      if (mode === 'ridges' || mode === 'propagation') {
        const angles = [0.4, 1.8, 3.5, 5.1];
        angles.forEach((ang, idx) => {
          const nx = Math.cos(ang);
          const ny = Math.sin(ang);
          const offset = 0.35;

          // Line perpendicular to (nx, ny): (nx * x + ny * y - offset = 0)
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(toScreenX(-ny * 1.5 + nx * offset), toScreenY(nx * 1.5 + ny * offset));
          ctx.lineTo(toScreenX(ny * 1.5 + nx * offset), toScreenY(-nx * 1.5 + ny * offset));
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#c084fc';
          ctx.font = '9px monospace';
          ctx.fillText(`z${idx + 1}=0`, toScreenX(nx * (offset + 0.15)), toScreenY(ny * (offset + 0.15)));
        });
      }

      ctx.restore();

      // Feature Space Axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(toScreenX(0), spaceMargin.top);
      ctx.lineTo(toScreenX(0), spaceMargin.top + plotH);
      ctx.moveTo(rightLeft + spaceMargin.left, toScreenY(0));
      ctx.lineTo(rightLeft + spaceMargin.left + plotW, toScreenY(0));
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '10px sans-serif';
      ctx.fillText('x₁', rightLeft + spaceMargin.left + plotW - 12, toScreenY(0) + 14);
      ctx.fillText('x₂', toScreenX(0) + 6, spaceMargin.top + 10);

      // Draw Data points
      // Positive class (inside combined convex region)
      classPos.forEach((p) => {
        const px = toScreenX(p.x);
        const py = toScreenY(p.y);
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Negative class (outside region)
      classNeg.forEach((p) => {
        const px = toScreenX(p.x);
        const py = toScreenY(p.y);
        ctx.beginPath();
        ctx.rect(px - 4, py - 4, 8, 8);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Legend in bottom right
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '9px sans-serif';
      ctx.fillText('● Class + (y > 0.5)   ■ Class - (y ≤ 0.5)', rightLeft + 15, height - 16);

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
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            Chapter 11: Multilayer Perceptrons
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Forward Signal Activations, Error Backpropagation, and Non-Linear Ridge Combination (Alpaydın Figs 11.6, 11.10)
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setMode('propagation')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'propagation'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Forward & Backprop
          </button>
          <button
            onClick={() => setMode('ridges')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'ridges'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Hidden Hyperplanes
          </button>
          <button
            onClick={() => setMode('surface')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'surface'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Non-Linear Region
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
          <strong>Figure 11.6 & 11.10 Emulation:</strong> Left side displays 2-layer network forward pass pulses{' '}
          <em>(x → z → y)</em> followed by reverse error signal backpropagation <em>(δ = r − y)</em> updating synaptic weights.
          Right side shows the 4 hidden unit sigmoidal hyperplanes combining to construct a closed, non-linear convex decision region.
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-purple-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
