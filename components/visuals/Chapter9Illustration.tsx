'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, GitBranch, Crosshair, BarChart3 } from 'lucide-react';

export default function Chapter9Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'splits' | 'traversal' | 'entropy'>('splits');
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

    // Fixed 2D sample dataset (Alpaydın Fig 9.1 style)
    // Space bounds normalized to [0, 1] x [0, 1]
    // Classes: 0 = Class A (Cyan circle), 1 = Class B (Amber square)
    const points = [
      // Region 1: x1 < 0.45, x2 > 0.55 -> Pure Class A (Cyan)
      { x: 0.12, y: 0.82, c: 0 },
      { x: 0.22, y: 0.70, c: 0 },
      { x: 0.35, y: 0.85, c: 0 },
      { x: 0.18, y: 0.60, c: 0 },
      { x: 0.38, y: 0.65, c: 0 },
      { x: 0.28, y: 0.78, c: 0 },

      // Region 2: x1 < 0.45, x2 <= 0.55 -> Pure Class B (Amber)
      { x: 0.15, y: 0.25, c: 1 },
      { x: 0.25, y: 0.40, c: 1 },
      { x: 0.38, y: 0.20, c: 1 },
      { x: 0.18, y: 0.12, c: 1 },
      { x: 0.32, y: 0.35, c: 1 },
      { x: 0.40, y: 0.48, c: 1 },

      // Region 3: x1 >= 0.45, x2 > 0.40, x1 < 0.75 -> Pure Class B (Amber)
      { x: 0.52, y: 0.72, c: 1 },
      { x: 0.65, y: 0.85, c: 1 },
      { x: 0.58, y: 0.52, c: 1 },
      { x: 0.70, y: 0.65, c: 1 },
      { x: 0.62, y: 0.78, c: 1 },

      // Region 4: x1 >= 0.75, x2 > 0.40 -> Pure Class A (Cyan)
      { x: 0.80, y: 0.75, c: 0 },
      { x: 0.90, y: 0.82, c: 0 },
      { x: 0.85, y: 0.55, c: 0 },
      { x: 0.92, y: 0.62, c: 0 },

      // Region 5: x1 >= 0.45, x2 <= 0.40 -> Pure Class A (Cyan)
      { x: 0.55, y: 0.18, c: 0 },
      { x: 0.68, y: 0.28, c: 0 },
      { x: 0.82, y: 0.15, c: 0 },
      { x: 0.88, y: 0.32, c: 0 },
      { x: 0.72, y: 0.10, c: 0 },
    ];

    // Split thresholds (Alpaydın Fig 9.1)
    const S1 = 0.45; // Split 1: x1 = 0.45
    const S2 = 0.55; // Split 2: x2 = 0.55 (in left region x1 < 0.45)
    const S3 = 0.40; // Split 3: x2 = 0.40 (in right region x1 >= 0.45)
    const S4 = 0.75; // Split 4: x1 = 0.75 (in right top region x1 >= 0.45, x2 > 0.40)

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

      // Split screen into two views:
      // Left View: 2D Feature Space (x1, x2)
      // Right View: Decision Tree Graph
      const isMobile = width < 640;
      const spaceWidth = isMobile ? width : Math.floor(width * 0.50);
      const treeWidth = isMobile ? width : width - spaceWidth;
      const spaceMargin = { left: 45, right: 25, top: 40, bottom: 45 };
      const plotW = spaceWidth - spaceMargin.left - spaceMargin.right;
      const plotH = height - spaceMargin.top - spaceMargin.bottom;

      // Coordinate transformers for 2D space:
      // x: [0, 1] -> [left, left + plotW]
      // y: [0, 1] -> [bottom, top] (invert y so (0,0) is bottom-left)
      const toScreenX = (x: number) => spaceMargin.left + x * plotW;
      const toScreenY = (y: number) => spaceMargin.top + (1 - y) * plotH;

      // Animation phase timing (cycle length ~ 8 seconds)
      const cycle = t % 8.0;
      // Progress of each split in [0, 1]:
      // 0.0 - 1.5: Split 1 sweeps and locks
      // 1.5 - 3.0: Split 2 sweeps and locks
      // 3.0 - 4.5: Split 3 sweeps and locks
      // 4.5 - 6.0: Split 4 sweeps and locks
      // 6.0 - 8.0: Highlighting leaf boxes & query traversal
      const p1 = Math.min(Math.max((cycle - 0.2) / 1.0, 0), 1);
      const p2 = Math.min(Math.max((cycle - 1.5) / 1.0, 0), 1);
      const p3 = Math.min(Math.max((cycle - 2.8) / 1.0, 0), 1);
      const p4 = Math.min(Math.max((cycle - 4.1) / 1.0, 0), 1);

      // Shaded leaf regions as splits lock
      if (p1 >= 1 && p2 >= 1) {
        // Region 1 (Leaf R1): x1 < S1, x2 > S2 -> Class A (Cyan)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(toScreenX(0), toScreenY(1), S1 * plotW, (1 - S2) * plotH);

        // Region 2 (Leaf R2): x1 < S1, x2 <= S2 -> Class B (Amber)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fillRect(toScreenX(0), toScreenY(S2), S1 * plotW, S2 * plotH);
      }

      if (p1 >= 1 && p3 >= 1) {
        // Region 5 (Leaf R5): x1 >= S1, x2 <= S3 -> Class A (Cyan)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(toScreenX(S1), toScreenY(S3), (1 - S1) * plotW, S3 * plotH);
      }

      if (p1 >= 1 && p3 >= 1 && p4 >= 1) {
        // Region 3 (Leaf R3): x1 in [S1, S4], x2 in [S3, 1] -> Class B (Amber)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fillRect(toScreenX(S1), toScreenY(1), (S4 - S1) * plotW, (1 - S3) * plotH);

        // Region 4 (Leaf R4): x1 >= S4, x2 in [S3, 1] -> Class A (Cyan)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(toScreenX(S4), toScreenY(1), (1 - S4) * plotW, (1 - S3) * plotH);
      }

      // Feature Space Axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Y-axis
      ctx.moveTo(spaceMargin.left, spaceMargin.top - 10);
      ctx.lineTo(spaceMargin.left, spaceMargin.top + plotH);
      // X-axis
      ctx.lineTo(spaceMargin.left + plotW + 10, spaceMargin.top + plotH);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '11px sans-serif';
      ctx.fillText('x₁ (Attribute 1) →', spaceMargin.left + plotW - 60, spaceMargin.top + plotH + 30);
      ctx.save();
      ctx.translate(16, spaceMargin.top + plotH / 2 + 30);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('x₂ (Attribute 2) →', 0, 0);
      ctx.restore();

      // Space Title
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Feature Space (Orthogonal Splits)', spaceMargin.left, spaceMargin.top - 18);

      // Draw Split Lines
      // Split 1: x1 = S1 (Vertical across whole space)
      if (p1 > 0) {
        const sweepX = toScreenX(p1 < 1 ? p1 * S1 * 1.3 : S1);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(sweepX, toScreenY(0));
        ctx.lineTo(sweepX, toScreenY(1));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('x₁=w₁₀', sweepX - 18, toScreenY(0) + 16);
      }

      // Split 2: x2 = S2 (Horizontal, left side only: x1 < S1)
      if (p2 > 0) {
        const sweepY = toScreenY(p2 < 1 ? p2 * S2 * 1.2 : S2);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(toScreenX(0), sweepY);
        ctx.lineTo(toScreenX(S1), sweepY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('x₂=w₂₀', toScreenX(0) + 5, sweepY - 5);
      }

      // Split 3: x2 = S3 (Horizontal, right side: x1 >= S1)
      if (p3 > 0) {
        const sweepY = toScreenY(p3 < 1 ? p3 * S3 * 1.2 : S3);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(toScreenX(S1), sweepY);
        ctx.lineTo(toScreenX(1), sweepY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('x₂=w₃₀', toScreenX(S1) + 8, sweepY + 14);
      }

      // Split 4: x1 = S4 (Vertical, top right: x1 >= S1, x2 > S3)
      if (p4 > 0) {
        const sweepX = toScreenX(p4 < 1 ? S1 + p4 * (S4 - S1) : S4);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(sweepX, toScreenY(S3));
        ctx.lineTo(sweepX, toScreenY(1));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('x₁=w₄₀', sweepX - 16, toScreenY(1) - 6);
      }

      // Leaf Box Labels (R1 .. R5)
      if (p1 >= 1 && p2 >= 1 && p3 >= 1 && p4 >= 1) {
        ctx.font = 'bold 12px sans-serif';
        // R1: Cyan
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.fillText('R₁', toScreenX(0.20), toScreenY(0.70));
        // R2: Amber
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.fillText('R₂', toScreenX(0.20), toScreenY(0.30));
        // R3: Amber
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.fillText('R₃', toScreenX(0.58), toScreenY(0.65));
        // R4: Cyan
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.fillText('R₄', toScreenX(0.85), toScreenY(0.65));
        // R5: Cyan
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.fillText('R₅', toScreenX(0.68), toScreenY(0.25));
      }

      // Draw Dataset Points
      points.forEach((p) => {
        const px = toScreenX(p.x);
        const py = toScreenY(p.y);
        ctx.beginPath();
        if (p.c === 0) {
          // Class A: Cyan Circle
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          // Class B: Amber Square
          ctx.rect(px - 4, py - 4, 8, 8);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // Query Sample Traversal Animation (Cycle 5.5 to 7.8)
      let activeQueryPath: string[] = [];
      if (cycle >= 5.0 && cycle < 7.8) {
        // Query sample at (x1=0.88, x2=0.72) -> belongs to Leaf R4 (Cyan Class A)
        const qx = 0.88;
        const qy = 0.72;
        const screenQx = toScreenX(qx);
        const screenQy = toScreenY(qy);

        // Pulsing glow
        const pulse = (Math.sin(t * 8) + 1) / 2;
        ctx.beginPath();
        ctx.arc(screenQx, screenQy, 8 + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.35 - pulse * 0.2})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(screenQx, screenQy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('x*', screenQx + 10, screenQy - 8);

        // Path: Root(x1>w10) -> Right(x2>w30) -> Right(x1>w40) -> Leaf R4
        activeQueryPath = ['node1', 'node3', 'node4', 'R4'];
      }

      // -------------------------------------------------------------
      // Right View: Decision Tree Diagram (Alpaydın Fig 9.1(b))
      // -------------------------------------------------------------
      const treeLeft = spaceWidth + 10;
      const treeAvailW = width - treeLeft - 15;

      // Divider line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(treeLeft - 5, 20);
      ctx.lineTo(treeLeft - 5, height - 20);
      ctx.stroke();

      // Tree Diagram Header
      ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
      ctx.font = '600 12px sans-serif';
      ctx.fillText('Decision Tree Architecture (Fig 9.1)', treeLeft + 10, spaceMargin.top - 18);

      // Node coordinate setup
      const rootX = treeLeft + treeAvailW * 0.50;
      const rootY = 65;

      // Level 1: Left Node (x2 > w20), Right Node (x2 > w30)
      const n2X = treeLeft + treeAvailW * 0.22;
      const n2Y = 145;
      const n3X = treeLeft + treeAvailW * 0.76;
      const n3Y = 145;

      // Level 2 Leaves for n2: R1 (x2 > w20, Left) and R2 (x2 <= w20, Right)
      const r1X = treeLeft + treeAvailW * 0.11;
      const r1Y = 230;
      const r2X = treeLeft + treeAvailW * 0.33;
      const r2Y = 230;

      // Level 2 for n3: Leaf R5 (x2 <= w30, Left) and Node 4 (x1 > w40, Right)
      const r5X = treeLeft + treeAvailW * 0.58;
      const r5Y = 230;
      const n4X = treeLeft + treeAvailW * 0.88;
      const n4Y = 230;

      // Level 3 Leaves for n4: R3 (Left) and R4 (Right)
      const r3X = treeLeft + treeAvailW * 0.77;
      const r3Y = 310;
      const r4X = treeLeft + treeAvailW * 0.94;
      const r4Y = 310;

      // Helper function to draw branch edge with glow if query travels
      const drawBranch = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        label: string,
        isActive: boolean,
        isPath: boolean
      ) => {
        if (!isActive) return;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isPath ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = isPath ? 2.5 : 1.5;
        ctx.stroke();

        // Branch condition text (True / False or > / <=)
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        ctx.fillStyle = isPath ? '#38bdf8' : '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(label, mx - 8, my - 3);
      };

      // Helper to draw decision node
      const drawDecisionNode = (x: number, y: number, text: string, color: string, isActive: boolean, isPath: boolean) => {
        if (!isActive) return;
        const nw = 56;
        const nh = 26;
        ctx.save();
        if (isPath) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
        }
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = isPath ? '#38bdf8' : color;
        ctx.lineWidth = isPath ? 2.5 : 1.8;
        ctx.beginPath();
        ctx.roundRect(x - nw / 2, y - nh / 2, nw, nh, 6);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
      };

      // Helper to draw leaf node
      const drawLeafNode = (
        x: number,
        y: number,
        name: string,
        classLabel: string,
        isClassA: boolean,
        isActive: boolean,
        isPath: boolean
      ) => {
        if (!isActive) return;
        const nw = 42;
        const nh = 28;
        ctx.save();
        if (isPath) {
          ctx.shadowColor = isClassA ? '#06b6d4' : '#f59e0b';
          ctx.shadowBlur = 14;
        }
        ctx.fillStyle = isClassA ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)';
        ctx.strokeStyle = isPath ? '#ffffff' : isClassA ? '#06b6d4' : '#f59e0b';
        ctx.lineWidth = isPath ? 2.5 : 1.6;
        ctx.beginPath();
        ctx.roundRect(x - nw / 2, y - nh / 2, nw, nh, 5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isClassA ? '#22d3ee' : '#fbbf24';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(name, x, y - 5);
        ctx.font = '8px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(classLabel, x, y + 6);
      };

      // Draw Tree Edges
      // Root to Level 1
      drawBranch(rootX, rootY + 13, n2X, n2Y - 13, '≤w₁₀', p1 > 0.4, false);
      drawBranch(
        rootX,
        rootY + 13,
        n3X,
        n3Y - 13,
        '>w₁₀',
        p1 > 0.4,
        activeQueryPath.includes('node1') && activeQueryPath.includes('node3')
      );

      // Node 2 to Leaves R1, R2
      drawBranch(n2X, n2Y + 13, r1X, r1Y - 14, '>w₂₀', p2 > 0.4, false);
      drawBranch(n2X, n2Y + 13, r2X, r2Y - 14, '≤w₂₀', p2 > 0.4, false);

      // Node 3 to R5, Node 4
      drawBranch(n3X, n3Y + 13, r5X, r5Y - 14, '≤w₃₀', p3 > 0.4, false);
      drawBranch(
        n3X,
        n3Y + 13,
        n4X,
        n4Y - 13,
        '>w₃₀',
        p3 > 0.4,
        activeQueryPath.includes('node3') && activeQueryPath.includes('node4')
      );

      // Node 4 to Leaves R3, R4
      drawBranch(n4X, n4Y + 13, r3X, r3Y - 14, '≤w₄₀', p4 > 0.4, false);
      drawBranch(
        n4X,
        n4Y + 13,
        r4X,
        r4Y - 14,
        '>w₄₀',
        p4 > 0.4,
        activeQueryPath.includes('node4') && activeQueryPath.includes('R4')
      );

      // Draw Nodes
      drawDecisionNode(rootX, rootY, 'x₁ > w₁₀', '#38bdf8', true, activeQueryPath.includes('node1'));
      drawDecisionNode(n2X, n2Y, 'x₂ > w₂₀', '#a855f7', p2 > 0, false);
      drawDecisionNode(n3X, n3Y, 'x₂ > w₃₀', '#ec4899', p3 > 0, activeQueryPath.includes('node3'));
      drawDecisionNode(n4X, n4Y, 'x₁ > w₄₀', '#10b981', p4 > 0, activeQueryPath.includes('node4'));

      // Draw Leaves
      drawLeafNode(r1X, r1Y, 'R₁', 'Class A', true, p2 >= 1, false);
      drawLeafNode(r2X, r2Y, 'R₂', 'Class B', false, p2 >= 1, false);
      drawLeafNode(r5X, r5Y, 'R₅', 'Class A', true, p3 >= 1, false);
      drawLeafNode(r3X, r3Y, 'R₃', 'Class B', false, p4 >= 1, false);
      drawLeafNode(r4X, r4Y, 'R₄', 'Class A', true, p4 >= 1, activeQueryPath.includes('R4'));

      // Info badge / metric HUD in bottom right
      if (mode === 'entropy') {
        const hudX = treeLeft + 15;
        const hudY = height - 55;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, treeAvailW - 30, 42, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('SPLIT PURITY (ENTROPY & GINI)', hudX + 10, hudY + 16);
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '9px sans-serif';
        const infoGain = (0.98 - (p4 >= 1 ? 0.0 : p3 >= 1 ? 0.15 : p2 >= 1 ? 0.42 : 0.7)).toFixed(2);
        ctx.fillText(`ΔI = I(D) - ∑ |Dᵥ|/|D| I(Dᵥ)  |  Current Information Gain: ${infoGain} bits`, hudX + 10, hudY + 31);
      }

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
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            Chapter 9: Decision Trees
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Orthogonal Axis-Aligned Splits Partitioning 2D Space into Pure Leaf Boxes (Alpaydın Fig 9.1)
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setMode('splits')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'splits'
                ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            Recursive Splits
          </button>
          <button
            onClick={() => setMode('traversal')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'traversal'
                ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            Tree Traversal
          </button>
          <button
            onClick={() => setMode('entropy')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'entropy'
                ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Impurity & Gain
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
          <strong>Figure 9.1 Emulation:</strong> Left side displays recursive orthogonal cuts dividing feature space{' '}
          <em>(x₁, x₂)</em> into pure rectangular leaf boxes <em>R₁..R₅</em>. Right side renders the corresponding binary
          decision tree evaluating univariate tests <em>xⱼ &gt; wₘ₀</em>.
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
