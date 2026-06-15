/**
 * OrderSummaryCard
 * -----------------------------------------------------------------------------
 * Sits at the bottom of the checkout form. Shows the selected bundle's line
 * total, free shipping, the grand total, and the amber gloss pay button (with
 * busy / confirmed states), followed by the security trust row.
 *
 * Marker: data-section="order-summary"
 * -----------------------------------------------------------------------------
 */

import { useState, useEffect, useRef } from "react";

import { Icon } from "@/components/icons";
import { SecurityBadges } from "@/components/checkout/SecurityBadges";
import { type Bundle } from "@/components/checkout/bundles";

function formatDollars(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

export interface OrderSummaryCardProps {
  selectedBundle: Bundle;
  /** When true the Pay button is non-interactive. Defaults to false. */
  payDisabled?: boolean;
  /** When true the button shows a spinner and stays disabled. */
  payLoading?: boolean;
}

export function OrderSummaryCard({
  selectedBundle,
  payDisabled = false,
  payLoading = false,
}: OrderSummaryCardProps) {
  const disabled = payDisabled || payLoading;

  const [ctaState, setCtaState] = useState<"idle" | "busy" | "done">("idle");
  const prevLoading = useRef(false);

  useEffect(() => {
    if (payLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCtaState("busy");
      prevLoading.current = true;
    } else if (prevLoading.current) {
      prevLoading.current = false;
      setCtaState("done");
      const t = setTimeout(() => setCtaState("idle"), 2000);
      return () => clearTimeout(t);
    }
  }, [payLoading]);

  const totalFormatted = formatDollars(selectedBundle.totalAmountMinor);
  const lineLabel = `${selectedBundle.bottleCount} × Daily Greens Complex`;

  return (
    <div data-section="order-summary" className="space-y-6">
      {/* Line items + total */}
      <div className="rule pt-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-ink2">
            {lineLabel} <span className="text-ink3">(one-time)</span>
          </span>
          <span className="num text-ink">{totalFormatted}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] mt-1">
          <span className="text-ink2">Shipping</span>
          <span className="num text-forest font-medium">FREE</span>
        </div>
        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-line">
          <span className="text-[12px] uppercase tracking-[0.14em] text-ink3">Total today</span>
          <div className="text-right">
            <div className="num text-[22px] font-semibold leading-none text-ink">{totalFormatted}</div>
            <div className="text-[11px] text-ink3 mt-0.5">USD · billed once</div>
          </div>
        </div>
      </div>

      {/* Pay CTA */}
      <button
        data-slot="cta-primary"
        data-state={ctaState}
        type="submit"
        disabled={disabled}
        aria-disabled={disabled}
        className="order-cta gloss-cta w-full text-white rounded-md py-5 font-bold tracking-[0.08em] uppercase text-[18px] flex items-center justify-center gap-3 relative cursor-pointer"
      >
        <span className="cta-main flex items-center justify-center gap-3 relative z-10">
          <Icon.Lock className="w-5 h-5" />
          <span>Rush my order — {totalFormatted}</span>
          <Icon.Arrow className="w-5 h-5" />
        </span>

        <span className="cta-overlay cta-overlay-busy">
          <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span className="text-[15px] tracking-[0.02em] normal-case">Placing your order…</span>
        </span>

        <span className="cta-overlay cta-overlay-done">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path className="cta-checkmark" d="M5 12.5l4 4 10-10" />
          </svg>
          <span className="text-[15px] tracking-[0.02em] normal-case">Order confirmed</span>
        </span>
      </button>

      <div className="text-center text-[11.5px] text-ink3 -mt-2 flex items-center justify-center gap-1.5">
        <Icon.Lock className="w-3.5 h-3.5" /> Secure 256-bit SSL encryption · You won't be charged
        until you click above
      </div>

      <SecurityBadges />
    </div>
  );
}
