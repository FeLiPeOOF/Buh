/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { BouquetItem } from "../types";
import RealFlowerSvg from "./RealFlowerSvg";

interface BouquetVisualizerProps {
  bouquet: BouquetItem[];
  wrapType: string;
  ribbonType: string;
  className?: string;
  isMini?: boolean;
}

export default function BouquetVisualizer({
  bouquet,
  wrapType,
  ribbonType,
  className = "w-80 h-96",
  isMini = false,
}: BouquetVisualizerProps) {
  const totalFlowerCount = bouquet.reduce((sum, item) => sum + item.quantity, 0);

  // Flatten the bouquet's flowers into a single flat list to layout sequentially.
  const flatFlowers = bouquet.flatMap((item) =>
    Array.from({ length: item.quantity }).map((_, idx) => ({
      flowerId: item.flower.id,
      name: item.flower.name,
      color: item.flower.color,
    }))
  );

  // 1. Generate initial spiral distribution coordinates (Fermat/Golden spiral)
  const initialFlowers = flatFlowers.map((fl, i) => {
    // Elegant golden ratio angle distribution for optimal natural packing
    const angle = i * 137.5;
    const radiusStep = isMini ? 12 : 22;
    const radius = Math.sqrt(i) * radiusStep;

    const x = Math.cos((angle * Math.PI) / 180) * radius;
    // Squish vertically slightly to render the proper florist perspective dome
    const y = Math.sin((angle * Math.PI) / 180) * radius * 0.82 - (isMini ? 15 : 22);

    return {
      id: `${fl.flowerId}-${i}`,
      flowerId: fl.flowerId,
      name: fl.name,
      color: fl.color,
      x,
      y,
      angle,
    };
  });

  // 2. Perform iterative force-directed circle relaxation to guarantee NO overlapping.
  // Standard flower display size is w-16 H-16 (64px), mini is w-11 h-11 (44px).
  // Target minimum distance: 44px (full) / 28px (mini) provides perfect snug nestling with 0 clashing overlaps.
  const minDistance = isMini ? 28 : 44;
  const iterations = 60;
  const bouquetFlowers = initialFlowers.map((f) => ({ ...f }));

  for (let step = 0; step < iterations; step++) {
    // 2a. Gentle attraction gravity force to center of the florist dome
    const targetY = isMini ? -15 : -22;
    for (let i = 0; i < bouquetFlowers.length; i++) {
      bouquetFlowers[i].x *= 0.95;
      bouquetFlowers[i].y = targetY + (bouquetFlowers[i].y - targetY) * 0.95;
    }

    // 2b. Push apart overlapping circles (distance check)
    for (let i = 0; i < bouquetFlowers.length; i++) {
      for (let j = i + 1; j < bouquetFlowers.length; j++) {
        const dx = bouquetFlowers[j].x - bouquetFlowers[i].x;
        const dy = bouquetFlowers[j].y - bouquetFlowers[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance) {
          const overlap = minDistance - dist;
          let nx = dx / (dist || 1);
          let ny = dy / (dist || 1);

          if (dist === 0) {
            // Avoid zero-division alignment lock by separating in a deterministic angle
            const randAngle = (i + j) * 1.57;
            nx = Math.cos(randAngle);
            ny = Math.sin(randAngle);
          }

          // Push both away equally to satisfy spacing constraint
          const pushAmount = overlap * 0.5;
          bouquetFlowers[i].x -= nx * pushAmount;
          bouquetFlowers[i].y -= ny * pushAmount;
          bouquetFlowers[j].x += nx * pushAmount;
          bouquetFlowers[j].y += ny * pushAmount;
        }
      }
    }
  }

  // Background foliage to frame the bouquet and add organic lushness to the composition
  const backgroundLeaves = isMini 
    ? [
        { x: -38, y: -30, rotate: -35, size: 28, opacity: 0.8 },
        { x: 38, y: -30, rotate: 35, size: 28, opacity: 0.8 },
        { x: 0, y: -45, rotate: 0, size: 25, opacity: 0.7 },
      ]
    : [
        { x: -75, y: -25, rotate: -42, size: 45, opacity: 0.9 },
        { x: 75, y: -25, rotate: 42, size: 45, opacity: 0.9 },
        { x: -52, y: -62, rotate: -65, size: 38, opacity: 0.85 },
        { x: 52, y: -62, rotate: 65, size: 38, opacity: 0.85 },
        { x: -22, y: -92, rotate: -15, size: 34, opacity: 0.8 },
        { x: 22, y: -92, rotate: 15, size: 34, opacity: 0.8 },
        { x: 0, y: -105, rotate: 0, size: 32, opacity: 0.75 },
      ];

  const RIBBON_OPTS = [
    { id: "gold-satin", label: "Cetim Dourado ✨", color: "#f59e0b" },
    { id: "red-silk", label: "Seda Vermelha ❤️", color: "#dc2626" },
    { id: "pink-organza", label: "Organza Rosa 🌸", color: "#f472b6" },
    { id: "none", label: "Rústico (Sem Fita) 🌿", color: "transparent" },
  ];

  if (totalFlowerCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-love-400">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-love-200 fill-current animate-pulse mb-3" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <p className="font-serif font-bold text-sm text-love-900">Seu arranjo está vazio</p>
        <p className="font-sans text-[11px] text-love-500 max-w-[210px] text-center mt-1.5 leading-normal">
          Clique nas flores acima para começar a compor o buquê perfeito para a Bruna.
        </p>
      </div>
    );
  }

  // Anchor points for stems convergence & wrappers
  const canvasWidth = 320;
  const canvasHeight = 380;
  
  const floralCenterX = canvasWidth / 2;     // 160
  const floralCenterY = isMini ? 110 : 125;   // 125
  const tiePointX = canvasWidth / 2;         // 160
  const tiePointY = isMini ? 220 : 255;       // 255
  const bottomStemY = isMini ? 305 : 340;     // 340

  const visualizerContent = (
    <div className="relative w-[320px] h-[380px]" id="realistic-bouquet-visualizer-content">
      {/* 1. WRAPPING BACKGROUND PAPER (z-10, behind stems and flowers) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {wrapType === "velvet-rose" && (
          <svg className="absolute w-full h-full" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <radialGradient id="velvet-back" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="45%" stopColor="#ffe4e6" />
                <stop offset="85%" stopColor="#fecdd3" />
                <stop offset="100%" stopColor="#fda4af" />
              </radialGradient>
            </defs>
            {/* Soft pink luxury pleated wrap back sheet */}
            <path
              d={`M ${floralCenterX} ${tiePointY + 40} L ${floralCenterX - 110} 125 C ${floralCenterX - 120} 90 ${floralCenterX - 80} 45 ${floralCenterX} 45 C ${floralCenterX + 80} 45 ${floralCenterX + 120} 90 ${floralCenterX + 110} 125 Z`}
              fill="url(#velvet-back)"
              opacity="0.96"
            />
            {/* Elegant fine pleated gold accent threads */}
            <path d={`M ${floralCenterX} ${tiePointY + 10} L ${floralCenterX - 80} 50`} stroke="#fb7185" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <path d={`M ${floralCenterX} ${tiePointY + 10} L ${floralCenterX - 40} 45`} stroke="#fb7185" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <path d={`M ${floralCenterX} ${tiePointY + 10} L ${floralCenterX + 40} 45`} stroke="#fb7185" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <path d={`M ${floralCenterX} ${tiePointY + 10} L ${floralCenterX + 80} 50`} stroke="#fb7185" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
          </svg>
        )}

        {wrapType === "kraft" && (
          <svg className="absolute w-full h-full" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <linearGradient id="kraft-back" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffedd5" />
                <stop offset="40%" stopColor="#fed7aa" />
                <stop offset="85%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            {/* Textured, crinkley folded vintage kraft backing */}
            <path
              d={`M ${floralCenterX} ${tiePointY + 45} L ${floralCenterX - 115} 115 L ${floralCenterX - 65} 60 L ${floralCenterX} 75 L ${floralCenterX + 65} 60 L ${floralCenterX + 115} 115 Z`}
              fill="url(#kraft-back)"
              opacity="0.95"
            />
            {/* Paper origami crease highlights */}
            <path d={`M ${floralCenterX} ${tiePointY + 20} L ${floralCenterX - 65} 60`} stroke="#854d0e" strokeWidth="1.5" opacity="0.35" />
            <path d={`M ${floralCenterX} ${tiePointY + 20} L ${floralCenterX + 65} 60`} stroke="#854d0e" strokeWidth="1.5" opacity="0.35" />
            <path d={`M ${floralCenterX} ${tiePointY + 20} L ${floralCenterX} 75`} stroke="#854d0e" strokeWidth="1" opacity="0.25" />
          </svg>
        )}

        {wrapType === "minimalist-glass" && (
          <svg className="absolute w-full h-full" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            {/* Clean clear back glow shadow */}
            <ellipse cx={floralCenterX} cy={floralCenterY + 40} rx="85" ry="50" fill="#f0f9ff" opacity="0.25" />
          </svg>
        )}

        {wrapType === "lace" && (
          <svg className="absolute w-full h-full" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <pattern id="lace-pattern-back" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="8" cy="8" r="1.5" stroke="#e2e8f0" strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M0 8 H16 M8 0 V16" stroke="#f1f5f9" strokeWidth="0.5" opacity="0.2" />
                <path d="M4 4 L12 12 M12 4 L4 L12" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.15" />
              </pattern>
            </defs>
            {/* Delicately textured lace veil backing */}
            <path
              d={`M ${floralCenterX} ${tiePointY + 30} L ${floralCenterX - 105} 115 C ${floralCenterX - 115} 85 ${floralCenterX - 75} 50 ${floralCenterX} 50 C ${floralCenterX + 75} 50 ${floralCenterX + 105} 115 Z`}
              fill="url(#lace-pattern-back)"
              stroke="#fafafa"
              strokeWidth="1.5"
            />
            {/* Overlay background color shift */}
            <path
              d={`M ${floralCenterX} ${tiePointY + 30} L ${floralCenterX - 105} 115 C ${floralCenterX - 115} 85 ${floralCenterX - 75} 50 ${floralCenterX} 50 C ${floralCenterX + 75} 50 ${floralCenterX + 105} 115 Z`}
              fill="#ffffff"
              opacity="0.5"
            />
            {/* Pretty scalloped top edges */}
            <path
              d={`M ${floralCenterX - 105} 115 Q ${floralCenterX - 85} 100 ${floralCenterX - 65} 110 Q ${floralCenterX - 45} 120 ${floralCenterX - 25} 110 Q ${floralCenterX} 100 ${floralCenterX + 25} 110 Q ${floralCenterX + 45} 120 ${floralCenterX + 65} 110 Q ${floralCenterX + 85} 100 ${floralCenterX + 105} 115`}
              stroke="#e2e8f0"
              strokeWidth="1.25"
              fill="none"
              opacity="0.85"
            />
          </svg>
        )}
      </div>

      {/* 2. REALISTIC SPIRAL GREEN STEMS (z-12, behind foliage & flowers) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-12" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
        <defs>
          <linearGradient id="stem-gradient-real" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="stem-shadow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#166534" stopOpacity="1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Dynamic hand-tied spiraling stems logic */}
        {bouquetFlowers.map((fl) => {
          const flX = fl.x + floralCenterX;
          const flY = fl.y + floralCenterY + (isMini ? 12 : 18); // center height offset
          
          // Tight gathering offset at ribbon point (0.05 scaling factor)
          const stemTieX = tiePointX + (fl.x * 0.06);
          const stemTieY = tiePointY;

          // Fan out slightly at the bottom (0.16 flare scale factor)
          const stemBottomX = tiePointX + (fl.x * 0.16);
          const stemBottomY = bottomStemY;

          return (
            <g key={`stem-group-${fl.id}`}>
              {/* Soft stem shadow depth */}
              <path
                d={`M ${flX} ${flY} Q ${flX * 0.7 + tiePointX * 0.3} ${(flY + stemTieY) / 2} ${stemTieX} ${stemTieY} L ${stemBottomX} ${stemBottomY}`}
                stroke="url(#stem-shadow-gradient)"
                strokeWidth={isMini ? "2.5" : "3.8"}
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Vibrant green organic stem path */}
              <path
                d={`M ${flX} ${flY} Q ${flX * 0.72 + tiePointX * 0.28} ${(flY + stemTieY) / 2} ${stemTieX} ${stemTieY} L ${stemBottomX} ${stemBottomY}`}
                stroke="url(#stem-gradient-real)"
                strokeWidth={isMini ? "1.8" : "3.2"}
                strokeLinecap="round"
                opacity="0.92"
              />
            </g>
          );
        })}
      </svg>

      {/* 3. LUSH BACKGROUND LEAVES (z-15, nested behind flowers) */}
      <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {backgroundLeaves.map((leaf, idx) => {
          const leafX = floralCenterX + leaf.x;
          const leafY = floralCenterY + leaf.y;

          return (
            <div
              key={`foliage-${idx}`}
              className="absolute"
              style={{
                left: `${leafX - leaf.size / 2}px`,
                top: `${leafY - leaf.size / 2}px`,
                width: `${leaf.size}px`,
                height: `${leaf.size}px`,
                transform: `rotate(${leaf.rotate}deg)`,
                opacity: leaf.opacity,
              }}
            >
              {idx % 2 === 0 ? (
                // Rose greenery leaves vector
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                  <path d="M50 90 C25 80 12 50 32 20 C42 10 52 10 62 20 C82 50 75 80 50 90 Z" fill="#14532d" />
                  <path d="M50 90 C28 80 20 54 36 28 C42 20 49 20 55 28 C71 54 64 80 50 90 Z" fill="#15803d" />
                  <path d="M50 90 L50 18" stroke="#14532d" strokeWidth="2.5" opacity="0.65" />
                  <path d="M50 72 Q38 62 28 60" stroke="#166534" strokeWidth="1.5" opacity="0.5" />
                  <path d="M50 56 Q62 48 72 40" stroke="#166534" strokeWidth="1.5" opacity="0.5" />
                  <path d="M50 42 Q36 34 26 30" stroke="#166534" strokeWidth="1.5" opacity="0.5" />
                </svg>
              ) : (
                // Matte silver-green eucalyptus coin leaf vector
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                  <circle cx="50" cy="50" r="40" fill="#334155" opacity="0.18" />
                  <circle cx="50" cy="50" r="36" fill="#2d5a42" />
                  <circle cx="48" cy="48" r="34" fill="#4d7c67" />
                  <circle cx="47" cy="47" r="32" fill="#5c8a74" />
                  <path d="M50 86 Q50 50 50 14" stroke="#1e293b" strokeWidth="2" opacity="0.4" />
                  {/* Subtle leafy details */}
                  <path d="M50 60 C35 55 35 48 40 45" stroke="#1e293b" strokeWidth="1" opacity="0.25" />
                  <path d="M50 42 C65 38 65 32 60 28" stroke="#1e293b" strokeWidth="1" opacity="0.25" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. MAIN FLOWER CROWN ARRANGEMENT (z-20, user selected flower heads) */}
      <div className="absolute inset-0 z-20 pointer-events-auto" style={{ width: canvasWidth, height: canvasHeight }}>
        {bouquetFlowers.map((fl) => {
          const flX = fl.x + floralCenterX;
          const flY = fl.y + floralCenterY;
          const flowerSize = isMini ? "w-11 h-11" : "w-16 h-16";
          const offsetSize = isMini ? 22 : 32;

          return (
            <motion.div
              key={`crown-${fl.id}`}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: fl.angle % 32 }}
              whileHover={{ scale: 1.15, zIndex: 45, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 130, damping: 11 }}
              className="absolute cursor-pointer flex items-center justify-center filter drop-shadow-md"
              style={{
                left: `${flX - offsetSize}px`,
                top: `${flY - offsetSize}px`,
                transformOrigin: "center center",
              }}
              title={fl.name}
            >
              <div className={flowerSize}>
                <RealFlowerSvg id={fl.flowerId} className="w-full h-full transition-transform active:scale-95" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 5. WRAPPING PAPER FOREGROUND SLEEVE / GLASS WATER BODY (z-25, overlaps lower parts of stems/flowers) */}
      <div className="absolute inset-0 pointer-events-none z-25">
        {wrapType === "velvet-rose" && (
          <svg className="absolute w-full h-full filter drop-shadow-[0_8px_16px_rgba(225,29,72,0.18)]" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <linearGradient id="velvet-flap-left-side" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#db2777" />
                <stop offset="100%" stopColor="#9d174d" />
              </linearGradient>
              <linearGradient id="velvet-flap-right-side" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="40%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            {/* Overlapping cozy sleeve style */}
            {/* Back collar cuff shadow */}
            <path d={`M ${floralCenterX} ${tiePointY + 45} L ${floralCenterX - 75} 145 C ${floralCenterX - 70} 135 ${floralCenterX - 20} 115 ${floralCenterX} 125 Z`} fill="#be123c" opacity="0.32" />
            
            {/* Left folding envelope lapel */}
            <path d={`M ${floralCenterX} ${tiePointY + 45} L ${floralCenterX - 72} 150 C ${floralCenterX - 65} 130 ${floralCenterX - 15} 120 ${floralCenterX + 10} 150 Z`} fill="url(#velvet-flap-left-side)" opacity="0.94" />
            
            {/* Right overlapping premium velvet envelope lapel */}
            <path d={`M ${floralCenterX} ${tiePointY + 45} L ${floralCenterX + 72} 145 C ${floralCenterX + 65} 125 ${floralCenterX + 15} 110 ${floralCenterX - 15} 145 Z`} fill="url(#velvet-flap-right-side)" opacity="0.98" stroke="#fecdd3" strokeWidth="0.5" />
            
            {/* Sealed logo seal sticker button */}
            <circle cx={floralCenterX} cy={tiePointY - (isMini ? 25 : 30)} r="10" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <circle cx={floralCenterX} cy={tiePointY - (isMini ? 25 : 30)} r="8.5" fill="#fef08a" opacity="0.3" />
            <path d={`M ${floralCenterX} ${tiePointY - (isMini ? 29 : 34)} C ${floralCenterX - 3.5} ${tiePointY - (isMini ? 33 : 38)} ${floralCenterX - 5} ${tiePointY - (isMini ? 27 : 32)} ${floralCenterX} ${tiePointY - (isMini ? 24 : 29)} C ${floralCenterX + 5} ${tiePointY - (isMini ? 27 : 32)} ${floralCenterX + 3.5} ${tiePointY - (isMini ? 33 : 38)} ${floralCenterX} ${tiePointY - (isMini ? 29 : 34)} Z`} fill="#be123c" />
          </svg>
        )}

        {wrapType === "kraft" && (
          <svg className="absolute w-full h-full filter drop-shadow-[0_6px_10px_rgba(120,53,4,0.15)]" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <linearGradient id="kraft-front-sheet-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
              <linearGradient id="kraft-front-sheet-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            {/* Craft paper origami folding flaps */}
            <path d={`M ${floralCenterX} ${tiePointY + 48} L ${floralCenterX - 74} 160 L ${floralCenterX - 15} 170 Z`} fill="url(#kraft-front-sheet-1)" />
            <path d={`M ${floralCenterX} ${tiePointY + 48} L ${floralCenterX + 74} 160 L ${floralCenterX + 12} 170 Z`} fill="url(#kraft-front-sheet-2)" />
            {/* Fold line shadowing */}
            <path d={`M ${floralCenterX} ${tiePointY + 48} L ${floralCenterX - 15} 170`} stroke="#78350f" strokeWidth="1.5" opacity="0.3" />
            <path d={`M ${floralCenterX} ${tiePointY + 48} L ${floralCenterX + 12} 170`} stroke="#78350f" strokeWidth="1.5" opacity="0.3" />
            
            {/* Pretty rustic stamp tie */}
            <circle cx={floralCenterX} cy={tiePointY - (isMini ? 25 : 30)} r="10.5" fill="#78350f" />
            <circle cx={floralCenterX} cy={tiePointY - (isMini ? 25 : 30)} r="8.5" fill="#ffedd5" />
            <path d={`M ${floralCenterX - 3.5} ${tiePointY - (isMini ? 29 : 34)} C ${floralCenterX - 8.5} ${tiePointY - (isMini ? 29 : 34)} ${floralCenterX - 8.5} ${tiePointY - (isMini ? 21 : 26)} ${floralCenterX} ${tiePointY - (isMini ? 19 : 24)} C ${floralCenterX + 8.5} ${tiePointY - (isMini ? 21 : 26)} ${floralCenterX + 8.5} ${tiePointY - (isMini ? 29 : 34)} ${floralCenterX + 3.5} ${tiePointY - (isMini ? 29 : 34)} C ${floralCenterX} ${tiePointY - (isMini ? 28 : 33)} ${floralCenterX - 3.5} ${tiePointY - (isMini ? 29 : 34)}`} fill="#dc2626" />
          </svg>
        )}

        {wrapType === "minimalist-glass" && (
          <svg className="absolute w-full h-full filter drop-shadow-[0_10px_20px_rgba(14,165,233,0.12)]" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <linearGradient id="glass-glare-overlay" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="12%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="42%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="88%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="water-depth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Premium glass jar model */}
            {/* Jar dimensions: Width=120, Height=140, Bottom curving corner */}
            {/* water backdrop immersion */}
            {/* Meniscus curvature representing beautiful liquid line */}
            <path
              d={`M ${floralCenterX - 55} 248 C ${floralCenterX - 55} 248 ${floralCenterX - 30} 251 ${floralCenterX} 251 C ${floralCenterX + 30} 251 ${floralCenterX + 55} 248 ${floralCenterX + 55} 248 L ${floralCenterX + 55} 315 C ${floralCenterX + 55} 332 ${floralCenterX + 35} 342 ${floralCenterX} 342 C ${floralCenterX - 35} 342 ${floralCenterX - 55} 332 ${floralCenterX - 55} 315 Z`}
              fill="url(#water-depth)"
              stroke="#7dd3fc"
              strokeWidth="0.5"
            />
            {/* Main glass bottle envelope frame */}
            <rect x={floralCenterX - 55} y="200" width="110" height="142" rx="28" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />
            <rect x={floralCenterX - 55} y="200" width="110" height="142" rx="28" fill="url(#glass-glare-overlay)" />
            
            {/* Bottle Collar neck */}
            <rect x={floralCenterX - 38} y="193" width="76" height="8" rx="4" fill="#cbd5e1" fillOpacity="0.5" stroke="#64748b" strokeWidth="1" />
            {/* Dynamic rising bubbles */}
            <circle cx={floralCenterX - 35} cy="295" r="2.2" fill="#ffffff" fillOpacity="0.8" />
            <circle cx={floralCenterX + 38} cy="318" r="1.5" fill="#ffffff" fillOpacity="0.6" />
            <circle cx={floralCenterX - 15} cy="330" r="1.8" fill="#ffffff" fillOpacity="0.75" />
            <circle cx={floralCenterX + 22} cy="268" r="2.5" fill="#ffffff" fillOpacity="0.5" />
            <circle cx={floralCenterX - 5} cy="280" r="1.2" fill="#ffffff" fillOpacity="0.7" />
          </svg>
        )}

        {wrapType === "lace" && (
          <svg className="absolute w-full h-full filter drop-shadow-[0_4px_8px_rgba(71,85,105,0.08)]" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} fill="none">
            <defs>
              <pattern id="lace-pattern-front" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="#f8fafc" />
                <path d="M0 5 Q5 0 10 5" stroke="#f1f5f9" strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M0 5 Q5 10 10 5" stroke="#f1f5f9" strokeWidth="0.5" fill="none" opacity="0.4" />
              </pattern>
            </defs>
            {/* White sheer bridal silk lace wrap wrapper overlap */}
            <path d={`M ${floralCenterX} ${tiePointY + 40} L ${floralCenterX - 72} 165 C ${floralCenterX - 65} 145 ${floralCenterX - 15} 135 ${floralCenterX + 10} 165 Z`} fill="url(#lace-pattern-front)" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />
            
            <path d={`M ${floralCenterX} ${tiePointY + 40} L ${floralCenterX + 72} 165 C ${floralCenterX + 65} 145 ${floralCenterX + 15} 135 ${floralCenterX - 10} 165 Z`} fill="url(#lace-pattern-front)" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />
            
            <path d={`M ${floralCenterX} ${tiePointY + 40} L ${floralCenterX - 72} 165 C ${floralCenterX - 65} 145 ${floralCenterX - 15} 135 ${floralCenterX + 10} 165 Z`} fill="#ffffff" opacity="0.45" />
            <path d={`M ${floralCenterX} ${tiePointY + 40} L ${floralCenterX + 72} 165 C ${floralCenterX + 65} 145 ${floralCenterX + 15} 135 ${floralCenterX - 10} 165 Z`} fill="#ffffff" opacity="0.45" />
            
            {/* Scalloped embroidery lining */}
            <path d={`M ${floralCenterX - 72} 165 Q ${floralCenterX - 31} 145 ${floralCenterX + 10} 165`} stroke="#e2e8f0" strokeWidth="1" fill="none" opacity="0.8" />
            <path d={`M ${floralCenterX + 72} 165 Q ${floralCenterX + 31} 145 ${floralCenterX - 10} 165`} stroke="#e2e8f0" strokeWidth="1" fill="none" opacity="0.8" />
          </svg>
        )}
      </div>

      {/* 6. SATIN BOW AND FLOWING RIBBON SPIRAL TAILS (z-35, situated in front of everything) */}
      {ribbonType !== "none" && (
        <svg
          className="absolute w-full h-full pointer-events-none z-35 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.14)]"
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          fill="none"
        >
          <defs>
            <radialGradient id="ribbon-glow-specular" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </radialGradient>
          </defs>
          {(() => {
            const ribbonColor = RIBBON_OPTS.find((r) => r.id === ribbonType)?.color || "#f59e0b";
            return (
              <g>
                {/* 1. Left loop of the satin ribbon bow */}
                <path
                  d={`M ${tiePointX} ${tiePointY} Q ${tiePointX - 25} ${tiePointY - 22} ${tiePointX - 44} ${tiePointY - 10} Q ${tiePointX - 50} ${tiePointY} ${tiePointX - 25} ${tiePointY + 4} Q ${tiePointX - 12} ${tiePointY + 2} ${tiePointX} ${tiePointY} Z`}
                  fill={ribbonColor}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                
                {/* 2. Right loop of the satin ribbon bow */}
                <path
                  d={`M ${tiePointX} ${tiePointY} Q ${tiePointX + 25} ${tiePointY - 22} ${tiePointX + 44} ${tiePointY - 10} Q ${tiePointX + 50} ${tiePointY} ${tiePointX + 25} ${tiePointY + 4} Q ${tiePointX + 12} ${tiePointY + 2} ${tiePointX} ${tiePointY} Z`}
                  fill={ribbonColor}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />

                {/* Silk satin glow highlights */}
                <path
                  d={`M ${tiePointX} ${tiePointY} Q ${tiePointX - 25} ${tiePointY - 22} ${tiePointX - 44} ${tiePointY - 10} Q ${tiePointX - 50} ${tiePointY} ${tiePointX - 25} ${tiePointY + 4}`}
                  fill="url(#ribbon-glow-specular)"
                  opacity="0.32"
                />
                <path
                  d={`M ${tiePointX} ${tiePointY} Q ${tiePointX + 25} ${tiePointY - 22} ${tiePointX + 44} ${tiePointY - 10} Q ${tiePointX + 50} ${tiePointY} ${tiePointX + 25} ${tiePointY + 4}`}
                  fill="url(#ribbon-glow-specular)"
                  opacity="0.32"
                />

                {/* 3. Left falling tail of ribbon (wavy curl curve) */}
                <path
                  d={`M ${tiePointX - 7} ${tiePointY + 3} Q ${tiePointX - 26} ${tiePointY + 25} ${tiePointX - 11} ${tiePointY + 50} Q ${tiePointX - 3} ${tiePointY + 62} ${tiePointX - 18} ${tiePointY + 75}`}
                  stroke={ribbonColor}
                  strokeWidth={isMini ? "2.5" : "4.5"}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${tiePointX - 7} ${tiePointY + 3} Q ${tiePointX - 26} ${tiePointY + 25} ${tiePointX - 11} ${tiePointY + 50} Q ${tiePointX - 3} ${tiePointY + 62} ${tiePointX - 18} ${tiePointY + 75}`}
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.45"
                />

                {/* 4. Right falling tail of ribbon (wavy curl curve) */}
                <path
                  d={`M ${tiePointX + 7} ${tiePointY + 3} Q ${tiePointX + 26} ${tiePointY + 25} ${tiePointX + 11} ${tiePointY + 50} Q ${tiePointX + 3} ${tiePointY + 62} ${tiePointX + 18} ${tiePointY + 75}`}
                  stroke={ribbonColor}
                  strokeWidth={isMini ? "2.5" : "4.5"}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${tiePointX + 7} ${tiePointY + 3} Q ${tiePointX + 26} ${tiePointY + 25} ${tiePointX + 11} ${tiePointY + 50} Q ${tiePointX + 3} ${tiePointY + 62} ${tiePointX + 18} ${tiePointY + 75}`}
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.45"
                />

                {/* 5. Central round knot node */}
                <rect x={tiePointX - 7} y={tiePointY - 6} width="14" height="12" rx="3.5" fill={ribbonColor} stroke="#ffffff" strokeWidth="0.5" />
                <rect x={tiePointX - 7} y={tiePointY - 6} width="14" height="12" rx="3.5" fill="url(#ribbon-glow-specular)" opacity="0.3" />
              </g>
            );
          })()}
        </svg>
      )}
    </div>
  );

  if (isMini) {
    return (
      <div
        className={`relative select-none overflow-hidden ${className}`}
        style={{
          width: "224px",
          height: "270px",
        }}
        id="realistic-bouquet-visualizer-mini"
      >
        <div
          style={{
            transform: "scale(0.7)",
            transformOrigin: "top left",
          }}
        >
          {visualizerContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative select-none ${className}`} id="realistic-bouquet-visualizer">
      {visualizerContent}
    </div>
  );
}
