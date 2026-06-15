/**
 * BundleSelector
 * -----------------------------------------------------------------------------
 * One-time / subscribe toggle + the three bundle cards. The subscribe tab is
 * intentionally disabled (visual only) — one-time purchase is the only active
 * path in this iteration. Selecting a card calls onChange(bundle); the parent
 * owns the selected bundle and drives the charge amount from it.
 *
 * Markers:
 *   - root          data-section="bundle-selector"
 *   - each card     data-section="bundle-card" + data-bundle-id
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";
import { Bottle } from "@/components/checkout/Bottle";
import { useViewers } from "@/hooks/useStorefrontUrgency";
import { type Bundle, BUNDLES } from "./bundles";

function formatDollars(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

interface BundleCardProps {
  bundle: Bundle;
  selected: boolean;
  onSelect: () => void;
}

function BundleCard({ bundle, selected, onSelect }: BundleCardProps) {
  return (
    <button
      type="button"
      data-section="bundle-card"
      data-bundle-id={bundle.id}
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        "relative w-full text-left rounded-md transition px-5 py-5",
        selected ? "ring-forest" : "gloss-card-flat hover:border-ink2",
      ].join(" ")}
    >
      {bundle.isMostChosen && (
        <div className="absolute -top-2.5 left-5 bg-forest text-bone text-[10.5px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-[3px]">
          Most chosen · {bundle.mostChosenPercent}%
        </div>
      )}
      <div className="flex items-start gap-4">
        <div
          className={[
            "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
            selected ? "bg-forest text-bone" : "text-transparent border border-ink3/40",
          ].join(" ")}
        >
          <Icon.Check className="w-3 h-3" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <div className="font-semibold text-[17px] tracking-tight text-ink">
              {bundle.bottleCount} Bottle{bundle.bottleCount > 1 ? "s" : ""}
            </div>
            <div className="text-ink3 text-[12.5px]">· {bundle.supplyLabel}</div>
          </div>
          <div className="mt-1 text-[12px] text-ink2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-forest">
              <Icon.Truck className="w-3.5 h-3.5" /> <span className="font-medium">Free shipping</span>
            </span>
            {bundle.savingsMinor ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-amber text-white font-medium text-[11px]">
                Save ${(bundle.savingsMinor / 100).toFixed(0)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="num text-[24px] font-semibold tracking-tight leading-none text-ink">
            ${bundle.pricePerBottle.toFixed(2)}
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink3 mt-1">per bottle</div>
          <div className="mt-2 text-[12px] text-ink2">
            {bundle.savingsMinor ? (
              <span className="line-through text-ink3 mr-1">
                {formatDollars(bundle.originalAmountMinor)}
              </span>
            ) : null}
            <span className="num font-medium">{formatDollars(bundle.totalAmountMinor)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-1.5 pl-9">
        {Array.from({ length: bundle.bottleCount }).map((_, i) => (
          <Bottle key={`main-${i}`} small />
        ))}
        {bundle.freeBonusBottles > 0 && (
          <>
            <span className="num text-[11px] text-forest font-semibold ml-1 mb-1">
              + {bundle.freeBonusBottles} FREE
            </span>
            {Array.from({ length: bundle.freeBonusBottles }).map((_, i) => (
              <Bottle key={`free-${i}`} small ghost />
            ))}
          </>
        )}
      </div>
    </button>
  );
}

interface BundleSelectorProps {
  value: Bundle;
  onChange: (bundle: Bundle) => void;
}

export function BundleSelector({ value, onChange }: BundleSelectorProps) {
  const viewers = useViewers();

  return (
    <div data-section="bundle-selector" className="space-y-3">
      {/* Section header */}
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold text-[15px] tracking-tight text-ink">Choose your bundle</h2>
        <div className="text-[11.5px] text-ink3 inline-flex items-center gap-1.5">
          <span className="livedot inline-block w-1.5 h-1.5 rounded-full bg-amber" />
          <span className="num">{viewers}</span> shoppers picking now
        </div>
      </div>

      {/* One-time / subscribe toggle (subscribe disabled — visual only) */}
      <div className="rounded-md p-1 flex text-[13px] bg-bone2 border border-line">
        <button
          type="button"
          className="flex-1 px-4 py-2.5 rounded-[5px] transition flex items-center justify-center gap-2 bg-forest text-bone font-medium"
        >
          One-time purchase
        </button>
        {/* TODO: subscription flow */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Coming soon"
          className="flex-1 px-4 py-2.5 rounded-[5px] transition flex items-center justify-center gap-2 text-ink3 opacity-60 cursor-not-allowed"
        >
          <Icon.Leaf className="w-3.5 h-3.5" />
          <span>Subscribe &amp; save 20%</span>
          <span className="num text-[10.5px] px-1.5 py-0.5 bg-amber-soft text-amber2 rounded-sm">
            −20%
          </span>
        </button>
      </div>

      {/* Bundle cards */}
      <div className="space-y-3 mt-2">
        {BUNDLES.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            selected={value.id === bundle.id}
            onSelect={() => onChange(bundle)}
          />
        ))}
      </div>
    </div>
  );
}
