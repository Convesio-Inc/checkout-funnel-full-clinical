import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useOrderDrawer } from "@/hooks/useOrderDrawer";
import { formatCurrency, formatDate } from "@/utils/orders";
import { OrderStatusPill } from "./OrderStatusPill";
import type {
  CartRoverCreateOrderItemArgs,
  CartRoverListOrdersResult,
} from "../../../worker/services/cart-rover";

type TimelineEvent = {
  label: string;
  at: string;
};

function getDisplayName(order: CartRoverListOrdersResult) {
  const fullName = `${order.cust_first_name ?? ""} ${order.cust_last_name ?? ""}`.trim();
  return fullName || order.ship_company || "Not available";
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function parseNumber(value: string | number | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function formatAddress(lines: Array<string | null | undefined>) {
  const clean = lines
    .map((value) => (value ?? "").trim())
    .filter((value) => value.length > 0);
  return clean.length ? clean : null;
}

function getTimelineEvents(order: CartRoverListOrdersResult) {
  const events: TimelineEvent[] = [];
  events.push({ label: "Order placed", at: order.created_date_time });

  if (order.mark_in_progress_date) {
    events.push({ label: "Marked in progress", at: order.mark_in_progress_date });
  }
  if (order.delivered_to_wms_date) {
    events.push({ label: "Delivered to WMS", at: order.delivered_to_wms_date });
  }
  if (order.cancel_date) {
    events.push({ label: "Order canceled", at: order.cancel_date });
  }

  return events;
}

function formatItemAmount(
  item: CartRoverCreateOrderItemArgs,
  currencyCode: string
) {
  const extended = parseNumber(item.extended_amount);
  if (extended != null) return formatCurrency(extended, currencyCode);

  const quantity = parseNumber(item.quantity);
  const price = parseNumber(item.price);
  if (quantity != null && price != null) {
    return formatCurrency(quantity * price, currencyCode);
  }

  return "N/A";
}

/**
 * OrderDrawer
 * -----------------------------------------------------------------------------
 * Side drawer mirroring the dashboard template while only rendering fields
 * available from CartRover list-order payloads.
 * -----------------------------------------------------------------------------
 */
export function OrderDrawer() {
  const { selectedOrder, isOpen, close } = useOrderDrawer();

  if (!selectedOrder) {
    return null;
  }

  const currencyCode = selectedOrder.currency_code ?? "USD";
  const customerName = getDisplayName(selectedOrder);
  const customerInitials = getInitials(customerName);
  const customerEmail = selectedOrder.ship_e_mail || selectedOrder.cust_e_mail || "Not available";
  const orderDate = formatDate(selectedOrder.created_date_time);
  const items = selectedOrder.items ?? [];
  const subTotal = parseNumber(selectedOrder.sub_total);
  const shipping = parseNumber(selectedOrder.shipping_handling);
  const tax = parseNumber(selectedOrder.sales_tax);
  const grandTotal = parseNumber(selectedOrder.grand_total);
  const timelineEvents = getTimelineEvents(selectedOrder);

  const shippingAddress = formatAddress([
    selectedOrder.ship_address_1,
    selectedOrder.ship_address_2,
    selectedOrder.ship_address_3,
    [selectedOrder.ship_city, selectedOrder.ship_state, selectedOrder.ship_zip]
      .filter(Boolean)
      .join(", "),
    selectedOrder.ship_country,
  ]);
  const billingAddress = formatAddress([
    selectedOrder.cust_address_1,
    selectedOrder.cust_address_2,
    selectedOrder.cust_address_3,
    [selectedOrder.cust_city, selectedOrder.cust_state, selectedOrder.cust_zip]
      .filter(Boolean)
      .join(", "),
    selectedOrder.cust_country,
  ]);

  return (
    <Drawer
      direction="right"
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          close();
        }
      }}
    >
      <DrawerContent
        data-section="order-drawer"
        className="max-w-[560px] overflow-hidden p-0"
      >
        <DrawerHeader className="border-b border-[#ECECEC] px-5 py-4">
          <DrawerTitle>Order details</DrawerTitle>
        </DrawerHeader>

        <div className="max-h-[calc(100vh-96px)] space-y-6 overflow-y-auto px-5 py-5">
          <section className="space-y-2 border-b border-[#ECECEC] pb-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                {selectedOrder.cust_ref}
              </span>
              <OrderStatusPill status={selectedOrder.order_status} />
            </div>
            <p className="text-xs text-[#7A7A7A]">
              {orderDate.date} - {orderDate.time} - {items.length} item{items.length === 1 ? "" : "s"}
            </p>
          </section>

          <section className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Customer
            </p>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0D2743] text-xs font-semibold text-white">
                {customerInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{customerName}</p>
                <p className="text-xs text-[#7A7A7A]">{customerEmail}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#4A4A4A]">Shipping address</p>
                {shippingAddress ? (
                  <p className="text-xs leading-5 text-[#1A1A1A]">
                    {shippingAddress.map((line) => (
                      <span key={`ship-${line}`} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-xs text-[#9A9A9A]">Not available</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#4A4A4A]">Billing address</p>
                {billingAddress ? (
                  <p className="text-xs leading-5 text-[#1A1A1A]">
                    {billingAddress.map((line) => (
                      <span key={`bill-${line}`} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-xs text-[#9A9A9A]">Same as shipping or not available</p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-3 border-t border-[#ECECEC] pt-5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Items
            </p>

            {items.length ? (
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li
                    key={`${item.item}-${index}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {item.description || item.item}
                      </p>
                      <p className="text-xs text-[#7A7A7A]">
                        {item.item} - Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {formatItemAmount(item, currencyCode)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md border border-dashed border-[#ECECEC] px-3 py-2 text-xs text-[#7A7A7A]">
                No line items available.
              </p>
            )}

            <dl className="space-y-2 border-t border-[#ECECEC] pt-3 text-sm">
              <div className="flex items-center justify-between text-[#4A4A4A]">
                <dt>Subtotal</dt>
                <dd>{subTotal != null ? formatCurrency(subTotal, currencyCode) : "N/A"}</dd>
              </div>
              <div className="flex items-center justify-between text-[#4A4A4A]">
                <dt>Shipping</dt>
                <dd>{shipping != null ? formatCurrency(shipping, currencyCode) : "N/A"}</dd>
              </div>
              <div className="flex items-center justify-between text-[#4A4A4A]">
                <dt>Tax</dt>
                <dd>{tax != null ? formatCurrency(tax, currencyCode) : "N/A"}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#ECECEC] pt-2 font-semibold text-[#1A1A1A]">
                <dt>Total</dt>
                <dd>
                  {grandTotal != null ? formatCurrency(grandTotal, currencyCode) : "N/A"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3 border-t border-[#ECECEC] pt-5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Timeline
            </p>
            <ol className="space-y-3">
              {timelineEvents.map((event, index) => {
                const formatted = formatDate(event.at);
                const isLast = index === timelineEvents.length - 1;
                return (
                  <li key={`${event.label}-${event.at}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#0D2743]" />
                      {!isLast ? <span className="h-full w-px bg-[#ECECEC]" /> : null}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-[#1A1A1A]">{event.label}</p>
                      <p className="text-xs text-[#7A7A7A]">
                        {formatted.date} - {formatted.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
