/**
 * CheckoutPage
 * -----------------------------------------------------------------------------
 * Top-level checkout page. Composes every section into a two-column layout
 * (form on the left, order summary on the right) that collapses to a single
 * column on narrow viewports.
 *
 * This component owns:
 *   - All customer + shipping form state (lifted from the individual cards).
 *   - The live `ConvesioPayComponent` handle, captured via
 *     `PaymentInfoCard.onComponentReady`, used to call `createToken()` on
 *     submit.
 *   - The payment status machine via `useCheckoutPayment`, which drives the
 *     `PaymentStatusDialog` through "processing" → "success" / "failed".
 *
 * Native HTML5 `required` attributes on every input stop the form from
 * submitting until the browser's built-in validation passes.
 *
 * Edit section headings, payment amount, product SKU/name here.
 * All colors come from the `BRAND THEME` block in `src/index.css`.
 *
 * ⚠  Keep AMOUNT_MINOR in sync with the Total shown in OrderSummaryCard.tsx.
 *
 * Layout (top to bottom, all inside a single `max-w-6xl` content column):
 *   - CheckoutHeader  — floating card matching the section cards below
 *   - Two-column grid — form stack + order summary
 *
 * Markers:
 *   - root            data-page="checkout"
 *   - form column     data-region="form-stack"
 *   - summary column  data-region="summary"
 * -----------------------------------------------------------------------------
 */

import { useCallback, useRef, useState } from "react";

import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import {
  CustomerInfo,
  type CustomerInfoValue,
} from "@/components/checkout/CustomerInfo";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { PaymentInfo } from "@/components/checkout/PaymentInfo";
import { PaymentStatusDialog } from "@/components/checkout/PaymentStatusDialog";
import {
  ShippingInfo,
  type ShippingInfoValue,
} from "@/components/checkout/ShippingInfo";
import { useCheckoutPayment } from "@/hooks/useCheckoutPayment";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";

const PRODUCT_SKU = "1234567890";
const PRODUCT_NAME = "Vitamin Essentials Pack";

/** Charge sent to ConvesioPay in cents. Must match the Total in OrderSummaryCard.tsx. */
const AMOUNT_MINOR = 5695;
const CURRENCY = "USD";

const INITIAL_CUSTOMER: CustomerInfoValue = {
  email: "",
  phoneNumber: "",
  phoneCountryCode: "",
};

const INITIAL_SHIPPING: ShippingInfoValue = {
  fullName: "",
  houseNumberOrName: "",
  street: "",
  city: "",
  stateOrProvince: "",
  zip: "",
  country: "",
};

export function CheckoutPage() {
  const [customer, setCustomer] = useState<CustomerInfoValue>(INITIAL_CUSTOMER);
  const [shipping, setShipping] = useState<ShippingInfoValue>(INITIAL_SHIPPING);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // The live ConvesioPay component, captured once the SDK mounts. Held in a
  // ref (not state) because we only need it at submit-time — re-rendering on
  // mount would cause unnecessary work.
  const componentRef = useRef<ConvesioPayComponent | null>(null);
  const handleComponentReady = useCallback((c: ConvesioPayComponent) => {
    componentRef.current = c;
  }, []);

  const { status, error, result, pay, reset } = useCheckoutPayment();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!componentRef.current) return;
    if (status === "processing") return;

    const address = {
      houseNumberOrName: shipping.houseNumberOrName,
      street: shipping.street,
      city: shipping.city,
      stateOrProvince: shipping.stateOrProvince,
      postalCode: shipping.zip,
      country: shipping.country,
    };

    await pay(componentRef.current, {
      email: customer.email,
      name: shipping.fullName,
      amount: AMOUNT_MINOR,
      currency: CURRENCY,
      phone: {
        number: customer.phoneNumber,
        countryCode: customer.phoneCountryCode,
      },
      billingAddress: address,
      shippingAddress: address,
      lineItems: [
        {
          sku: PRODUCT_SKU,
          description: PRODUCT_NAME,
          quantity: 1,
          amountIncludingTax: AMOUNT_MINOR,
        },
      ]
    });
  };

  const isProcessing = status === "processing";

  return (
    <main
      data-page="checkout"
      className="bg-background"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:px-6">
        <CheckoutHeader />


        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            {/* #region SECTION: Form Stack */}
            <div data-region="form-stack">
              <SectionCard section="checkout-panel">
                <section data-section="customer-info">
                  <h2 className="mb-4 text-base font-medium text-[#163427] flex items-center gap-4">
                    <span className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">1</span>
                    Customer Information
                  </h2>
                  <CustomerInfo
                    value={customer}
                    onChange={setCustomer}
                  />
                </section>

                <section
                  data-section="shipping-info"
                  className="mt-2 pt-5"
                >
                  <h2 className="mb-4 text-base font-medium text-[#163427] flex items-center gap-4">
                    <span className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">2</span>
                    Shipping Information
                  </h2>
                  <ShippingInfo
                    value={shipping}
                    onChange={setShipping}
                  />
                </section>

                <section
                  data-section="payment-info"
                  className="mt-2 pt-5"
                >
                  <h2 className="mb-4 text-base font-medium text-[#163427] flex items-center gap-4">
                    <span className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">3</span>
                    Payment Information
                  </h2>
                  <PaymentInfo
                    customerEmail={customer.email || undefined}
                    onValidityChange={setIsPaymentValid}
                    onComponentReady={handleComponentReady}
                  />
                </section>

              </SectionCard>
            </div>
            {/* #endregion */}

            {/* #region SECTION: Cart Summary */}
            <div data-region="summary" className="lg:sticky lg:top-6">
              <OrderSummaryCard
                payDisabled={!isPaymentValid}
                payLoading={isProcessing}
              />
            </div>
            {/* #endregion */}
          </div>
        </form>
      </div>

      <PaymentStatusDialog
        status={status}
        error={error}
        result={result}
        onClose={reset}
      />
    </main>
  );
}
