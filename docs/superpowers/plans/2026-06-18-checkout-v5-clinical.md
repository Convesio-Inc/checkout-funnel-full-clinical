# Checkout v5 — Clinical Re-skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the v5 storefront checkout + thank-you pages from the warm "AG1" palette to the clinical cobalt/ink/mint look of the `Checkout v5 - Clinical.html` sample, add a visual-only subscription toggle, and re-point all v5 infra/config/docs to a new worker + D1 + repo (without deploying).

**Architecture:** The checkout is already structurally identical to the sample (accordion Steps 1–4, MERIDIAN/Daily Greens, Geist fonts, `.num`/`.smallcaps`, `Step`/`Field` atoms, `BundleSelector`). The re-skin is driven primarily by swapping the active design tokens + hardcoded helper classes in `src/index.css` (clinical values, while keeping legacy warm token *names* aliased so most components need no edits), plus a small number of targeted component edits where the sample needs a specific cobalt/mint that aliasing can't express, plus the subscription pricing logic.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS v4 (`@theme inline` tokens in `src/index.css`), Vite, Cloudflare Workers + D1 (Wrangler). No test framework — verification is `npm run build`, `npm run lint`, and `npm run preview` + browser screenshots.

---

## Conventions for every task

- After code edits in a task, run `npm run build` (tsc + Vite) and `npm run lint`; both must pass before committing.
- Commit at the end of each task on branch `feat/checkout-v5-clinical`.
- Preserve all `data-*` semantic markers and `// #region` fold comments.
- This is a visual/config change only — do not touch payment/worker/cron/auth logic or the `SUCCESS_STATUSES`/`PENDING_STATUSES` constants.

## Clinical palette reference

```
paper  #ffffff   well   #f6f7f9   well2  #eef0f4
ink    #0a0b0d   ink2   #2f3338   ink3   #6a6f78   ink4 #a3a8b2
line   #e6e8ec   line2  #eef0f4
cobalt #1c4dff   cobalt2 #0c2fcb  cobalt3 #5a82ff
mint   #00a36b   alert  #c4392a   (clinical red for failure)
```

## Legacy-name → clinical-value alias map (applied in `index.css`)

| Legacy token (kept) | New clinical value | Rationale |
| --- | --- | --- |
| `paper` | `#ffffff` | white card/page |
| `paper2` | `#f6f7f9` | well grey (sample `well`) |
| `bone`, `bone2`, `sand`, `sand2` | `#ffffff` / `#f6f7f9` | neutral surfaces |
| `ink`,`ink2`,`ink3`,`ink4` | `#0a0b0d`/`#2f3338`/`#6a6f78`/`#a3a8b2` | clinical greys |
| `line`,`line2` | `#e6e8ec`/`#eef0f4` | hairlines |
| `lime`,`lime2` | `#1c4dff`/`#0c2fcb` | brand accent → cobalt |
| `lime3` | `#eaf0ff` | cobalt tint (banner/notice bg) |
| `forest`,`forest2`,`forest3`,`moss` | `#1c4dff`/`#0c2fcb`/`#5a82ff`/`#00a36b` | accent/positive |
| `sage` | `#cdd6e6` | muted accent tint |
| `amber`,`amber2`,`amber3`,`amber-soft` | `#1c4dff`/`#0c2fcb`/`#5a82ff`/`#eaf0ff` | accent |
| `rust` | `#c4392a` | clinical alert red (failure only) |
| `gold`,`gold2` | `#6a6f78`/`#2f3338` | neutralised |

New tokens added: `well`, `well2`, `cobalt`, `cobalt2`, `cobalt3`, `mint`.

---

### Task 1: Re-skin `src/index.css` (tokens + helper classes)

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace the two duplicate palette blocks with one clinical block**

In the `@theme inline` block, replace everything from the `/* === MERIDIAN PALETTE (from reference) === */` comment through the end of the `/* === AG1 WARM PALETTE (Checkout v4 reference) === */` block (the two duplicated palettes, i.e. all `--color-*` lines for bone/sand/forest/amber/lime/etc. up to but **not** including `/* === shadcn / app shell tokens === */`) with this single block:

```css
    /* === CLINICAL PALETTE (Checkout v5) ===
     * Clinical white/cobalt/ink/mint. Legacy warm token *names* (sand, bone,
     * forest, amber, lime, rust, gold, paper2) are intentionally kept and
     * aliased to clinical values so existing component classes keep working.
     */
    --color-paper: #ffffff;
    --color-paper2: #f6f7f9;
    --color-well: #f6f7f9;
    --color-well2: #eef0f4;
    --color-ink: #0a0b0d;
    --color-ink2: #2f3338;
    --color-ink3: #6a6f78;
    --color-ink4: #a3a8b2;
    --color-line: #e6e8ec;
    --color-line2: #eef0f4;
    --color-cobalt: #1c4dff;
    --color-cobalt2: #0c2fcb;
    --color-cobalt3: #5a82ff;
    --color-mint: #00a36b;

    /* legacy warm names → clinical aliases */
    --color-bone: #ffffff;
    --color-bone2: #f6f7f9;
    --color-sand: #ffffff;
    --color-sand2: #f6f7f9;
    --color-sage: #cdd6e6;
    --color-lime: #1c4dff;
    --color-lime2: #0c2fcb;
    --color-lime3: #eaf0ff;
    --color-forest: #1c4dff;
    --color-forest2: #0c2fcb;
    --color-forest3: #5a82ff;
    --color-moss: #00a36b;
    --color-amber: #1c4dff;
    --color-amber2: #0c2fcb;
    --color-amber3: #5a82ff;
    --color-amber-soft: #eaf0ff;
    --color-rust: #c4392a;
    --color-gold: #6a6f78;
    --color-gold2: #2f3338;
```

- [ ] **Step 2: Update the `:root` brand tokens to clinical**

Replace the five `--brand*` lines in `:root` with:

```css
    --brand: #0a0b0d;
    --brand-foreground: #ffffff;
    --brand-accent: #1c4dff;
    --brand-accent-foreground: #ffffff;
    --brand-muted: #eef0f4;
```

- [ ] **Step 3: Re-skin the surface helper classes**

Replace the `.gloss-card`, `.gloss-card-flat`, `.gloss-forest`, `.gloss-input`, `.ring-forest`, `.stripes`, `.rule` blocks with:

```css
.gloss-card {
    background: #ffffff;
    border: 1px solid #e6e8ec;
    box-shadow: 0 1px 0 rgba(10, 11, 13, 0.02), 0 18px 36px -24px rgba(10, 11, 13, 0.12);
}
.gloss-card-flat { background: #ffffff; border: 1px solid #e6e8ec; }
.gloss-forest { background: #1c4dff; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset; }
.gloss-input {
    background: #ffffff;
    border: 1px solid #e6e8ec;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.gloss-input:focus {
    border-color: #1c4dff;
    box-shadow: 0 0 0 4px rgba(28, 77, 255, 0.12);
    outline: none;
}
.ring-forest { background: #ffffff; border: 1px solid #1c4dff; box-shadow: 0 0 0 1px #1c4dff inset; }
.stripes { background: radial-gradient(70% 55% at 50% 38%, #ffffff 0%, rgba(255,255,255,0) 75%), #f6f7f9; }
.rule { border-top: 1px solid #eef0f4; }
```

Leave `.gloss-cta`, `.gloss-cta::before/::after`, `@keyframes sheen`, and `.gloss-pill` in place (the `.gloss-cta` amber button is not used by the v5 checkout CTA, which uses `.cta`; leaving it avoids touching unrelated surfaces).

- [ ] **Step 4: Re-skin `.smallcaps`/`.strike`/`::selection`**

Replace the AG1 helper lines:

```css
.smallcaps { text-transform: uppercase; letter-spacing: 0.14em; font-size: 10.5px; font-weight: 500; }
.strike { text-decoration: line-through; text-decoration-thickness: 1px; color: #a3a8b2; }
::selection { background: #1c4dff; color: #ffffff; }
```

- [ ] **Step 5: Re-skin `.ck-input` (clinical white inputs)**

Replace the `.ck-input`, `.ck-input::placeholder`, `.ck-input:focus`, and `select.ck-input` blocks with:

```css
.ck-input {
  font-family: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  background: #ffffff;
  border: 1px solid #e6e8ec;
  width: 100%;
  padding: 13px 14px;
  font-size: 14.5px;
  color: #0a0b0d;
  border-radius: 10px;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}
.ck-input::placeholder { color: #a3a8b2; }
.ck-input:focus {
  outline: none;
  border-color: #1c4dff;
  box-shadow: 0 0 0 4px rgba(28, 77, 255, 0.12);
  background: #fbfcff;
}
select.ck-input {
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%230a0b0d' stroke-width='1.4' stroke-linecap='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
```

- [ ] **Step 6: Re-skin segmented control + add `.gloss-mint`**

Replace the `.seg-track`, `.seg-on`, `.seg-on-lime` block with:

```css
.seg-track { background: #f6f7f9; border: 1px solid #e6e8ec; border-radius: 999px; padding: 4px; }
.seg-on {
  background: #0a0b0d; color: #ffffff; border-radius: 999px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 1px 2px rgba(0,0,0,0.15);
}
.gloss-mint {
  background:
    radial-gradient(110% 60% at 50% 0%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%),
    linear-gradient(180deg, #15c989 0%, #00a36b 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.55) inset,
    0 -2px 0 rgba(0, 80, 50, 0.4) inset,
    0 6px 14px -6px rgba(0, 163, 107, 0.4);
  color: #ffffff; border-radius: 999px;
}
```

- [ ] **Step 7: Re-skin plan cards + save chip**

Replace the `.plan`, `.plan:hover`, `.plan.on`, `.plan .ringdot`, `.plan.on .ringdot`, `.plan.on .ringdot::after` and `.save-chip` blocks with:

```css
.plan {
  background: #ffffff; border: 1px solid #e6e8ec; border-radius: 14px;
  transition: border-color .15s ease, transform .12s ease, box-shadow .15s ease;
}
.plan:hover:not(.on) { border-color: #c8ccd3; transform: translateY(-1px); }
.plan.on {
  background: #ffffff; border-color: #1c4dff;
  box-shadow: 0 0 0 4px rgba(28, 77, 255, 0.10), 0 2px 6px -2px rgba(28, 77, 255, 0.18);
}
.plan .ringdot {
  width: 18px; height: 18px; border-radius: 999px; border: 1.5px solid #d2d6de;
  display: inline-flex; align-items: center; justify-content: center;
  transition: border-color .15s ease, background .15s ease; position: relative;
}
.plan.on .ringdot {
  border-color: #1c4dff;
  background: radial-gradient(closest-side, #1c4dff 45%, rgba(28,77,255,0) 50%);
}
.plan.on .ringdot::after { content: ''; width: 8px; height: 8px; border-radius: 999px; background: #ffffff; opacity: 0; }
.save-chip {
  background: #eaf0ff; color: #1c4dff; border-radius: 999px;
  padding: 2px 8px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em;
}
```

- [ ] **Step 8: Re-skin the `.cta` (ink-black pill)**

Replace the `.cta`, `.cta:hover`, `.cta:active`, `.cta:disabled`, `.cta .arrow-slot`, `.cta:hover .arrow-slot`, `.spinner`, and `.cta[data-state="done"]` rules with:

```css
.cta {
  position: relative; background: #0a0b0d; color: #ffffff; border-radius: 999px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.08) inset,
    0 -1px 0 rgba(0,0,0,0.6) inset,
    0 1px 2px rgba(10,11,13,0.2),
    0 12px 24px -10px rgba(10,11,13,0.35);
  overflow: hidden; isolation: isolate;
  transition: transform .14s cubic-bezier(.2,.7,.2,1), background .15s ease, box-shadow .14s ease;
  -webkit-tap-highlight-color: transparent;
}
.cta:hover:not(:disabled) { background: #1a1c20; }
.cta:active:not(:disabled) {
  transform: translateY(1px) scale(.995); background: #050608;
  box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 4px 10px -4px rgba(10,11,13,0.3);
}
.cta:disabled { filter: saturate(0.55) brightness(0.99); cursor: not-allowed; opacity: 0.85; }
.cta .arrow-slot {
  width: 32px; height: 32px; border-radius: 999px; background: rgba(255,255,255,0.10);
  display: inline-flex; align-items: center; justify-content: center;
  transition: transform .25s cubic-bezier(.2,.7,.2,1), background .15s ease;
}
.cta:hover:not(:disabled) .arrow-slot { transform: translateX(3px); background: rgba(255,255,255,0.18); }
.spinner { width: 16px; height: 16px; border-radius: 999px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #ffffff; animation: spin .7s linear infinite; }
```

And change the done-state line to keep its emerald confirm with white text (it already is):

```css
.cta[data-state="done"] { background: #0a8a55; color: #ffffff; }
```

- [ ] **Step 9: Re-skin the livedot color (used by top rail)**

The `@keyframes livedot` stays. No color is set in the keyframe — the dot color comes from the component (`bg-rust`), changed in Task 6's file. No change here.

- [ ] **Step 10: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed (no TS / ESLint errors).

```bash
git add src/index.css
git commit -m "feat: re-skin checkout tokens + helpers to clinical palette"
```

---

### Task 2: Subscription pricing helper

**Files:**
- Modify: `src/components/checkout/bundles.ts`

- [ ] **Step 1: Add the subscription constant + pricing helper**

Append to `src/components/checkout/bundles.ts`:

```ts
/** Visual-only subscription discount. Applied to the displayed + charged total;
 *  no real recurring schedule is created. */
export const SUBSCRIPTION_DISCOUNT = 0.2;

export interface BundlePricing {
  /** Charged + displayed total in minor units (sub-discounted when subscribe). */
  totalMinor: number;
  /** Per-bottle price in dollars, derived from totalMinor. */
  pricePerBottle: number;
  /** Compare-at total in minor units (49/bottle list). */
  listMinor: number;
  /** listMinor - totalMinor, floored at 0. */
  savingsMinor: number;
}

export function bundlePricing(bundle: Bundle, subscribe: boolean): BundlePricing {
  const factor = subscribe ? 1 - SUBSCRIPTION_DISCOUNT : 1;
  const totalMinor = Math.round(bundle.totalAmountMinor * factor);
  const listMinor = bundle.originalAmountMinor;
  return {
    totalMinor,
    pricePerBottle: totalMinor / 100 / bundle.bottleCount,
    listMinor,
    savingsMinor: Math.max(0, listMinor - totalMinor),
  };
}
```

- [ ] **Step 2: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed.

```bash
git add src/components/checkout/bundles.ts
git commit -m "feat: add visual-only subscription pricing helper"
```

---

### Task 3: Make `BundleSelector` sub-aware + clinical cards

**Files:**
- Modify: `src/components/checkout/BundleSelector.tsx`

- [ ] **Step 1: Replace the file with the sub-aware, clinical version**

Replace the entire contents of `src/components/checkout/BundleSelector.tsx` with:

```tsx
/**
 * BundleSelector
 * -----------------------------------------------------------------------------
 * Clinical supply picker: a One-time / Subscribe (−20%) segmented toggle above
 * three plan cards. The toggle is VISUAL-ONLY — selecting "Subscribe" applies a
 * −20% discount to the displayed + charged total but creates no real recurring
 * schedule. `subscribe` state is owned by the parent (CheckoutPage).
 *
 * Markers:
 *   - root          data-section="bundle-selector"
 *   - each card     data-section="bundle-card" + data-bundle-id
 * -----------------------------------------------------------------------------
 */

import { type Bundle, BUNDLES, bundlePricing } from "./bundles";

function PlanCard({
  bundle,
  selected,
  subscribe,
  onSelect,
}: {
  bundle: Bundle;
  selected: boolean;
  subscribe: boolean;
  onSelect: () => void;
}) {
  const featured = Boolean(bundle.isMostChosen);
  const { pricePerBottle, listMinor, totalMinor } = bundlePricing(bundle, subscribe);
  const list = listMinor / 100;
  const total = totalMinor / 100;
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
          <span className="num text-[10.5px] font-semibold whitespace-nowrap text-cobalt">
            Save ${save.toFixed(0)}
          </span>
        ) : (
          <span className="text-[10.5px]">&nbsp;</span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-[13px] font-medium whitespace-nowrap text-ink2">
          {bundle.bottleCount} bottle{bundle.bottleCount > 1 ? "s" : ""}
        </div>
        <div className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
          <span className="num text-[24px] leading-none font-medium tracking-tight text-ink">
            ${pricePerBottle.toFixed(2)}
          </span>
          <span className="text-[10.5px] text-ink3">/bottle</span>
        </div>
        <div className="mt-1.5 text-[11px] num whitespace-nowrap">
          <span className="strike mr-1">${list.toFixed(2)}</span>
          <span className="text-ink2">${total.toFixed(2)}</span>
        </div>
        <div className="mt-1.5 text-[11px] whitespace-nowrap text-ink3">
          {bundle.supplyLabel}
        </div>
      </div>
    </button>
  );
}

export interface BundleSelectorProps {
  value: Bundle;
  onChange: (bundle: Bundle) => void;
  subscribe: boolean;
  onSubscribeChange: (subscribe: boolean) => void;
}

export function BundleSelector({
  value,
  onChange,
  subscribe,
  onSubscribeChange,
}: BundleSelectorProps) {
  const ordered = [...BUNDLES].sort((a, b) => a.bottleCount - b.bottleCount);

  return (
    <div data-section="bundle-selector">
      {/* One-time / Subscribe toggle — visual-only −20% */}
      <div className="mb-4">
        <div className="seg-track flex items-center w-full text-[13px] font-medium">
          <button
            type="button"
            onClick={() => onSubscribeChange(false)}
            className={"flex-1 py-2.5 transition " + (!subscribe ? "seg-on" : "text-ink3 hover:text-ink")}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => onSubscribeChange(true)}
            className={
              "flex-1 py-2.5 transition flex items-center justify-center gap-2 " +
              (subscribe ? "gloss-mint" : "text-ink3 hover:text-ink")
            }
          >
            Subscribe
            <span className={"num text-[10.5px] font-semibold " + (subscribe ? "text-white/85" : "text-mint")}>
              −20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {ordered.map((bundle) => (
          <PlanCard
            key={bundle.id}
            bundle={bundle}
            selected={value.id === bundle.id}
            subscribe={subscribe}
            onSelect={() => onChange(bundle)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build, lint, commit**

Note: `npm run build` will FAIL here because `CheckoutPage.tsx` still calls `<BundleSelector>` without the new required `subscribe`/`onSubscribeChange` props. That is expected — it is fixed in Task 4. To verify this task in isolation, run `npm run lint` (passes) and proceed; the build is verified at the end of Task 4.

```bash
git add src/components/checkout/BundleSelector.tsx
git commit -m "feat: clinical sub-aware bundle selector"
```

---

### Task 4: Wire subscription state + clinical copy in `CheckoutPage`

**Files:**
- Modify: `src/pages/CheckoutPage.tsx`

- [ ] **Step 1: Import the pricing helper**

Change the bundles import line:

```tsx
import { BUNDLES, bundlePricing, type Bundle } from "@/components/checkout/bundles";
```

- [ ] **Step 2: Add `subscribe` state + derive the sub-aware total**

After the `selectedBundle` state declaration, add:

```tsx
  const [subscribe, setSubscribe] = useState(true);
  const pricing = bundlePricing(selectedBundle, subscribe);
```

- [ ] **Step 3: Charge the sub-aware total**

In `handleSubmit`, change the `amount` and the `lineItems[0].amountIncludingTax` to use `pricing.totalMinor`:

```tsx
      amount: pricing.totalMinor,
```

and

```tsx
          amountIncludingTax: pricing.totalMinor,
```

- [ ] **Step 4: Update the displayed total + Step 1 summary label**

Replace the `totalFmt` line:

```tsx
  const totalFmt = `$${(pricing.totalMinor / 100).toFixed(2)}`;
```

Replace the Step 1 `summaryRight` content's smallcaps span so the mode label reflects the toggle:

```tsx
                  <span className="text-ink3 smallcaps mr-2">{selectedBundle.bottleCount}× · {subscribe ? "monthly" : "one-time"}</span>
```

- [ ] **Step 5: Pass props to `BundleSelector` + colour the free-shipping checks mint**

Replace the `<BundleSelector ... />` usage:

```tsx
              <BundleSelector
                value={selectedBundle}
                onChange={setSelectedBundle}
                subscribe={subscribe}
                onSubscribeChange={setSubscribe}
              />
```

In the three free-shipping line items just below it, add `text-mint` to each `Icon.Check`:

```tsx
                <span className="inline-flex items-center gap-1.5"><Icon.Check className="w-3 h-3 text-mint" /> Free shipping</span>
                <span className="inline-flex items-center gap-1.5"><Icon.Check className="w-3 h-3 text-mint" /> 90-day return</span>
                <span className="inline-flex items-center gap-1.5"><Icon.Check className="w-3 h-3 text-mint" /> Cancel anytime</span>
```

- [ ] **Step 6: Match the sample heading + cobalt help link + cobalt star**

Replace the `<h1>` text and the help link:

```tsx
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] leading-none text-ink">
            Checkout.
          </h1>
          <span className="text-[12px] text-ink3">
            Need help?{" "}
            <a className="text-cobalt hover:underline" href="#">
              care@meridian.co
            </a>
          </span>
```

In the `TRUST` array, change the Star icon class to cobalt:

```tsx
  { k: "4.86 · 12.4k", v: "Verified reviews", icon: <Icon.Star className="w-3.5 h-3.5 text-cobalt" /> },
```

- [ ] **Step 7: Pass subscribe to OrderSummaryCard**

Replace the `<OrderSummaryCard ... />` usage:

```tsx
            <OrderSummaryCard
              selectedBundle={selectedBundle}
              subscribe={subscribe}
              payDisabled={!isPaymentValid}
              payLoading={isProcessing}
            />
```

- [ ] **Step 8: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed (this also clears the Task 3 build dependency).

```bash
git add src/pages/CheckoutPage.tsx
git commit -m "feat: wire visual subscription toggle + clinical checkout copy"
```

---

### Task 5: Sub-aware clinical `OrderSummaryCard`

**Files:**
- Modify: `src/components/checkout/OrderSummaryCard.tsx`

- [ ] **Step 1: Import the pricing helper + add the `subscribe` prop**

Change the bundles import:

```tsx
import { type Bundle, bundlePricing } from "@/components/checkout/bundles";
```

Add `subscribe` to the props interface and the function signature:

```tsx
export interface OrderSummaryCardProps {
  selectedBundle: Bundle;
  subscribe: boolean;
  payDisabled?: boolean;
  payLoading?: boolean;
}

export function OrderSummaryCard({
  selectedBundle,
  subscribe,
  payDisabled = false,
  payLoading = false,
}: OrderSummaryCardProps) {
```

- [ ] **Step 2: Compute sub-aware totals**

Replace the `total`/`totalFmt`/`savings` lines:

```tsx
  const pricing = bundlePricing(selectedBundle, subscribe);
  const total = pricing.totalMinor;
  const totalFmt = dollars(total);
  const savings = pricing.savingsMinor;
```

- [ ] **Step 3: Clinical summary lines (mode label, mint FREE, cobalt discount line)**

Replace the `<dl>` block contents with:

```tsx
      <dl className="space-y-2 text-[13px]">
        <div className="flex items-baseline justify-between gap-4 text-ink2">
          <dt className="min-w-0">
            <span className="num text-ink3 mr-1">{selectedBundle.bottleCount}×</span>
            {PRODUCT_NAME}
            <span className="text-ink3 ml-1">· {subscribe ? "monthly" : "one-time"}</span>
          </dt>
          <dd className="num shrink-0 whitespace-nowrap">{totalFmt}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 text-ink2">
          <dt>Shipping</dt>
          <dd className="num text-mint font-medium shrink-0">FREE</dd>
        </div>
        {savings > 0 && (
          <div className="flex items-baseline justify-between gap-4 text-cobalt font-medium">
            <dt>{subscribe ? "Subscription discount (20%)" : "Bundle savings"}</dt>
            <dd className="num shrink-0 whitespace-nowrap">−{dollars(savings)}</dd>
          </div>
        )}
      </dl>
```

- [ ] **Step 4: Add the recurring sub-note under the total**

Replace the total block (the `<div className="mt-4 pt-4 border-t ...">`) with:

```tsx
      <div className="mt-4 pt-4 border-t border-line2 flex items-baseline justify-between gap-4">
        <div className="smallcaps text-ink3">Total today</div>
        <div className="text-right">
          <div className="num text-[28px] text-ink leading-none font-medium tracking-tight whitespace-nowrap">
            {totalFmt}<span className="text-[11px] text-ink3 ml-1.5">USD</span>
          </div>
          {subscribe && (
            <div className="text-[11px] text-ink3 mt-1">
              then {totalFmt} every 30 days · cancel anytime
            </div>
          )}
        </div>
      </div>
```

- [ ] **Step 5: Update the CTA label to the sub-aware total + sample "Rush my order" copy**

In the idle CTA label, replace the primary line:

```tsx
              <span>Rush my order — {totalFmt}</span>
```

(The "Secure 256-bit checkout" subline, busy/done states stay as-is — the `.cta` class is already clinical from Task 1.)

- [ ] **Step 6: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed.

```bash
git add src/components/checkout/OrderSummaryCard.tsx
git commit -m "feat: sub-aware clinical order summary"
```

---

### Task 6: Restyle thank-you surfaces (cobalt/mint)

**Files:**
- Modify: `src/pages/ThankYouPage.tsx`

- [ ] **Step 1: Cobalt processing spinner**

In the `isProcessing` promo banner, change the Spinner color:

```tsx
                <Spinner aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cobalt" />
```

- [ ] **Step 2: Mint success banner**

In the `succeeded` promo banner, change the banner background + dot to clinical mint/cobalt-tint:

```tsx
              <section
                data-section="promo-banner"
                data-status="succeeded"
                aria-label="Order confirmation message"
                className="flex items-start gap-3 rounded-[14px] border border-line2 bg-[#eaf0ff] px-5 py-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint text-paper">
                  <Icon.Check className="h-3 w-3" />
                </span>
```

- [ ] **Step 3: Cobalt-tint guarantee note**

Change the guarantee-note div className:

```tsx
                      className="rounded-[12px] border border-line2 bg-[#eaf0ff] p-3 text-[12.5px] font-semibold text-ink2"
```

- [ ] **Step 4: Confirm the failure card reads clinical**

No edit needed: the failure card uses `bg-rust/15 text-rust`, and `rust` now resolves to the clinical alert red `#c4392a` (Task 1). Verify visually in Task 11.

- [ ] **Step 5: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed.

```bash
git add src/pages/ThankYouPage.tsx
git commit -m "feat: restyle thank-you page to clinical palette"
```

---

### Task 7: Re-skin top rail + site chrome

**Files:**
- Modify: `src/components/site/UrgencyRail.tsx`
- Read first, then modify if they reference warm surfaces: `src/components/site/SiteHeader.tsx`, `src/components/site/SiteFooter.tsx`

- [ ] **Step 1: White top rail + cobalt livedot**

In `UrgencyRail.tsx`, change the root wrapper background and the livedot color:

```tsx
      data-section="top-rail"
      className="sticky top-0 z-40 bg-paper border-b border-line2"
```

```tsx
            <span className="livedot inline-flex w-1.5 h-1.5 rounded-full bg-cobalt" />
```

- [ ] **Step 2: Check + fix SiteHeader / SiteFooter**

Run: `grep -nE "(sand|bone|forest|moss|sage|amber|gold|lime|rust)" src/components/site/SiteHeader.tsx src/components/site/SiteFooter.tsx`

For any match, replace the warm class with its clinical equivalent per the alias map (e.g. `bg-sand`→`bg-paper`, `bg-bone`→`bg-paper`, `text-forest`→`text-cobalt`, `bg-lime*`→cobalt/mint). If there are no matches, no edit is needed (the tokens already resolve to clinical values).

- [ ] **Step 3: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed.

```bash
git add src/components/site/
git commit -m "feat: clinical top rail + site chrome"
```

---

### Task 8: Re-skin remaining checkout/thank-you components

**Files (read each, fix per alias map):**
- `src/components/checkout/PaymentInfo.tsx`
- `src/components/checkout/PaymentStatusDialog.tsx`
- `src/components/thank-you/UpsellOfferBanner.tsx`
- `src/components/thank-you/UpsellCheckoutModal.tsx`
- `src/components/thank-you/ThankYouHeader.tsx`
- `src/components/thank-you/OrderConfirmationCard.tsx`
- `src/components/thank-you/NextStepsCard.tsx`

- [ ] **Step 1: Find warm-specific markup**

Run: `grep -nE "(bg|text|border|ring|from|to|via|fill|stroke)-(sand|sand2|bone|bone2|forest|forest2|forest3|moss|sage|amber|amber2|amber3|amber-soft|gold|gold2|lime|lime2|lime3)([0-9]*)?(/[0-9]+)?" src/components/checkout/PaymentInfo.tsx src/components/checkout/PaymentStatusDialog.tsx src/components/thank-you/*.tsx`

- [ ] **Step 2: Apply the alias map to each match**

For each hit, replace per the alias map so the intent reads clinical:
- positive/confirm accents (`lime`, `lime3`, `forest`, `moss`) → `mint` for success ticks/dots, `cobalt`/`bg-[#eaf0ff]` for accent fills/tints.
- `amber*` upsell accents → `cobalt` (fill) / `bg-[#eaf0ff]` (tint).
- neutral surfaces (`sand`, `bone`) → `paper` / `paper2`.
- Genuine alert/error states → leave on `rust` (now clinical red).

Keep changes minimal and visual-only. If a file has no hits, skip it.

- [ ] **Step 3: Check the ConvesioPay iframe surround in `PaymentInfo.tsx`**

The card fields are an external ConvesioPay iframe (not themeable from here). Ensure the surrounding container uses clinical tokens (`paper`/`line`/`ink3`). Do not attempt to restyle inside the iframe. If `PaymentInfo` passes any color/style options to the SDK init, leave the SDK call untouched (logic out of scope) but note it in the PR description.

- [ ] **Step 4: Build, lint, commit**

Run: `npm run build && npm run lint`
Expected: both succeed.

```bash
git add src/components/
git commit -m "feat: clinical re-skin of payment + upsell components"
```

---

### Task 9: Re-point Wrangler + npm scripts to v5

**Files:**
- Modify: `wrangler.jsonc`
- Modify: `package.json`

- [ ] **Step 1: Rename the worker + D1 in `wrangler.jsonc`**

Change `"name": "fulfillment-checkout-v4"` to:

```jsonc
	"name": "fulfillment-checkout-v5",
```

In the `d1_databases[0]` entry, change `database_name` and replace `database_id` with a clearly-marked placeholder:

```jsonc
			"database_name": "fulfillment-checkout-v5",
			"database_id": "REPLACE_AFTER_D1_CREATE",
```

Add a comment line directly above the `d1_databases` array:

```jsonc
	// Run `wrangler d1 create fulfillment-checkout-v5` and paste the returned
	// database_id below before the first `npm run deploy`. Local `npm run preview`
	// works without it (uses a local SQLite simulation).
```

- [ ] **Step 2: Update the v4 db:migrate scripts in `package.json`**

Replace the two migrate scripts:

```json
    "db:migrate": "wrangler d1 migrations apply fulfillment-checkout-v5 --local",
    "db:migrate:remote": "wrangler d1 migrations apply fulfillment-checkout-v5 --remote",
```

- [ ] **Step 3: Build, commit**

Run: `npm run build`
Expected: succeeds. (Local build does not need the remote `database_id`.)

```bash
git add wrangler.jsonc package.json
git commit -m "chore: point wrangler + db scripts at fulfillment-checkout-v5"
```

---

### Task 10: Re-point git remote + update docs

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Git remote (no file)

- [ ] **Step 1: Re-point the `origin` remote**

Run:

```bash
git remote set-url origin git@github.com:Convesio-Inc/fulfillment-checkout-v5.git
git remote -v
```

Expected: both fetch/push lines show `fulfillment-checkout-v5.git`. (Do not push yet — the remote repo may not exist; pushing is part of the deferred deploy step.)

- [ ] **Step 2: Update `README.md`**

Update: the project/worker name and any `fulfillment-checkout-v4` references → `v5`; the D1 database name → `fulfillment-checkout-v5`; the repo URL → the v5 URL; the storefront palette description → clinical (white / cobalt `#1c4dff` / ink `#0a0b0d` / mint `#00a36b`); and add/refresh a "Deploy checklist" section:

```markdown
## Deploy checklist (v5 — not yet deployed)

1. `wrangler d1 create fulfillment-checkout-v5` → copy the `database_id`.
2. Paste it into `wrangler.jsonc` → `d1_databases[0].database_id`.
3. `npm run db:migrate:remote` to apply migrations to the new D1.
4. Push secrets (`npm run add-envs` + the auth/email/cartrover secrets).
5. `npm run deploy`.
```

- [ ] **Step 3: Update `AGENTS.md`**

Replace `fulfillment-checkout-v4` references (D1 name in the Architecture + D1 sections, db:migrate notes) with `fulfillment-checkout-v5`, and update the `src/index.css` "BRAND THEME" description + the storefront customization-layer note to describe the clinical cobalt/ink/mint palette and the visual-only subscription toggle.

- [ ] **Step 4: Commit**

```bash
git add README.md AGENTS.md
git commit -m "docs: update README + AGENTS for v5 clinical re-skin"
```

---

### Task 11: Verify locally (build + preview + screenshots)

**Files:** none (verification only)

- [ ] **Step 1: Full build + lint**

Run: `npm run build && npm run lint`
Expected: both pass with no errors.

- [ ] **Step 2: Start the preview (full worker + local D1)**

Ensure a `.dev.vars` exists (per README). Start the dev server via the preview tooling (`preview_start`) pointing at the `npm run preview` server, or run `npm run preview` and open the served URL with the preview tools.

- [ ] **Step 3: Verify the checkout page**

- Load `/`. Confirm: white page, ink-black pill CTA, cobalt-accented selected plan card, working One-time/Subscribe toggle (Subscribe default, prices drop 20%, mint Subscribe pill), mint free-shipping checks, cobalt help link + star.
- Toggle One-time ↔ Subscribe and confirm the total, per-bottle prices, the "Subscription discount (20%)" line, and the "then $X every 30 days" note update.
- `preview_screenshot` at desktop width.
- `preview_resize` to 390px and `preview_screenshot` to confirm the 3-up plan grid collapses to 1 column and the layout holds.

- [ ] **Step 4: Verify the thank-you page**

- Load a `/thank-you` URL (use a token/`paymentId` per the local flow, or the failure path). Confirm clinical palette: cobalt processing spinner, mint success dot, cobalt-tint banner/notice, clinical-red failure card.
- `preview_screenshot` at desktop + 390px.

- [ ] **Step 5: Check the console + network for errors**

Run `preview_console_logs` and `preview_logs`; confirm no new errors introduced by the re-skin.

- [ ] **Step 6: Final commit (if any screenshots/fixups)**

If Step 3–5 surfaced visual bugs, fix the source, re-run build/lint, and commit with a `fix:` message. Otherwise this task produces no commit.

---

## Self-review notes (author)

- **Spec coverage:** §1 palette → Task 1; §2 subscription → Tasks 2–5; §3 thank-you → Task 6; §4 top rail/chrome → Task 7; remaining components → Task 8; §6 infra → Task 9; git remote + §7 docs → Task 10; §8 verification → Task 11. All spec sections mapped.
- **Type consistency:** `bundlePricing(bundle, subscribe)` returns `{ totalMinor, pricePerBottle, listMinor, savingsMinor }`, used identically in Tasks 3/4/5. `BundleSelectorProps` adds `subscribe`/`onSubscribeChange`; `OrderSummaryCardProps` adds `subscribe`; both wired in Task 4.
- **Build-order caveat:** Task 3 intentionally leaves the build red until Task 4 supplies the new props — called out in Task 3 Step 2.
- **No deploy:** Task 9 leaves a placeholder `database_id`; Task 10 sets the remote but does not push; deploy steps are documented only.
</content>
