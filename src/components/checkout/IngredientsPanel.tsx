/**
 * IngredientsPanel
 * -----------------------------------------------------------------------------
 * Forest panel listing the headline ingredients in a leaf-prefixed grid. All
 * content lives inline.
 *
 * Marker: data-section="ingredients"
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";

const INGREDIENTS = [
  "Spirulina",
  "Chlorella",
  "Ashwagandha KSM-66",
  "Reishi",
  "Beetroot",
  "Spinach",
  "Kale",
  "Matcha",
  "Turmeric",
  "Ginger",
  "L-Theanine",
  "Probiotic Blend",
];

export function IngredientsPanel() {
  return (
    <div data-section="ingredients" className="gloss-forest text-bone rounded-md p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-[10.5px] uppercase tracking-[0.2em] text-bone/60">What's inside</div>
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-bone/60">32 ingredients</div>
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-[13px]">
        {INGREDIENTS.map((name) => (
          <div key={name} className="flex items-center gap-2 text-bone/90">
            <Icon.Leaf className="w-3.5 h-3.5 text-sage" />
            <span>{name}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11.5px] text-bone/55">+ 20 more in the full formula.</div>
    </div>
  );
}
