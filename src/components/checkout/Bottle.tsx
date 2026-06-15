/**
 * Bottle
 * -----------------------------------------------------------------------------
 * SVG-drawn supplement bottle used in the product hero (large) and the bundle
 * cards (small). `ghost` renders the faded "free bonus" silhouette. Gradient
 * IDs are made unique per instance with useId so multiple bottles can render
 * on one page without clashing defs.
 * -----------------------------------------------------------------------------
 */

import { useId } from "react";

export interface BottleProps {
  small?: boolean;
  ghost?: boolean;
}

export function Bottle({ small = false, ghost = false }: BottleProps) {
  const w = small ? 22 : 70;
  const h = small ? 56 : 168;
  const id = useId().replace(/:/g, "");

  return (
    <svg width={w} height={h} viewBox="0 0 70 168" aria-hidden="true">
      <defs>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0e2a20" />
          <stop offset="0.18" stopColor="#2d5e48" />
          <stop offset="0.45" stopColor="#3a7a5e" />
          <stop offset="0.7" stopColor="#1d3a2d" />
          <stop offset="1" stopColor="#0a1f17" />
        </linearGradient>
        <linearGradient id={`cap-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1a1a" />
          <stop offset="0.3" stopColor="#4a4a4a" />
          <stop offset="0.6" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id={`label-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf8ee" />
          <stop offset="1" stopColor="#ece6d4" />
        </linearGradient>
      </defs>
      <g opacity={ghost ? 0.32 : 1}>
        {!ghost && <ellipse cx="35" cy="162" rx="22" ry="3" fill="rgba(15,19,16,0.18)" />}
        <rect x="18" y="6" width="34" height="12" rx="2" fill={`url(#cap-${id})`} />
        <rect x="18" y="6" width="34" height="2" fill="rgba(255,255,255,0.35)" />
        <rect x="22" y="18" width="26" height="6" fill={`url(#glass-${id})`} />
        <path
          d="M14 24 h42 v8 q0 4 -4 6 v110 q0 8 -8 8 h-18 q-8 0 -8 -8 v-110 q-4 -2 -4 -6 z"
          fill={ghost ? "#e9e4d4" : `url(#glass-${id})`}
          stroke="#0a1f17"
          strokeWidth="0.6"
        />
        {!ghost && (
          <path
            d="M19 38 q-1 4 -1 8 v90 q0 4 1 6"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {!ghost && (
          <path d="M23 42 v100" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
        )}
        {!ghost && (
          <path d="M51 38 v108" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        )}
        {!ghost && (
          <g>
            <rect x="16" y="60" width="38" height="58" fill={`url(#label-${id})`} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
            <rect x="16" y="60" width="38" height="3" fill="#1d3a2d" />
            <rect x="16" y="115" width="38" height="3" fill="#1d3a2d" />
            <text x="35" y="78" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="700" fontSize="6" fill="#1d3a2d" letterSpacing="1.2">MERIDIAN</text>
            <text x="35" y="90" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="600" fontSize="4.5" fill="#6b6f64" letterSpacing="0.4">DAILY GREENS</text>
            <text x="35" y="97" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="600" fontSize="4.5" fill="#6b6f64" letterSpacing="0.4">COMPLEX</text>
            <rect x="22" y="104" width="26" height="5" rx="0.5" fill="#e07b1f" />
            <text x="35" y="108" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="700" fontSize="3.5" fill="#ffffff" letterSpacing="0.5">32 INGREDIENTS</text>
          </g>
        )}
      </g>
    </svg>
  );
}
