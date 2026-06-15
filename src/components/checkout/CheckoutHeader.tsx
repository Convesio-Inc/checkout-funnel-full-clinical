/**
 * CheckoutHeader
 */
import { LockIcon } from "lucide-react";

export function CheckoutHeader() {

  return (
    <div
      data-section="checkout-header"
      data-slot="top-bar"
      className="mb-4 flex flex-wrap items-center justify-between gap-2"
    >
      <div>
        <p className="text-xl md:text-2xl lg:text-4xl font-medium">Almost yours.</p>
      </div>

      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <LockIcon className="w-3 h-3" />
        Secure Checkout
      </span>
    </div>
  );
}
