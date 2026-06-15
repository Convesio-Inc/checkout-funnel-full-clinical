/**
 * UpsellOfferBanner
 * -----------------------------------------------------------------------------
 * Post-purchase upsell card shown on the thank-you page after the order
 * confirmation notice. Displays the upsell product with a live countdown timer.
 * Clicking "Claim Offer" opens the upsell checkout modal.
 *
 * UpsellProductConfig is defined and exported from this file.
 *
 * Markers:
 *   - root          data-section="upsell-offer"
 *   - timer badge   data-slot="upsell-timer"
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export interface UpsellProductConfig {
  name: string;
  sku: string;
  image: { src: string; alt: string };
  salePrice: string;
  regularPrice: string;
  discountLabel: string;
  upsellMinutes: number;
  amountMinor: number;
  currency: string;
}

export interface UpsellOfferBannerProps {
  upsell: UpsellProductConfig;
  onClaim: () => void;
}

const ctaClassName =
  "order-cta gloss-cta h-12 rounded-md px-5 text-[14px] font-bold tracking-[0.04em] text-white uppercase cursor-pointer";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function UpsellOfferBanner({ upsell, onClaim }: UpsellOfferBannerProps) {
  const [remaining, setRemaining] = useState(upsell.upsellMinutes * 60);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const mmss = `${pad(minutes)}:${pad(seconds)}`;
  const expired = remaining === 0;

  if (expired) return null;

  return (
    <section
      data-section="upsell-offer"
      className="overflow-hidden rounded-md gloss-card"
    >
      <div className="flex items-center justify-between border-b border-line2 px-4 py-3">
        <h2 className="text-[15px] font-bold text-ink">Wait! Limited time offer</h2>
        <span
          data-slot="upsell-timer"
          aria-live="polite"
          aria-label={`Offer expires in ${mmss}`}
          className="num text-[15px] font-bold tabular-nums text-rust"
        >
          {mmss}
        </span>
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={upsell.image.src}
          alt={upsell.image.alt}
          className="h-14 w-14 shrink-0 rounded-md border border-line object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{upsell.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="num text-[14px] font-bold text-ink">{upsell.salePrice}</span>
            <span className="num text-[13px] text-ink3 line-through">{upsell.regularPrice}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber px-2 py-0.5 text-[11px] font-bold text-white">
              <Icon.Tag className="h-3 w-3" aria-hidden="true" />
              {upsell.discountLabel}
            </span>
          </div>
        </div>
        <Button size="lg" onClick={onClaim} data-slot="upsell-cta" className={ctaClassName}>
          Claim Offer
        </Button>
      </div>
    </section>
  );
}
