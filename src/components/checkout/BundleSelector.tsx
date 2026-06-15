import { useState } from "react";

export type Bundle = {
  id: "one-bottle" | "two-bottle" | "three-bottle";
  bottleCount: number;
  supplyLabel: string;
  freeBonusBottles: number;
  pricePerBottle: number;
  totalAmountMinor: number;
  originalAmountMinor: number;
  savingsMinor?: number;
  isMostChosen?: boolean;
  mostChosenPercent?: number;
};

export const BUNDLES: Bundle[] = [
  {
    id: "three-bottle",
    bottleCount: 3,
    supplyLabel: "90-day supply + 2 free",
    freeBonusBottles: 2,
    pricePerBottle: 33.0,
    totalAmountMinor: 9900,
    originalAmountMinor: 14700,
    savingsMinor: 4800,
    isMostChosen: true,
    mostChosenPercent: 71,
  },
  {
    id: "two-bottle",
    bottleCount: 2,
    supplyLabel: "60-day supply",
    freeBonusBottles: 0,
    pricePerBottle: 39.5,
    totalAmountMinor: 7900,
    originalAmountMinor: 9800,
    savingsMinor: 1900,
  },
  {
    id: "one-bottle",
    bottleCount: 1,
    supplyLabel: "30-day supply",
    freeBonusBottles: 0,
    pricePerBottle: 49.0,
    totalAmountMinor: 4900,
    originalAmountMinor: 4900,
  },
];

function formatDollars(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

function Bottle({ faded = false }: { faded?: boolean }) {
  return (
    <div className={`relative flex-shrink-0 ${faded ? "opacity-35" : ""}`}>
      <div className="w-[9px] h-[6px] bg-[#3a6048] rounded-t-[2px] mx-auto" />
      <div className="w-[22px] h-[30px] bg-gradient-to-b from-[#5a8868] to-[#3a6048] rounded-[3px]" />
    </div>
  );
}

interface BundleCardProps {
  bundle: Bundle;
  selected: boolean;
  onSelect: () => void;
}

function BundleCard({ bundle, selected, onSelect }: BundleCardProps) {
  const totalBottles = bundle.bottleCount + bundle.freeBonusBottles;

  return (
    <div
      data-section="bundle-card"
      data-bundle-id={bundle.id}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-[10px] border px-4 py-3.5 transition-colors ${
        selected
          ? "border-[2.5px] border-[#1a3028] bg-[#f7fdf8]"
          : "border-[1.5px] border-[#e0d9cc] bg-white hover:border-[#1a3028]/40"
      }`}
    >
      {bundle.isMostChosen && (
        <div className="absolute -top-px left-3.5 bg-[#1a3028] text-white text-[9px] font-bold px-2 py-[3px] rounded-b-[4px] tracking-[0.08em]">
          MOST CHOSEN · {bundle.mostChosenPercent}%
        </div>
      )}

      <div
        className={`flex items-start justify-between ${bundle.isMostChosen ? "mt-4" : ""}`}
      >
        {/* Left: radio + label */}
        <div className="flex items-start gap-2.5 flex-1">
          <div
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selected ? "border-[#1a3028] bg-[#1a3028] text-white" : "border-[#ccc]"
            }`}
          >
            {selected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4l2.5 2.5L9 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#1a3028]">
              {bundle.bottleCount} Bottle{bundle.bottleCount > 1 ? "s" : ""}{" "}
              <span className="text-[#888] font-normal text-[12px]">
                · {bundle.supplyLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[#3a6a4a] font-medium">
                ✓ Free shipping
              </span>
              {bundle.savingsMinor && (
                <span className="text-[10px] font-bold text-[#2a7a4a] bg-[#e8f5ee] px-[6px] py-[2px] rounded-[4px]">
                  Save ${(bundle.savingsMinor / 100).toFixed(0)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: price */}
        <div className="text-right flex-shrink-0 ml-2">
          <div className="text-[20px] font-extrabold text-[#1a3028] leading-none">
            ${bundle.pricePerBottle.toFixed(2)}
          </div>
          <div className="text-[10px] text-[#999] uppercase tracking-[0.06em] mt-0.5">
            per bottle
          </div>
          {bundle.savingsMinor ? (
            <>
              <div className="text-[11px] text-[#bbb] line-through mt-0.5">
                {formatDollars(bundle.originalAmountMinor)}
              </div>
              <div className="text-[12px] font-semibold text-[#1a3028]">
                {formatDollars(bundle.totalAmountMinor)}
              </div>
            </>
          ) : (
            <div className="text-[12px] font-semibold text-[#1a3028] mt-0.5">
              {formatDollars(bundle.totalAmountMinor)}
            </div>
          )}
        </div>
      </div>

      {/* Bottle illustrations */}
      <div className="flex items-end gap-[3px] mt-3 pt-3 border-t border-[#f0ece4]">
        {Array.from({ length: bundle.bottleCount }).map((_, i) => (
          <Bottle key={`main-${i}`} />
        ))}
        {bundle.freeBonusBottles > 0 && (
          <>
            {Array.from({ length: bundle.freeBonusBottles }).map((_, i) => (
              <Bottle key={`free-${i}`} faded />
            ))}
            <span className="text-[10px] text-[#888] ml-1.5 self-center">
              + {bundle.freeBonusBottles} FREE
            </span>
          </>
        )}
        <span className="text-[10px] text-[#bbb] ml-auto self-center">
          {totalBottles} bottle{totalBottles > 1 ? "s" : ""} total
        </span>
      </div>
    </div>
  );
}

interface BundleSelectorProps {
  value: Bundle;
  onChange: (bundle: Bundle) => void;
}

export function BundleSelector({ value, onChange }: BundleSelectorProps) {
  const [tab, setTab] = useState<"one-time" | "subscribe">("one-time");

  return (
    <div data-section="bundle-selector" className="mb-3">
      {/* One-time / subscribe toggle */}
      <div className="flex bg-[#e8e0d4] rounded-[8px] p-1 mb-2.5">
        <button
          type="button"
          onClick={() => setTab("one-time")}
          className={`flex-1 text-center py-2 rounded-[6px] text-[12px] font-semibold transition-colors ${
            tab === "one-time"
              ? "bg-[#1a3028] text-white"
              : "text-[#666] hover:text-[#333]"
          }`}
        >
          One-time purchase
        </button>
        {/* TODO: subscription flow */}
        <button
          type="button"
          onClick={() => setTab("subscribe")}
          className={`flex-1 text-center py-2 rounded-[6px] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            tab === "subscribe"
              ? "bg-[#1a3028] text-white"
              : "text-[#666] hover:text-[#333]"
          }`}
        >
          Subscribe &amp; save
          <span className="bg-[#c8620a] text-white text-[9px] font-bold px-1.5 py-[1px] rounded-[3px]">
            -20%
          </span>
        </button>
      </div>

      {/* Shoppers row */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[12px] font-bold text-[#1a3028]">
          Choose your bundle
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#666]">
          <span className="w-[7px] h-[7px] rounded-full bg-[#c8620a] animate-pulse inline-block" />
          18 shoppers picking now
        </span>
      </div>

      {/* Bundle cards */}
      <div className="flex flex-col gap-2">
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
