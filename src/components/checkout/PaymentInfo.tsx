/**
 * PaymentInfo
 * -----------------------------------------------------------------------------
 * Hosts the ConvesioPay checkout iframe (PCI-compliant card tokenization). The
 * SDK is initialized + mounted once via `useConvesioPayCheckout`; keys come from
 * the `/config` worker endpoint. Wrapped in the AG1 payment box with a TLS
 * assurance line.
 *
 * Markers: data-slot="cpay-mount" | "cpay-loading" | "cpay-error".
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef } from "react";

import { Icon } from "@/components/icons";
import { useConvesioPayCheckout } from "@/hooks/useConvesioPayCheckout";

export interface PaymentInfoProps {
  customerEmail?: string;
  onValidityChange?: (isValid: boolean) => void;
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
    <div>
      <div className="rounded-xl border border-line bg-paper2 p-3">
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
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-ink3">
        <span className="inline-flex items-center gap-1.5">
          <Icon.Shield className="w-3.5 h-3.5" /> Tokenized via TLS 1.3 · your card never touches our servers
        </span>
        <span className="num tracking-[0.08em]">PCI DSS · L1</span>
      </div>
    </div>
  );
}
