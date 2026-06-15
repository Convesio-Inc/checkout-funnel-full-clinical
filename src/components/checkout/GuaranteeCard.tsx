/**
 * GuaranteeCard
 * -----------------------------------------------------------------------------
 * The empty-bottle promise: gold guarantee Seal beside a serif headline, body
 * copy, and two reassurance bullets. All copy lives inline.
 *
 * Marker: data-section="guarantee"
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";
import { Seal } from "@/components/checkout/Seal";

export function GuaranteeCard() {
  return (
    <div data-section="guarantee" className="gloss-card rounded-md p-5 flex gap-5 items-start">
      <Seal />
      <div className="flex-1">
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink3">
          The empty-bottle promise
        </div>
        <h3 className="serif text-[24px] mt-1 leading-[1.1] text-ink">
          30-day money-back guarantee — <em className="text-forest">even if the bottle is empty.</em>
        </h3>
        <p className="text-[13.5px] text-ink2 mt-2 leading-relaxed">
          Take it daily for the full thirty days. If you don't feel sharper, calmer, more even —
          ship the bottles back (full, half, or empty) and we'll refund every dollar. No restocking
          fee, no friction, no questions about whether you "really tried it."
        </p>
        <div className="rule mt-3 pt-3 text-[12px] text-ink3 flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <Icon.Check className="w-3.5 h-3.5 text-forest" /> Refunds processed in 3 business days
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon.Check className="w-3.5 h-3.5 text-forest" /> Keep any free gifts
          </span>
        </div>
      </div>
    </div>
  );
}
