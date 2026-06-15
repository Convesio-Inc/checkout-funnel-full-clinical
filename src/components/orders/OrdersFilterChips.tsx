import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_META, type OrderStatus } from "./orderStatus";
import { useOrders } from "@/hooks/useOrders";

const CHIP_ORDER: OrderStatus[] = [
  "any",
  "new",
  "at_wms",
  "new_or_at_wms",
  "partial",
  "shipped",
  "confirmed",
  "shipped_or_confirmed",
  "error",
  "canceled",
];

/**
 * OrdersFilterChips
 * -----------------------------------------------------------------------------
 * Status select shown in the orders toolbar — connected to shared orders context.
 * -----------------------------------------------------------------------------
 */
export function OrdersFilterChips() {
  const { status, setStatus } = useOrders();

  return (
    <div
      data-section="orders-filter-chips"
      aria-label="Filter by status"
      className="min-w-[220px]"
    >
      <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
        <SelectTrigger
          data-slot="orders-status-filter"
          aria-label="Filter orders by status"
          className="h-10 w-full rounded-[10px] border-[#ECECEC] bg-[#FAFAFA] px-3.5 text-[13px] font-medium text-[#1A1A1A]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CHIP_ORDER.map((s) => {
            const label = s === "any" ? "All" : ORDER_STATUS_META[s].label;
            return (
              <SelectItem key={s} value={s}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
