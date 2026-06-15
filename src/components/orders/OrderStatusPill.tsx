import { cn } from "@/lib/utils";
import { ORDER_STATUS_META, type OrderStatus } from "./orderStatus";

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];

  return (
    <span
      data-slot="order-status"
      className={cn(
        "inline-flex items-center gap-[7px] rounded-full border px-[9px] py-1 text-xs leading-none font-semibold whitespace-nowrap",
        meta.pill,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
