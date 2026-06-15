/**
 * UrgencyRail
 * -----------------------------------------------------------------------------
 * Sticky top rail across all storefront pages. A forest row (live viewers,
 * shipping/tested assurances, a "reserved for" countdown) sits above an amber
 * sub-bar reinforcing the free-bottle deadline. Self-contained: owns its own
 * countdown + viewer counter.
 *
 * Markers:
 *   - root            data-section="urgency-rail"
 *   - reserved timer  data-slot="reserved-timer"
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";
import { useCountdown, useViewers } from "@/hooks/useStorefrontUrgency";

export function UrgencyRail() {
  const { mm, ss } = useCountdown(5 * 60);
  const viewers = useViewers();

  return (
    <div
      data-section="urgency-rail"
      className="sticky top-0 z-40 gloss-forest text-bone"
    >
      <div className="max-w-[1180px] mx-auto px-5 py-2.5 flex items-center justify-between gap-6 text-[12.5px]">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber3 livedot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber3" />
          </span>
          <span className="num tabular-nums font-medium">{viewers}</span>
          <span className="text-bone/75">others are viewing this offer right now</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-bone/70">
          <Icon.Truck className="w-4 h-4" />
          <span>Free U.S. shipping on every order</span>
          <span className="opacity-40">·</span>
          <Icon.Leaf className="w-4 h-4" />
          <span>3rd-party tested</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-bone/70 hidden sm:inline">Reserved for</span>
          <span
            data-slot="reserved-timer"
            className="num font-semibold tracking-[0.04em] gloss-pill px-2.5 py-1 rounded-[3px]"
          >
            <span>{mm}</span>
            <span className="tick">:</span>
            <span>{ss}</span>
          </span>
        </div>
      </div>
      <div className="bg-amber text-ink relative">
        <div className="max-w-[1180px] mx-auto px-5 py-1.5 text-[12px] font-medium tracking-[0.01em] flex items-center justify-center gap-2 text-center">
          <span className="uppercase tracking-[0.14em] text-[10.5px] font-semibold">Hurry —</span>
          <span>
            Order in the next <span className="num font-semibold">{mm}:{ss}</span> to guarantee your{" "}
            <span className="font-semibold">2 FREE bottles</span> with the 3-bottle bundle.
          </span>
        </div>
      </div>
    </div>
  );
}
