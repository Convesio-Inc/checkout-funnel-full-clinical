/**
 * SecurityBadges
 * -----------------------------------------------------------------------------
 * Trust row shown beneath the pay button: four assurance badges (encryption,
 * PCI, verified merchant, privacy), each a forest icon chip + label.
 *
 * Marker: data-section="security-badges"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

import { Icon } from "@/components/icons";

interface BadgeProps {
  title: string;
  sub: string;
  mark: React.ReactNode;
}

function Badge({ title, sub, mark }: BadgeProps) {
  return (
    <div className="gloss-card-flat rounded-md px-2.5 py-2 flex items-center gap-2 min-w-0">
      <div className="w-8 h-8 rounded-md bg-forest text-bone flex items-center justify-center shrink-0">
        {mark}
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] font-semibold tracking-[0.06em] truncate text-ink">{title}</div>
        <div className="text-[9.5px] uppercase tracking-[0.14em] text-ink3 truncate">{sub}</div>
      </div>
    </div>
  );
}

export function SecurityBadges() {
  return (
    <div data-section="security-badges" className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Badge title="SSL 256-bit" sub="Encrypted" mark={<Icon.Lock className="w-3.5 h-3.5" />} />
      <Badge title="PCI Compliant" sub="Level 1" mark={<Icon.Shield className="w-3.5 h-3.5" />} />
      <Badge title="Verified Merchant" sub="Since '19" mark={<Icon.Check className="w-3.5 h-3.5" />} />
      <Badge title="Privacy Guard" sub="No resale" mark={<Icon.Eye className="w-3.5 h-3.5" />} />
    </div>
  );
}
