import { OrdersPagination } from "./OrdersPagination";
import { OrdersTable } from "./OrdersTable";
import { OrdersTableToolbar } from "./OrdersTableToolbar";

/**
 * OrdersTableCard
 * -----------------------------------------------------------------------------
 * Card container wrapping the toolbar, table, and pagination controls.
 * -----------------------------------------------------------------------------
 */
export function OrdersTableCard() {
  return (
    <section
      data-section="orders-table-card"
      aria-label="Orders table"
      className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white"
    >
      <OrdersTableToolbar />
      <OrdersTable />
      <OrdersPagination />
    </section>
  );
}
