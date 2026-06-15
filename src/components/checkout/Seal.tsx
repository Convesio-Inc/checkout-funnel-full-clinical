/**
 * Seal
 * -----------------------------------------------------------------------------
 * Gold "30 Day Money Back" guarantee seal, drawn as SVG. Used by GuaranteeCard.
 * Gradient IDs are unique per instance via useId.
 * -----------------------------------------------------------------------------
 */

import { useId } from "react";

export function Seal() {
  const id = useId().replace(/:/g, "");

  return (
    <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true" className="shrink-0">
      <defs>
        <radialGradient id={`seal-gold-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff3d4" />
          <stop offset="0.35" stopColor="#e9c478" />
          <stop offset="0.7" stopColor="#b58a3c" />
          <stop offset="1" stopColor="#6d4f1a" />
        </radialGradient>
        <radialGradient id={`seal-inner-${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffbef" />
          <stop offset="0.6" stopColor="#f7e9c5" />
          <stop offset="1" stopColor="#e0c483" />
        </radialGradient>
        <linearGradient id={`seal-ray-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#caa15a" />
          <stop offset="1" stopColor="#8d6a2a" />
        </linearGradient>
      </defs>
      <g transform="translate(56 56)">
        {Array.from({ length: 24 }).map((_, i) => (
          <path
            key={i}
            d="M-2 -54 L2 -54 L1 -42 L-1 -42 Z"
            fill={`url(#seal-ray-${id})`}
            transform={`rotate(${i * 15})`}
          />
        ))}
        <circle r="42" fill={`url(#seal-gold-${id})`} />
        <circle r="42" fill="none" stroke="#6d4f1a" strokeWidth="0.6" opacity="0.6" />
        <path d="M-38 -10 a 38 38 0 0 1 60 -28" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
        <circle r="34" fill={`url(#seal-inner-${id})`} stroke="#8d6a2a" strokeWidth="0.8" />
        <circle r="30" fill="none" stroke="#8d6a2a" strokeWidth="0.4" strokeDasharray="1 2" />
        <text textAnchor="middle" y="-8" fontFamily="Geist, sans-serif" fontWeight="700" fontSize="9" fill="#5a3f12" letterSpacing="1.2">30 DAY</text>
        <text textAnchor="middle" y="6" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="16" fill="#5a3f12">Money</text>
        <text textAnchor="middle" y="20" fontFamily="Geist, sans-serif" fontWeight="700" fontSize="9" fill="#5a3f12" letterSpacing="1.2">BACK</text>
      </g>
    </svg>
  );
}
