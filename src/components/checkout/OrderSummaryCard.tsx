/**
 * OrderSummaryCard
 * -----------------------------------------------------------------------------
 * Sidebar summarizing the order: product photo, product line, shipping, tax,
 * total, and the primary Pay Now CTA with a terms footnote.
 *
 * The Pay Now button is a plain `type="submit"` — the parent `<form>` in
 * `CheckoutPage` owns the `onSubmit` handler that runs the payment flow. The
 * button disables itself while the card widget is invalid (`payDisabled`) or
 * while a payment is in-flight (`payLoading`).
 *
 * Edit product name, prices, CTA label, and footnote directly in the JSX.
 *
 * Markers:
 *   - root              data-section="order-summary"
 *   - product block     data-slot="product-block"
 *   - product line      data-slot="product-line"
 *   - shipping line     data-slot="shipping-line"
 *   - tax line          data-slot="tax-line"
 *   - total line        data-slot="total-line"
 *   - primary cta       data-slot="cta-primary"
 *   - cta footnote      data-slot="cta-footnote"
 *   - guarantee         data-slot="guarantee-badge"
 *
 * -----------------------------------------------------------------------------
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRightIcon, LockIcon } from "lucide-react";

const SHIPPING_LINE = { id: "shipping", label: "Shipping", value: "$7.95" };
const TAX_LINE = { id: "tax", label: "Tax", value: "$0.00" };
const TOTAL_LINE = { id: "total", label: "Total", value: "$56.95" };
const SALE_PRICE = "$49.00";

export interface OrderSummaryCardProps {
  /** When true the Pay Now button is non-interactive. Defaults to false. */
  payDisabled?: boolean;
  /** When true the button shows a spinner and stays disabled. */
  payLoading?: boolean;
}

export function OrderSummaryCard({
  payDisabled = false,
  payLoading = false,
}: OrderSummaryCardProps) {
  const disabled = payDisabled || payLoading;
  const includedLabel = `Vitamin Essentials Pack`;

  const [ctaState, setCtaState] = useState<"idle" | "busy" | "done">("idle");
  const prevLoading = useRef(false);

  useEffect(() => {
    if (payLoading) {
      setCtaState("busy");
      prevLoading.current = true;
    } else if (prevLoading.current) {
      prevLoading.current = false;
      setCtaState("done");
      const t = setTimeout(() => setCtaState("idle"), 2000);
      return () => clearTimeout(t);
    }
  }, [payLoading]);

  return (
    <Card data-section="order-summary">

      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Cart Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          data-slot="included-products-list"
        >
          <div
            data-slot="included-product-item"
            className="my-[7px] flex items-center gap-4 text-sm"
          >
            <img
              data-slot="included-product-thumb"
              src="/product-summary-image.jpeg"
              alt="Vitamin Essentials Pack product photo"
              className="h-20 w-18 shrink-0 rounded-lg object-cover"
            />
            <span className="flex-1 text-foreground font-medium">{includedLabel}</span>
            <strong data-slot="included-product-price" className="text-foreground font-mono font-normal">
              {SALE_PRICE}
            </strong>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full flex flex-col gap-2">
          <PriceRow data-slot="shipping-line" line={SHIPPING_LINE} />
          <PriceRow data-slot="tax-line" line={TAX_LINE} />
          <PriceRow
            data-slot="total-line"
            line={TOTAL_LINE}
            className="mt-3 border-t border-border pt-3"
            labelClassName="font-medium"
            valueClassName="text-[22px] font-mono"
          />
          <Button
            data-slot="cta-primary"
            data-state={ctaState}
            type="submit"
            size="lg"
            disabled={disabled}
            aria-disabled={disabled}
            className="pay-cta h-18 px-8 w-full rounded-full border-0 bg-[#169b6b] text-base justify-start tracking-[0.02em] cursor-pointer disabled:cursor-not-allowed!"
          >
            <span className="cta-main flex-1 flex items-center justify-start gap-4">
              <LockIcon className="w-3 h-3 shrink-0" />
              <span className="flex flex-col items-start justify-start">
                <span>Place order - {TOTAL_LINE.value}</span>
                <span className="text-xs font-light">Secure Checkout</span>
              </span>
              <span className="cta-arrow-slot bg-white/10 shrink-0 rounded-full h-8 w-8 flex items-center justify-center ml-auto">
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </span>

            <span className="cta-overlay cta-overlay-busy">
              <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
              <span className="text-sm tracking-[0.02em]">Placing your order…</span>
            </span>

            <span className="cta-overlay cta-overlay-done">
              <svg
                viewBox="0 0 24 24"
                width="22" height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="cta-checkmark" d="M5 12.5l4 4 10-10" />
              </svg>
              <span className="text-sm tracking-[0.02em]">Order confirmed</span>
            </span>
          </Button>

          <p
            data-slot="cta-footnote"
            className="text-xs leading-relaxed text-muted-foreground text-center"
          >
            By clicking Complete Checkout, you agree to the Terms of Sale.
          </p>
        </div>

      </CardFooter>
    </Card>
  );
}
