/**
 * BundleSelector
 * -----------------------------------------------------------------------------
 * AG1 supply picker: a One-time / Subscribe segmented toggle (Subscribe is
 * disabled — cosmetic only) above three plan cards. One-time is the only
 * functional path; selecting a card calls onChange(bundle) and the parent
 * drives the charge amount from the selection.
 *
 * Markers:
 *   - root          data-section="bundle-selector"
 *   - each card     data-section="bundle-card" + data-bundle-id
 * -----------------------------------------------------------------------------
 */

import { type Bundle, BUNDLES } from "./bundles";

const LIST_PER_BOTTLE = 49; // compare-at $/bottle for the strike price

function PlanCard({
  bundle,
  selected,
  onSelect,
}: {
  bundle: Bundle;
  selected: boolean;
  onSelect: () => void;
}) {
  const featured = Boolean(bundle.isMostChosen);
  const list = LIST_PER_BOTTLE * bundle.bottleCount;
  const total = bundle.totalAmountMinor / 100;
  const save = bundle.savingsMinor ? bundle.savingsMinor / 100 : 0;

  return (
    <button
      type="button"
      data-section="bundle-card"
      data-bundle-id={bundle.id}
      aria-pressed={selected}
      onClick={onSelect}
      className={"plan relative text-left p-4 pt-5 " + (selected ? "on" : "")}
    >
      {featured && (
        <span className="save-chip absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          Best value
        </span>
      )}
      <div className="flex items-start justify-between">
        <span className="ringdot mt-0.5" />
        {save > 0 ? (
          <span className={"num text-[10.5px] font-semibold whitespace-nowrap " + (selected ? "text-lime" : "text-rust")}>
            Save ${save.toFixed(0)}
          </span>
        ) : (
          <span className="text-[10.5px]">&nbsp;</span>
        )}
      </div>
      <div className="mt-3">
        <div className={"text-[13px] font-medium whitespace-nowrap " + (selected ? "text-sand/80" : "text-ink2")}>
          {bundle.bottleCount} bottle{bundle.bottleCount > 1 ? "s" : ""}
        </div>
        <div className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
          <span className={"num text-[24px] leading-none font-medium tracking-tight " + (selected ? "text-sand" : "text-ink")}>
            ${bundle.pricePerBottle.toFixed(2)}
          </span>
          <span className={"text-[10.5px] " + (selected ? "text-sand/60" : "text-ink3")}>/bottle</span>
        </div>
        <div className="mt-1.5 text-[11px] num whitespace-nowrap">
          <span className={"strike mr-1 " + (selected ? "!text-sand/40" : "")}>${list.toFixed(2)}</span>
          <span className={selected ? "text-sand/80" : "text-ink2"}>${total.toFixed(2)}</span>
        </div>
        <div className={"mt-1.5 text-[11px] whitespace-nowrap " + (selected ? "text-sand/60" : "text-ink3")}>
          {bundle.supplyLabel}
        </div>
      </div>
    </button>
  );
}

export interface BundleSelectorProps {
  value: Bundle;
  onChange: (bundle: Bundle) => void;
}

export function BundleSelector({ value, onChange }: BundleSelectorProps) {
  const ordered = [...BUNDLES].sort((a, b) => a.bottleCount - b.bottleCount);

  return (
    <div data-section="bundle-selector">
      {/* One-time / Subscribe toggle (Subscribe disabled — cosmetic only) */}
      <div className="mb-4">
        <div className="seg-track flex items-center w-full text-[13px] font-medium">
          <button type="button" className="flex-1 py-2.5 seg-on">
            One-time
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Coming soon"
            className="flex-1 py-2.5 flex items-center justify-center gap-2 text-ink4 cursor-not-allowed"
          >
            Subscribe
            <span className="num text-[10.5px] font-semibold text-rust">−20%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {ordered.map((bundle) => (
          <PlanCard
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
