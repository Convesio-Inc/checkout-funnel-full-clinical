/**
 * PaymentInfo
 * -----------------------------------------------------------------------------
 * Hosts the ConvesioPay checkout component (a PCI-compliant iframe widget that
 * tokenizes card data on ConvesioPay's side). The SDK is initialized + mounted
 * exactly once via the `useConvesioPayCheckout` hook; the public-safe API key
 * and client key are fetched once from the `/config` worker endpoint.
 *
 * The iframe sits inside the Meridian payment box (TLS assurance + accepted-
 * card pills). Edit loading/error messages directly in this file.
 *
 * Markers:
 *   - mount container             data-slot="cpay-mount"
 *   - loading placeholder         data-slot="cpay-loading"
 *   - error message               data-slot="cpay-error"
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef } from "react";

import { Icon } from "@/components/icons";
import { useConvesioPayCheckout } from "@/hooks/useConvesioPayCheckout";

const CARD_BRANDS = ["VISA", "MC", "AMEX", "DISC"];

export interface PaymentInfoProps {
  customerEmail?: string;
  /** Fires whenever the ConvesioPay component reports a validity change. */
  onValidityChange?: (isValid: boolean) => void;
  /** Fires once the ConvesioPay SDK component has mounted. Gives the parent a
   *  handle to call `component.createToken()` at submit time. */
  onComponentReady?: (component: ConvesioPayComponent) => void;
}

export function PaymentInfo({
  customerEmail,
  onValidityChange,
  onComponentReady,
}: PaymentInfoProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { status, error, isValid, component } = useConvesioPayCheckout(mountRef, {
    customerEmail,
    theme: "light",
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    if (component) onComponentReady?.(component);
  }, [component, onComponentReady]);

  return (
    <div className="rounded-md p-4 bg-bone2/40 border border-line">
      <div
        ref={mountRef}
        data-slot="cpay-mount"
        id="cpay-checkout-component"
        className="min-h-[220px]"
      />

      {status === "loading" && (
        <p data-slot="cpay-loading" className="text-[13px] text-ink3" aria-live="polite">
          Loading secure payment form…
        </p>
      )}

      {status === "error" && (
        <p data-slot="cpay-error" role="alert" className="text-[13px] text-rust">
          {error?.message ?? "Could not load the payment form."}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-[11px] text-ink3">
        <div className="inline-flex items-center gap-1.5">
          <Icon.Lock className="w-3.5 h-3.5" /> Tokenized via TLS 1.3
        </div>
        <div className="flex items-center gap-1.5">
          {CARD_BRANDS.map((brand) => (
            <span
              key={brand}
              className="num text-[10px] tracking-[0.08em] font-semibold text-ink2 bg-white border border-line px-1.5 py-0.5 rounded-[3px]"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
