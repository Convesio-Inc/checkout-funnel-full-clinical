/**
 * ProductHeroCard
 * -----------------------------------------------------------------------------
 * Top of the checkout's left column. SVG bottle on an ivory wash, serif product
 * title, short description, and a row of trust pills. All copy lives inline.
 *
 * Marker: data-section="product-hero"
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";
import { Bottle } from "@/components/checkout/Bottle";

const TRUST_BADGES = ["NSF Certified", "Non-GMO", "Vegan", "Made in Oregon"];

export function ProductHeroCard() {
  return (
    <div data-section="product-hero" className="gloss-card rounded-md overflow-hidden">
      <div className="grid grid-cols-[170px_1fr]">
        <div className="relative flex items-center justify-center py-5 stripes border-r border-line">
          <div style={{ filter: "drop-shadow(0 12px 14px rgba(15,40,30,0.2))" }}>
            <Bottle />
          </div>
        </div>
        <div className="p-5">
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink3">
            Step 1 of 1 · Build your order
          </div>
          <h1 className="serif text-[40px] leading-[0.95] mt-2 tracking-tight text-ink">
            Daily Greens <em className="text-forest">Complex</em>
          </h1>
          <p className="text-[13.5px] text-ink2 mt-3 leading-relaxed max-w-[44ch]">
            32 organic plants, adaptogens, and digestive enzymes. One scoop replaces the
            morning supplement stack.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-ink3">
            {TRUST_BADGES.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5">
                <Icon.Check className="w-3.5 h-3.5 text-forest" /> {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
