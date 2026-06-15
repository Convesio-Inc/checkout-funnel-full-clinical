/**
 * useStorefrontUrgency
 * -----------------------------------------------------------------------------
 * Small presentational hooks shared by the storefront chrome and the bundle
 * selector to drive the "reserved for" countdown and the live-viewer counter.
 * Purely cosmetic — no data is persisted.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";

/** Counts down from `seconds`, formatted as zero-padded mm / ss. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const t = setInterval(
      () => setRemaining((r) => (r > 0 ? r - 1 : 0)),
      1000,
    );
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { mm, ss, remaining };
}

/** Jitters a "viewers right now" count within a believable band. */
export function useViewers(initial = 17) {
  const [n, setN] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => {
      setN((v) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(24, Math.max(11, v + delta));
      });
    }, 3200);
    return () => clearInterval(t);
  }, []);
  return n;
}
