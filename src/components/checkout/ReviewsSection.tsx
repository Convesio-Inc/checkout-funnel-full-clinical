/**
 * ReviewsSection
 * -----------------------------------------------------------------------------
 * Aggregate rating header (4.86 · star row · verified count) above three
 * testimonial columns. All review copy lives inline.
 *
 * Marker: data-section="reviews"
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";

const TESTIMONIALS = [
  {
    name: "Priya R.",
    loc: "Austin, TX",
    text: "I felt sharper by the second week — and I never remember to take vitamins. The subscription cadence is exactly right.",
  },
  {
    name: "Daniel K.",
    loc: "Brooklyn, NY",
    text: "Tried three other greens powders before this. This is the first one that doesn't taste like pond water.",
  },
  {
    name: "Lena S.",
    loc: "Denver, CO",
    text: "Customer service refunded me without making it weird when I asked. Then I re-ordered a month later.",
  },
];

export function ReviewsSection() {
  return (
    <div data-section="reviews" className="gloss-card rounded-md overflow-hidden">
      <div className="px-5 py-3 border-b border-line2 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center" style={{ filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.8))" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Icon.Star
                key={i}
                className="w-3.5 h-3.5"
                style={{ color: "#e07b1f", filter: "drop-shadow(0 1px 0 rgba(124,46,8,0.35))" }}
              />
            ))}
          </div>
          <span className="num text-[13px] font-semibold text-ink">4.86</span>
          <span className="text-[12px] text-ink3">· 12,408 verified reviews</span>
        </div>
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink3">Verified by Stamped</span>
      </div>
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line2">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="p-5">
            <div className="flex items-center mb-2">
              {[0, 1, 2, 3, 4].map((j) => (
                <Icon.Star key={j} className="w-3 h-3" style={{ color: "#e07b1f" }} />
              ))}
            </div>
            <p className="text-[13.5px] text-ink2 leading-relaxed">“{t.text}”</p>
            <div className="mt-3 text-[11.5px] text-ink3 flex items-center justify-between">
              <span>
                <span className="font-medium text-ink">{t.name}</span> · {t.loc}
              </span>
              <span className="inline-flex items-center gap-1 text-forest">
                <Icon.Check className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
