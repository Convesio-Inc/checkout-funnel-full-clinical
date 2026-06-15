import { OrderCustomerCell } from "./OrderCustomerCell";
import { OrderStatusPill } from "./OrderStatusPill";
import { useOrderDrawer } from "@/hooks/useOrderDrawer";
import { formatCurrency } from "@/utils/orders";
import { formatDate } from "@/utils/orders";
import type { CartRoverListOrdersResult } from "../../../worker/services/cart-rover";

type OrderRowProps = {
  order: CartRoverListOrdersResult;
};

/**
 * OrderRow
 * -----------------------------------------------------------------------------
 * Presentational table row for one hardcoded order record.
 * -----------------------------------------------------------------------------
 */
export function OrderRow({ order }: OrderRowProps) {
  const { openOrder } = useOrderDrawer();

  const date = formatDate(order.created_date_time);

  return (
    <tr
      onClick={() => openOrder(order)}
      className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
    >
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle">
        <span className="font-mono text-[13px] font-medium text-[#1A1A1A]">{order.cust_ref}</span>
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle">
        <OrderCustomerCell
          customerName={order.cust_first_name + ' ' + order.cust_last_name}
          customerEmail={order.ship_e_mail ?? ''}
          avatarInitials={(order.cust_first_name ?? '').charAt(0).toUpperCase() + (order.cust_last_name ?? '').charAt(0).toUpperCase()}
        />
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle">
        <div className="text-[13px] text-[#4A4A4A] tabular-nums">{date.date}</div>
        <div className="text-xs text-[#7A7A7A] tabular-nums">{date.time}</div>
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle">
        <OrderStatusPill status={order.order_status} />
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle text-[#1A1A1A]">
        {order.items?.length || 0}
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 text-right align-middle">
        <span className="text-sm font-semibold tabular-nums text-[#1A1A1A]">{formatCurrency(order.grand_total ?? 0, order.currency_code ?? 'USD')}</span>
      </td>
    </tr>
  );
}
