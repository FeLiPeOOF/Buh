/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface RealFlowerSvgProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RealFlowerSvg({ id, className = "w-full h-full", style }: RealFlowerSvgProps) {
  switch (id) {
    case "red-rose":
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
        >
          <defs>
            <radialGradient id="rose-grad" cx="50%" cy="50%" r="50%" fx="45%" fy="45%">
              <stop offset="0%" stopColor="#fecdd3" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="70%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </radialGradient>
            <radialGradient id="leaf-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
          </defs>
          {/* Stem & Sepals */}
          <rect x="47" y="70" width="6" height="25" rx="3" fill="#166534" />
          <path d="M50 72 C40 68 32 64 30 70 C34 78 44 80 50 72 Z" fill="#14532d" />
          <path d="M50 72 C60 68 68 64 70 70 C66 78 56 80 50 72 Z" fill="#14532d" />
          
          {/* Side Leaves */}
          <path d="M47 82 C28 85 18 70 24 58 C35 62 44 72 47 82 Z" fill="url(#leaf-grad)" />
          <path d="M53 82 C72 85 82 70 76 58 C65 62 56 72 53 82 Z" fill="url(#leaf-grad)" />
          <path d="M24 58 Q34 66 47 82" stroke="#14532d" strokeWidth="1" strokeLinecap="round" />
          <path d="M76 58 Q66 66 53 82" stroke="#14532d" strokeWidth="1" strokeLinecap="round" />

          {/* Rose Petals Base */}
          <path d="M50 15 C18 15 12 44 24 64 C35 80 65 80 76 64 C88 44 82 15 50 15 Z" fill="url(#rose-grad)" />
          
          {/* Overlapping Petal Layers (Mid-layers) */}
          <path d="M50 25 C32 25 26 48 35 65 C41 72 59 72 65 65 C74 48 68 25 50 25 Z" fill="#e11d48" opacity="0.95" />
          <path d="M50 25 C62 26 73 38 68 56 C64 64 54 66 48 66 Z" fill="#be123c" opacity="0.9" />
          <path d="M50 25 C38 26 27 38 32 56 C36 64 46 66 52 66 Z" fill="#be123c" opacity="0.9" />
          
          {/* Front overlap heart petals */}
          <path d="M50 32 C40 32 35 48 42 58 C46 62 54 62 58 58 C65 48 60 32 50 32 Z" fill="#f43f5e" />
          
          {/* Petal Inner Core Spiral */}
          <path d="M50 38 C45 38 43 45 46 50 C48 52 52 52 54 50 C57 45 55 38 50 38 Z" fill="#fda4af" />
          <path d="M50 42 C47 42 46 45 48 48 C49 49 51 49 52 48 C54 45 53 42 50 42 Z" fill="#9f1239" />
          
          {/* Soft highlights */}
          <path d="M30 42 C27 32 44 26 50 32" stroke="#ffe4e6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M70 42 C73 32 56 26 50 32" stroke="#ffe4e6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      );

    case "yellow-tulip":
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
        >
          <defs>
            <linearGradient id="tulip-grad-fill" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="90%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          {/* Stem */}
          <path d="M50 62 Q48 80 46 96" stroke="url(#stem-grad)" strokeWidth="6" strokeLinecap="round" />
          
          {/* Clasping Leaves */}
          <path d="M47 90 Q22 75 25 45 Q36 68 47 76 Z" fill="#16a34a" />
          <path d="M50 85 Q78 72 72 40 Q62 64 48 72 Z" fill="#15803d" />

          {/* Rear tulip petal */}
          <path d="M50 16 C35 16 30 38 34 58 C40 64 60 64 66 58 C70 38 65 16 50 16 Z" fill="#ca8a04" />
          
          {/* Left Main Tulip Petal */}
          <path d="M48 18 C30 20 25 44 32 62 C38 65 52 62 55 55 C44 42 40 28 48 18 Z" fill="url(#tulip-grad-fill)" />
          
          {/* Right Main Tulip Petal */}
          <path d="M52 18 C70 20 75 44 68 62 C62 65 48 62 45 55 C56 42 60 28 52 18 Z" fill="url(#tulip-grad-fill)" />
          
          {/* Front Center Petal */}
          <path d="M50 22 C38 22 34 42 38 64 C40 66 60 66 62 64 C66 42 62 22 50 22 Z" fill="#facc15" />
          {/* Tulip veins & reflex shine */}
          <path d="M50 28 C45 35 41 46 44 58" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
          <path d="M50 28 C55 35 59 46 56 58" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </svg>
      );

    case "sunflower":
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
        >
          <defs>
            <radialGradient id="sun-center-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2d1500" />
              <stop offset="60%" stopColor="#451a03" />
              <stop offset="85%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>
          {/* Sturdy green stem */}
          <path d="M50 50 Q48 76 45 96" stroke="#166534" strokeWidth="6.5" strokeLinecap="round" />
          {/* Large textured sunflower leaves */}
          <path d="M48 72 Q18 68 15 50 Q32 54 46 66 Z" fill="#16a34a" />
          <path d="M51 78 Q82 72 85 56 Q66 58 52 70 Z" fill="#15803d" />

          {/* Staggered row 1 (Darker warm golden background petals) */}
          <g fill="#d97706" opacity="0.98">
            <path d="M50 8 L54 32 L46 32 Z" />
            <path d="M50 92 L54 68 L46 68 Z" />
            <path d="M8 50 L32 54 L32 46 Z" />
            <path d="M92 50 L68 54 L68 46 Z" />
            
            <path d="M20 20 L38 38 L34 42 Z" />
            <path d="M80 20 L62 38 L66 42 Z" />
            <path d="M20 80 L38 62 L34 58 Z" />
            <path d="M80 80 L62 62 L66 58 Z" />
            
            <path d="M34 12 L44 33 L38 35 L34 12 Z" />
            <path d="M66 12 L56 33 L62 35 L66 12 Z" />
            <path d="M34 88 L44 67 L38 65 L34 88 Z" />
            <path d="M66 88 L56 67 L62 65 L66 88 Z" />

            <path d="M12 34 L33 44 L35 38 L12 34 Z" />
            <path d="M88 34 L67 44 L65 38 L88 34 Z" />
            <path d="M12 66 L33 56 L35 62 L12 66 Z" />
            <path d="M88 66 L67 56 L65 62 L88 66 Z" />
          </g>

          {/* Front row 2 (Vibrant lemon yellow foreground petals) */}
          <g fill="#fbbf24">
            <path d="M50 13 L53 34 L47 34 Z" />
            <path d="M50 87 L53 66 L47 66 Z" />
            <path d="M13 50 L34 53 L34 47 Z" />
            <path d="M87 50 L66 53 L66 47 Z" />
            
            <path d="M23 23 L40 40 L37 42 Z" />
            <path d="M77 23 L60 40 L63 42 Z" />
            <path d="M23 77 L40 60 L37 58 Z" />
            <path d="M77 77 L60 60 L63 58 Z" />

            <path d="M37 16 L45 35 L40 37 Z" />
            <path d="M63 16 L55 35 L60 37 Z" />
            <path d="M37 84 L45 65 L40 63 Z" />
            <path d="M63 84 L55 65 L60 63 Z" />

            <path d="M16 37 L35 45 L37 40 Z" />
            <path d="M84 37 L65 45 L63 40 Z" />
            <path d="M16 63 L35 55 L37 60 Z" />
            <path d="M84 63 L65 55 L63 60 Z" />
          </g>

          {/* Seed center disc with dual border rings */}
          <circle cx="50" cy="50" r="22" fill="url(#sun-center-grad)" stroke="#d97706" strokeWidth="2" />
          {/* Interactive seeds concentric rings */}
          <circle cx="50" cy="50" r="17" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.45" />
          <circle cx="50" cy="50" r="12" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.35" />
          <circle cx="50" cy="50" r="7" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="1 2" fill="none" opacity="0.5" />
        </svg>
      );

    case "lavender":
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
        >
          {/* STEM */}
          <path d="M50 96 Q49 54 50 14" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
          
          {/* NARROW LEAVES */}
          <path d="M50 82 Q25 78 30 65 Q40 72 50 78 Z" fill="#15803d" />
          <path d="M50 74 Q75 70 70 56 Q59 62 50 70 Z" fill="#15803d" />
          <path d="M50 60 Q28 55 33 42 Q42 49 50 55 Z" fill="#16a34a" />

          {/* LAYERED LAVENDER CHIPS */}
          {/* Cluster 1: Lower Bloom */}
          <g fill="#7e22ce" opacity="0.9">
            <circle cx="44" cy="56" r="4.5" />
            <circle cx="56" cy="56" r="4.5" />
            <circle cx="50" cy="53" r="4" />
          </g>
          <g fill="#a855f7">
            <ellipse cx="43" cy="55" rx="3" ry="4" stroke="#c084fc" strokeWidth="0.5" />
            <ellipse cx="57" cy="55" rx="3" ry="4" stroke="#c084fc" strokeWidth="0.5" />
            <circle cx="50" cy="57" r="3" fill="#ca8a04" opacity="0.25" />
          </g>

          {/* Cluster 2 */}
          <g fill="#6b21a8" opacity="0.95">
            <circle cx="41" cy="46" r="5" />
            <circle cx="59" cy="46" r="5" />
            <circle cx="50" cy="42" r="4.5" />
          </g>
          <g fill="#c084fc">
            <ellipse cx="41" cy="45" rx="3.5" ry="5" />
            <ellipse cx="59" cy="45" rx="3.5" ry="5" />
            <circle cx="50" cy="46" r="4" fill="#a855f7" />
          </g>

          {/* Cluster 3 */}
          <g fill="#7e22ce">
            <circle cx="42" cy="36" r="5" />
            <circle cx="58" cy="36" r="5" />
            <circle cx="50" cy="32" r="4.5" />
            <circle cx="45" cy="33" r="4" />
            <circle cx="55" cy="33" r="4" />
          </g>
          <g fill="#d8b4fe">
            <ellipse cx="42" cy="35" rx="3" ry="4.5" />
            <ellipse cx="58" cy="35" rx="3" ry="4.5" />
            <circle cx="50" cy="31" r="3" />
          </g>

          {/* Cluster 4 */}
          <g fill="#a855f7">
            <circle cx="43" cy="25" r="4.5" />
            <circle cx="57" cy="25" r="4.5" />
            <circle cx="50" cy="21" r="4" />
          </g>
          <g fill="#f3e8ff">
            <ellipse cx="43" cy="24" rx="2.5" ry="4" />
            <ellipse cx="57" cy="24" rx="2.5" ry="4" />
            <circle cx="50" cy="20" r="2.5" fill="#d8b4fe" />
          </g>

          {/* Cluster 5 Tip */}
          <g fill="#c084fc">
            <circle cx="45" cy="16" r="4" />
            <circle cx="55" cy="16" r="4" />
            <circle cx="50" cy="12" r="3.5" />
          </g>
          <g fill="#ffffff" opacity="0.95">
            <circle cx="50" cy="10" r="2.5" />
          </g>
        </svg>
      );

    case "white-daisy":
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
        >
          <defs>
            <radialGradient id="daisy-center-yellow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
            <filter id="daisy-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#334155" floodOpacity="0.16" />
            </filter>
          </defs>
          {/* Stem */}
          <path d="M50 50 Q48 74 46 96" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
          {/* Margarida leaflets */}
          <path d="M48 68 Q24 62 18 74 Q34 76 47 79 Z" fill="#15803d" />
          <path d="M49 75 Q72 66 76 78 Q62 80 48 84 Z" fill="#15803d" />

          {/* Delicate overlapping daisy white petals (16 petal layer) */}
          <g fill="#fafaf9" stroke="#e2e8f0" strokeWidth="0.75" filter="url(#daisy-shadow)">
            {/* Primary compass directions */}
            <path d="M50 14 C48 14 46 34 50 48 C54 34 52 14 50 14 Z" />
            <path d="M50 86 C48 86 46 66 50 52 C54 66 52 86 50 86 Z" />
            <path d="M14 50 C14 48 34 46 48 50 C34 54 14 52 14 50 Z" />
            <path d="M86 50 C86 48 66 46 52 50 C66 54 86 52 86 50 Z" />

            {/* Diagonals */}
            <path d="M24 24 C23 23 37 37 48 48 C37 37 23 23 24 24 Z" />
            <path d="M76 76 C75 75 61 61 52 52 C61 61 75 75 76 76 Z" />
            <path d="M24 76 C23 75 37 61 48 52 C37 61 23 75 24 76 Z" />
            <path d="M76 24 C75 23 61 37 52 48 C61 37 75 23 76 24 Z" />

            {/* Outer buffer petals */}
            <path d="M36 17 L49 48 L41 38 Z" fill="#fff" />
            <path d="M64 83 L51 52 L59 62 Z" fill="#fff" />
            <path d="M17 36 L48 49 L38 41 Z" fill="#fff" />
            <path d="M83 64 L52 51 L62 59 Z" fill="#fff" />
            <path d="M64 17 L51 48 L59 38 Z" fill="#fff" />
            <path d="M36 83 L49 52 L41 62 Z" fill="#fff" />
            <path d="M83 36 L52 49 L62 41 Z" fill="#fff" />
            <path d="M17 64 L48 51 L38 59 Z" fill="#fff" />
          </g>

          {/* Golden textured floral central button */}
          <circle cx="50" cy="50" r="17" fill="url(#daisy-center-yellow)" stroke="#b45309" strokeWidth="1" />
          <circle cx="50" cy="50" r="11" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.4" />
          <circle cx="50" cy="50" r="6" stroke="#ca8a04" strokeWidth="1" strokeDasharray="1 1" fill="none" opacity="0.6" />
        </svg>
      );

    case "orchid":
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
        >
          <defs>
            <linearGradient id="orchid-pink" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#db2777" />
              <stop offset="55%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </linearGradient>
            <filter id="orchid-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#86198f" floodOpacity="0.2" />
            </filter>
          </defs>
          {/* Graceful curving stalk stem */}
          <path d="M50 96 Q43 66 50 49" stroke="#166534" strokeWidth="4.5" strokeLinecap="round" />
          {/* Glossy thick orchid leaves */}
          <path d="M48 88 Q20 84 15 63 Q34 68 45 78 Z" fill="#14532d" />
          <path d="M50 90 Q76 86 81 70 Q66 70 52 82 Z" fill="#14532d" />

          {/* Orchid blossom body with gorgeous filters */}
          <g filter="url(#orchid-glow)">
            {/* 3 Outer Sepals */}
            {/* Upper central sepal */}
            <path d="M50 49 C41 38 37 10 50 10 C63 10 59 38 50 49 Z" fill="#be185d" opacity="0.9" />
            {/* Left bottom sepal */}
            <path d="M50 49 C37 47 16 63 22 71 C31 79 45 63 50 49 Z" fill="#9d174d" opacity="0.95" />
            {/* Right bottom sepal */}
            <path d="M50 49 C63 47 84 63 78 71 C69 79 55 63 50 49 Z" fill="#9d174d" opacity="0.95" />

            {/* 2 Wide Fluttering Side Petals */}
            <path d="M50 47 Q18 36 16 50 Q22 66 50 50 Z" fill="url(#orchid-pink)" />
            <path d="M50 47 Q82 36 84 50 Q78 66 50 50 Z" fill="url(#orchid-pink)" />

            {/* Center labellum (orchid lip petal throat structure) */}
            <path d="M50 44 C41 44 37 57 43 64 C47 69 53 69 57 64 C63 57 59 44 50 44 Z" fill="#be185d" />
            {/* Yellow heart opening */}
            <path d="M50 51 C44 51 41 61 45 67 C47 69 53 69 55 67 C59 61 56 51 50 51 Z" fill="#facc15" />
            
            {/* Leopard spotted throat details */}
            <circle cx="48" cy="57" r="1.2" fill="#9f0035" />
            <circle cx="52" cy="57" r="1.2" fill="#9f0035" />
            <circle cx="46" cy="62" r="1.0" fill="#9f0035" />
            <circle cx="54" cy="62" r="1.0" fill="#9f0035" />
            <circle cx="50" cy="61" r="1.5" fill="#f43f5e" />

            {/* Fine orchid veins */}
            <path d="M50 18 Q50 34 50 44" stroke="#fdf2f8" strokeWidth="1" opacity="0.45" />
            <path d="M26 47 Q37 47 47 47" stroke="#fdf2f8" strokeWidth="1" opacity="0.45" />
            <path d="M74 47 Q63 47 53 47" stroke="#fdf2f8" strokeWidth="1" opacity="0.45" />
          </g>
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={style}
        >
          <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5.5 6 7.5 3.5-2 6-4 6-7.5 0-3.5-2.5-6-6-6zm0 10c-1.5-1-2.5-2-2.5-4 0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 2-1 3-2.5 4z" />
        </svg>
      );
  }
}
