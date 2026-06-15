/**
 * UpsellCheckoutModal
 * -----------------------------------------------------------------------------
 * One-click upsell dialog. Queues an add-on against the stored payment method;
 * ConvesioPay card-on-file runs later on the CartRover sync cron so the charge
 * is spaced from checkout (issuer velocity).
 *
 * Inputs:
 *   - upsell        : product/copy (UpsellProductConfig from UpsellOfferBanner)
 *   - context       : customer + order context from `/verify-token`
 *
 * Markers:
 *   - dialog root         data-slot="upsell-modal"
 *   - product summary     data-slot="upsell-product-summary"
 *   - checkout button     data-slot="upsell-checkout-cta"
 * -----------------------------------------------------------------------------
 */

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import type { UpsellProductConfig } from "@/components/thank-you/UpsellOfferBanner";
import type { OrderContext } from "@/hooks/useThankYouPayment";

export interface UpsellCheckoutModalProps {
    upsell: UpsellProductConfig;
    context: OrderContext | null;
    open: boolean;
    onClose: () => void;
    /** After a deferred upsell is queued, re-hit `/verify-token` so the receipt includes scheduled lines. */
    onReceiptRefresh?: () => void | Promise<void>;
}

type UpsellStatus = "idle" | "processing" | "queued" | "failed";

const ctaClassName =
    "order-cta gloss-cta h-12 w-full rounded-md text-base font-bold tracking-[0.04em] text-white uppercase cursor-pointer";

export function UpsellCheckoutModal({
    upsell,
    context,
    open,
    onClose,
    onReceiptRefresh,
}: UpsellCheckoutModalProps) {
    const [status, setStatus] = useState<UpsellStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [queuedMessage, setQueuedMessage] = useState<string | null>(null);

    const isProcessing = status === "processing";
    const isQueued = status === "queued";
    const canSubmit = !isProcessing && !isQueued && !!context?.order_id;

    const handlePay = async () => {
        if (!canSubmit || !context?.order_id) return;

        setStatus("processing");
        setError(null);

        let response: Response;
        try {
            response = await fetch("/upsell-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: context.order_id,
                    amount: upsell.amountMinor,
                    currency: upsell.currency,
                    lineItems: [
                        {
                            sku: upsell.sku,
                            description: upsell.name,
                            quantity: 1,
                            amountIncludingTax: upsell.amountMinor,
                        },
                    ],
                }),
            });
        } catch {
            setStatus("failed");
            setError("Network error. Please try again.");
            return;
        }

        let body: {
            deferred?: boolean;
            alreadyQueued?: boolean;
            redirectUrl?: string;
            error?: boolean;
            message?: string;
            status?: string;
        } | null = null;
        try {
            body = await response.json();
        } catch {
            body = null;
        }

        if (!response.ok || body?.error) {
            setStatus("failed");
            setError(body?.message ?? "Payment failed. Please contact support.");
            return;
        }

        if (body?.deferred) {
            if (onReceiptRefresh) {
                try {
                    await onReceiptRefresh();
                } catch {
                    // Non-fatal: receipt may refresh on next navigation
                }
            }
            setQueuedMessage(
                body.message ??
                    "Your add-on is saved. We will charge your saved card when your order is finalized.",
            );
            setStatus("queued");
            return;
        }

        if (body?.redirectUrl) {
            window.location.assign(body.redirectUrl);
            return;
        }

        window.location.reload();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (v) {
                    setStatus("idle");
                    setError(null);
                    setQueuedMessage(null);
                } else if (!isProcessing) {
                    onClose();
                }
            }}
        >
            <DialogContent
                data-slot="upsell-modal"
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        Add to Your Order
                    </DialogTitle>
                    <DialogDescription>
                        {isQueued
                            ? "You're all set."
                            : "Confirm below to add this item to your order. Your saved card will be charged when your order is finalized."}
                    </DialogDescription>
                </DialogHeader>

                {/* Product summary */}
                <div
                    data-slot="upsell-product-summary"
                    className="flex items-center gap-3 rounded-md border border-line bg-bone2/40 p-3"
                >
                    <img
                        src={upsell.image.src}
                        alt={upsell.image.alt}
                        className="h-14 w-14 shrink-0 rounded-md border border-line object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink">
                            {upsell.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="num text-sm font-bold text-ink">
                                {upsell.salePrice}
                            </span>
                            <span className="num text-sm text-ink3 line-through">
                                {upsell.regularPrice}
                            </span>
                            <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-bold text-white">
                                {upsell.discountLabel}
                            </span>
                        </div>
                    </div>
                </div>

                {status === "failed" && error && (
                    <p
                        data-slot="upsell-error"
                        role="alert"
                        className="text-sm text-rust"
                    >
                        {error}
                    </p>
                )}

                {isQueued && queuedMessage && (
                    <p
                        data-slot="upsell-queued-notice"
                        className="text-sm text-ink3"
                    >
                        {queuedMessage}
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {isQueued ? (
                        <Button
                            type="button"
                            size="lg"
                            data-slot="upsell-checkout-cta"
                            className={ctaClassName}
                            onClick={onClose}
                        >
                            Done
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="lg"
                            data-slot="upsell-checkout-cta"
                            className={ctaClassName}
                            disabled={!canSubmit}
                            onClick={handlePay}
                        >
                            {isProcessing ? "Saving…" : "Add to my order"}
                        </Button>
                    )}

                    {!isQueued && (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-ink3">
                            <Icon.Lock className="h-3 w-3" aria-hidden="true" />
                            Secure checkout
                        </div>
                    )}

                    {!isQueued && (
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="h-auto px-0 text-xs text-ink3"
                        >
                            No thanks, I'll skip this offer
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
