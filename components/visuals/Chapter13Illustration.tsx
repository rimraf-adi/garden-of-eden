'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Shield, Box, HelpCircle } from 'lucide-react';

export default function Chapter13Illustration() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'margin' | 'slack' | 'kernel3d'>('margin');
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

    interface Point2D {
      x: number;
      y: number;
      isSV: boolean;
      alpha: number;
      slack?: number;
    }

    // Hard-margin separable dataset (Alpaydın Fig 13.1)
    // Support vectors lie on margins: x + y = 1.0 (pos margin) and x + y = -0.4 (neg margin)
    // Normal vector direction roughly (1, 1) normalized
    const classPosHard: Point2D[] = [
      { x: 0.20, y: 0.50, isSV: true, alpha: 0.8 }, // Support Vector 1
      { x: 0.55, y: 0.15, isSV: true, alpha: 0.7 }, // Support Vector 2
      { x: 0.45, y: 0.65, isSV: false, alpha: 0 },
      { x: 0.70, y: 0.40, isSV: false, alpha: 0 },
      { x: 0.35, y: 0.85, isSV: false, alpha: 0 },
      { x: 0.80, y: 0.60, isSV: false, alpha: 0 },
    ];

    const classNegHard: Point2D[] = [
      { x: -0.10, y: -0.20, isSV: true, alpha: 1.5 }, // Support Vector 3
      { x: -0.45, y: -0.10, isSV: false, alpha: 0 },
      { x: -0.30, y: -0.50, isSV: false, alpha: 0 },
      { x: -0.65, y: -0.35, isSV: false, alpha: 0 },
      { x: -0.50, y: -0.70, isSV: false, alpha: 0 },
      { x: -0.20, y: -0.75, isSV: false, alpha: 0 },
    ];

    // Soft-margin points with margin penetration / slack variables (Alpaydın Fig 13.2)
    const slackPointsPos: Point2D[] = [
      ...classPosHard,
      { x: 0.05, y: 0.25, isSV: true, alpha: 1.0, slack: 0.45 }, // Penetrates margin
    ];
    const slackPointsNeg: Point2D[] = [
      ...classNegHard,
      { x: 0.15, y: -0.05, isSV: true, alpha: 1.0, slack: 0.75 }, // Penetrates across boundary
    ];

    // Kernel trick dataset (Concentric circles - Alpaydın Fig 13.12)
    const kernelPtsPos: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const theta = (i / 14) * Math.PI * 2;
      const r = 0.25 + 0.08 * Math.sin(i * 3);
      kernelPtsPos.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), r });
    }
    const kernelPtsNeg: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 22; i++) {
      const theta = (i / 22) * Math.PI * 2;
      const r = 0.72 + 0.10 * Math.cos(i * 2.5);
      kernelPtsNeg.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), r });
    }

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

      if (mode === 'kernel3d') {
        // -------------------------------------------------------------
        // Mode 3: Kernel Trick Projection into 3D (Alpaydın Fig 13.12)
        // -------------------------------------------------------------
        // Left 45%: 2D Non-separable space (Concentric rings)
        // Right 55%: 3D Feature Space with separating plane
        const isMobile = width < 640;
        const leftW = isMobile ? width : Math.floor(width * 0.44);
        const rightW = isMobile ? width : width - leftW;

        // --- 2D Input Space (Left) ---
        const spaceMargin = { left: 40, right: 20, top: 40, bottom: 40 };
        const plotW = leftW - spaceMargin.left - spaceMargin.right;
        const plotH = height - spaceMargin.top - spaceMargin.bottom;

        const to2DX = (x: number) => spaceMargin.left + ((x + 1) / 2) * plotW;
        const to2DY = (y: number) => spaceMargin.top + ((1 - y) / 2) * plotH;

        ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
        ctx.font = '600 12px sans-serif';
        ctx.fillText('Input Space ℝ² (Non-Separable)', spaceMargin.left, spaceMargin.top - 18);

        // 2D Axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(to2DX(0), spaceMargin.top);
        ctx.lineTo(to2DX(0), spaceMargin.top + plotH);
        ctx.moveTo(spaceMargin.left, to2DY(0));
        ctx.lineTo(spaceMargin.left + plotW, to2DY(0));
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '10px sans-serif';
        ctx.fillText('x₁', spaceMargin.left + plotW - 12, to2DY(0) + 14);
        ctx.fillText('x₂', to2DX(0) + 6, spaceMargin.top + 10);

        // Draw 2D Points
        kernelPtsPos.forEach((p) => {
          ctx.beginPath();
          ctx.arc(to2DX(p.x), to2DY(p.y), 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
        kernelPtsNeg.forEach((p) => {
          ctx.beginPath();
          ctx.rect(to2DX(p.x) - 3.5, to2DY(p.y) - 3.5, 7, 7);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Non-linear boundary ring indication
        const rBound = 0.50;
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(to2DX(0), to2DY(0), (rBound / 2) * plotW, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '9px monospace';
        ctx.fillText('Non-linear boundary', spaceMargin.left + 5, height - 15);

        // --- 3D Feature Space (Right) ---
        const rightLeft = leftW + 15;
        const rightAvailW = width - rightLeft - 20;

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftW + 5, 20);
        ctx.lineTo(leftW + 5, height - 20);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
        ctx.font = '600 12px sans-serif';
        ctx.fillText('Feature Space: Φ(x) = (x₁, x₂, x₁²+x₂²) (Fig 13.12)', rightLeft, 22);

        // 3D Isometric Projection setup with gentle rotation
        const camYaw = t * 0.4;
        const camPitch = 0.45; // ~26 degrees tilt
        const origin3DX = rightLeft + rightAvailW * 0.50;
        const origin3DY = height * 0.58;
        const scale3D = 130;

        const project3D = (x: number, y: number, z: number) => {
          // Rotate around Z axis (yaw)
          const rx = x * Math.cos(camYaw) - y * Math.sin(camYaw);
          const ry = x * Math.sin(camYaw) + y * Math.cos(camYaw);
          const rz = z;

          // Tilt down (pitch)
          const px = rx * scale3D;
          const py = (-ry * Math.sin(camPitch) - rz * Math.cos(camPitch)) * scale3D;
          return { sx: origin3DX + px, sy: origin3DY + py, depth: ry };
        };

        // Draw 3D Axes
        const o3D = project3D(0, 0, 0);
        const axX = project3D(1.1, 0, 0);
        const axY = project3D(0, 1.1, 0);
        const axZ = project3D(0, 0, 1.1);

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.2;
        // X axis
        ctx.beginPath();
        ctx.moveTo(o3D.sx, o3D.sy);
        ctx.lineTo(axX.sx, axX.sy);
        ctx.stroke();
        // Y axis
        ctx.beginPath();
        ctx.moveTo(o3D.sx, o3D.sy);
        ctx.lineTo(axY.sx, axY.sy);
        ctx.stroke();
        // Z axis (Phi elevation)
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(o3D.sx, o3D.sy);
        ctx.lineTo(axZ.sx, axZ.sy);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('z = ||x||²', axZ.sx - 15, axZ.sy - 8);

        // 3D Separating Hyperplane (Flat plane at z = 0.32)
        const planeZ = 0.32;
        const p1 = project3D(-0.9, -0.9, planeZ);
        const p2 = project3D(0.9, -0.9, planeZ);
        const p3 = project3D(0.9, 0.9, planeZ);
        const p4 = project3D(-0.9, 0.9, planeZ);

        ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy);
        ctx.lineTo(p4.sx, p4.sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('Separating Hyperplane in ℝ³', p2.sx - 80, p2.sy + 12);

        // Elevation cycle: points lift from z=0 up to z = x^2 + y^2
        const elevProgress = (Math.sin(t * 0.8) + 1) / 2;

        // Render elevated 3D points
        kernelPtsPos.forEach((p) => {
          const zTarget = p.x * p.x + p.y * p.y;
          const zCur = zTarget * elevProgress;
          const pt = project3D(p.x, p.y, zCur);

          // Vertical elevation stalk
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.lineWidth = 1;
          const basePt = project3D(p.x, p.y, 0);
          ctx.beginPath();
          ctx.moveTo(basePt.sx, basePt.sy);
          ctx.lineTo(pt.sx, pt.sy);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        kernelPtsNeg.forEach((p) => {
          const zTarget = p.x * p.x + p.y * p.y;
          const zCur = zTarget * elevProgress;
          const pt = project3D(p.x, p.y, zCur);

          const basePt = project3D(p.x, p.y, 0);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(basePt.sx, basePt.sy);
          ctx.lineTo(pt.sx, pt.sy);
          ctx.stroke();

          ctx.beginPath();
          ctx.rect(pt.sx - 3.5, pt.sy - 3.5, 7, 7);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      } else {
        // -------------------------------------------------------------
        // Modes 1 & 2: Maximum Margin & Soft Margin Slack (Figs 13.1, 13.2)
        // -------------------------------------------------------------
        const spaceMargin = { left: 55, right: 35, top: 40, bottom: 45 };
        const plotW = width - spaceMargin.left - spaceMargin.right;
        const plotH = height - spaceMargin.top - spaceMargin.bottom;

        const toScreenX = (x: number) => spaceMargin.left + ((x + 1) / 2) * plotW;
        const toScreenY = (y: number) => spaceMargin.top + ((1 - y) / 2) * plotH;

        // Title
        ctx.fillStyle = isDark ? '#cbd5e1' : '#0f172a';
        ctx.font = '600 12px sans-serif';
        ctx.fillText(
          mode === 'margin'
            ? 'Support Vector Machine: Maximum Margin Corridor 2/||w|| (Fig 13.1)'
            : 'Soft Margin Hyperplane & Slack Variables ξ (Fig 13.2)',
          spaceMargin.left,
          spaceMargin.top - 18
        );

        // Feature space axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(toScreenX(0), spaceMargin.top);
        ctx.lineTo(toScreenX(0), spaceMargin.top + plotH);
        ctx.moveTo(spaceMargin.left, toScreenY(0));
        ctx.lineTo(spaceMargin.left + plotW, toScreenY(0));
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '10px sans-serif';
        ctx.fillText('x₁', spaceMargin.left + plotW - 12, toScreenY(0) + 14);
        ctx.fillText('x₂', toScreenX(0) + 6, spaceMargin.top + 10);

        // Optimal separating hyperplane parameters:
        // Angle ~ 45 degrees (line slopes downward with normal in direction (1, 1))
        // Center line: x + y - 0.15 = 0 -> y = 0.15 - x
        // Positive margin: x + y - 0.55 = 0 -> y = 0.55 - x
        // Negative margin: x + y + 0.25 = 0 -> y = -0.25 - x
        // Margin width animation (breathing to show optimization finding max margin)
        const breathe = 0.05 * Math.sin(t * 1.5);
        const bPos = 0.55 + breathe;
        const bNeg = -0.25 - breathe;
        const bCenter = (bPos + bNeg) / 2;

        // Shaded Maximum Margin Corridor
        ctx.save();
        ctx.beginPath();
        ctx.rect(spaceMargin.left, spaceMargin.top, plotW, plotH);
        ctx.clip();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.beginPath();
        // Polygon of the corridor between negative and positive margins
        ctx.moveTo(toScreenX(-1), toScreenY(bPos - -1));
        ctx.lineTo(toScreenX(1), toScreenY(bPos - 1));
        ctx.lineTo(toScreenX(1), toScreenY(bNeg - 1));
        ctx.lineTo(toScreenX(-1), toScreenY(bNeg - -1));
        ctx.closePath();
        ctx.fill();

        // Positive Margin Line: w^T x + w0 = +1
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(toScreenX(-1), toScreenY(bPos - -1));
        ctx.lineTo(toScreenX(1), toScreenY(bPos - 1));
        ctx.stroke();

        // Negative Margin Line: w^T x + w0 = -1
        ctx.strokeStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(toScreenX(-1), toScreenY(bNeg - -1));
        ctx.lineTo(toScreenX(1), toScreenY(bNeg - 1));
        ctx.stroke();
        ctx.setLineDash([]);

        // Central Separating Hyperplane: w^T x + w0 = 0
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(toScreenX(-1), toScreenY(bCenter - -1));
        ctx.lineTo(toScreenX(1), toScreenY(bCenter - 1));
        ctx.stroke();

        // Margin width double-headed arrow: 2 / ||w||
        const arrowCenterX = 0.15;
        const arrowCenterY = bCenter - arrowCenterX;
        const normX = 1 / Math.sqrt(2);
        const normY = 1 / Math.sqrt(2);
        const halfCorridor = (bPos - bCenter) / Math.sqrt(2);

        const tipPos = { x: arrowCenterX + normX * halfCorridor, y: arrowCenterY + normY * halfCorridor };
        const tipNeg = { x: arrowCenterX - normX * halfCorridor, y: arrowCenterY - normY * halfCorridor };

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toScreenX(tipNeg.x), toScreenY(tipNeg.y));
        ctx.lineTo(toScreenX(tipPos.x), toScreenY(tipPos.y));
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('Margin = 2/||w||', toScreenX(tipPos.x) + 10, toScreenY(tipPos.y) - 6);

        // Normal vector w pointing orthogonal to hyperplane
        const wTipX = arrowCenterX + normX * 0.45;
        const wTipY = arrowCenterY + normY * 0.45;
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(toScreenX(arrowCenterX), toScreenY(arrowCenterY));
        ctx.lineTo(toScreenX(wTipX), toScreenY(wTipY));
        ctx.stroke();

        ctx.font = 'bold 11px monospace';
        ctx.fillText('w', toScreenX(wTipX) + 8, toScreenY(wTipY));

        ctx.restore();

        // Margin Line Labels
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText('wᵀx + w₀ = +1', spaceMargin.left + plotW - 95, toScreenY(bPos - 0.7) - 10);
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('wᵀx + w₀ = -1', spaceMargin.left + plotW - 95, toScreenY(bNeg - 0.7) + 16);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('wᵀx + w₀ = 0', spaceMargin.left + 15, toScreenY(bCenter - -0.8) - 10);

        // Draw Data Points & Support Vectors
        const curPosPts = mode === 'slack' ? slackPointsPos : classPosHard;
        const curNegPts = mode === 'slack' ? slackPointsNeg : classNegHard;

        // Positive Class
        curPosPts.forEach((p) => {
          const px = toScreenX(p.x);
          const py = toScreenY(p.y);

          // Support vector glowing ring & alpha badge
          if (p.isSV) {
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(`α>0`, px + 12, py - 4);
          }

          // Slack variable indicator (Alpaydın Fig 13.2)
          if (mode === 'slack' && typeof p.slack === 'number') {
            const slackVal = p.slack;
            // Distance arrow to target margin line
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 2]);
            ctx.beginPath();
            ctx.moveTo(px, py);
            const targetX = p.x + normX * slackVal;
            const targetY = p.y + normY * slackVal;
            ctx.lineTo(toScreenX(targetX), toScreenY(targetY));
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`ξ=${slackVal}`, px - 35, py - 6);
          }

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });

        // Negative Class
        curNegPts.forEach((p) => {
          const px = toScreenX(p.x);
          const py = toScreenY(p.y);

          if (p.isSV) {
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(`α>0`, px + 12, py + 12);
          }

          if (mode === 'slack' && typeof p.slack === 'number') {
            const slackVal = p.slack;
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 2]);
            ctx.beginPath();
            ctx.moveTo(px, py);
            const targetX = p.x - normX * slackVal;
            const targetY = p.y - normY * slackVal;
            ctx.lineTo(toScreenX(targetX), toScreenY(targetY));
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#f43f5e';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`ξ=${slackVal}`, px + 8, py - 10);
          }

          ctx.beginPath();
          ctx.rect(px - 4, py - 4, 8, 8);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });

        // Optimization HUD banner
        const hudX = spaceMargin.left + 10;
        const hudY = height - 34;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, 380, 24, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(
          mode === 'margin'
            ? 'SVM OBJECTIVE: min ½||w||² s.t. rᵗ(wᵀxᵗ+w₀) ≥ 1'
            : 'SOFT OBJECTIVE: min ½||w||² + C ∑ ξᵗ (Tradeoff)',
          hudX + 10,
          hudY + 16
        );
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
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Chapter 13: Kernel Machines & Support Vector Machines
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Maximum Margin Corridor 2/||w||, Support Vectors, Slack Penalty, and 3D Kernel Trick (Alpaydın Figs 13.1, 13.2, 13.12)
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setMode('margin')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'margin'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Max Margin (Fig 13.1)
          </button>
          <button
            onClick={() => setMode('slack')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'slack'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Slack Variables ξ (Fig 13.2)
          </button>
          <button
            onClick={() => setMode('kernel3d')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              mode === 'kernel3d'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            Kernel Trick (Fig 13.12)
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
          <strong>Figure 13.1, 13.2 & 13.12 Emulation:</strong> Support vectors lie directly on margins{' '}
          <em>wᵀx + w₀ = ±1</em> defining the maximum corridor <em>2/||w||</em>. Slack variables <em>ξ</em> quantify soft-margin
          violations. The kernel trick lifts non-separable concentric rings into 3D where a linear plane achieves perfect separation.
        </p>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-500 font-semibold shrink-0">
          <Sparkles className="h-3 w-3" />
          60 FPS Seamless Loop
        </span>
      </div>
    </div>
  );
}
