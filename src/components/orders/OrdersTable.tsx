import { OrderRow } from "./OrderRow";
import { useOrders } from "@/hooks/useOrders";
import { Spinner } from "../ui/spinner";

/**
 * OrdersTable
 * -----------------------------------------------------------------------------
 * Static table matching the dashboard markup and visual structure.
 * -----------------------------------------------------------------------------
 */
export function OrdersTable() {
  const { data, isLoading } = useOrders();

  return (
    <div className="w-full overflow-x-auto">
      <table data-section="orders-table" aria-label="Orders" className="w-full min-w-[920px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Order
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Customer
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Date
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Status
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Items
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-right text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && data?.response.map((order) => (
            <OrderRow key={order.cust_ref} order={order} />
          ))}
          {isLoading && (
            <tr>
              <td colSpan={10} className="text-center py-20">
                <Spinner className="w-4 h-4 animate-spin mx-auto" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
