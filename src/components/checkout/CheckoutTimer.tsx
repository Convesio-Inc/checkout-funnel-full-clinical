/**
 * CheckoutTimer
 * -----------------------------------------------------------------------------
 * Template-inspired countdown banner rendered inside the checkout form stack.
 * Displays lead text, a live MM:SS timer badge, and helper text. Stops at zero.
 *
 * Edit the initial countdown values and lead text directly in this file
 * (TIMER_DAYS, TIMER_MINUTES, TIMER_SECONDS).
 *
 * Markers:
 *   - root              data-section="checkout-timer"
 *   - countdown timer   data-slot="countdown-timer"
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";

const TIMER_DAYS = 0;
const TIMER_MINUTES = 14;
const TIMER_SECONDS = 59;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CheckoutTimer() {
  const initialSeconds =
    TIMER_DAYS * 86400 + TIMER_MINUTES * 60 + TIMER_SECONDS;

  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const mmss = `${pad(minutes)}:${pad(seconds)}`;

  return (
    <div
      data-section="checkout-timer"
      aria-live="polite"
      className="flex flex-wrap items-center gap-2"
    >
      <strong className="uppercase text-xs text-muted-foreground font-light tracking-widest">
        Reserved
      </strong>
      <span
        data-slot="countdown-timer"
        className="inline-block min-w-[52px] text-center font-mono text-xs font-medium sm:text-sm"
      >
        {mmss}
      </span>
    </div>
  );
}
