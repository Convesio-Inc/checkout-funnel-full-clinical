import {
  OrdersPageHeading,
  OrdersShell,
  OrdersTableCard,
} from "@/components/orders";
import { OrderDrawer } from "@/components/orders/OrderDrawer";
import { OrderDrawerProvider } from "@/providers/OrderDrawerProvider";
import { OrdersProvider } from "@/providers/OrdersProvider";

export function OrderPage() {
  return (
    <OrdersProvider>
      <OrderDrawerProvider>
        <OrdersShell>
          <main
            data-page="orders"
            className="mx-auto w-full max-w-[1280px] px-5 pt-10 pb-20 sm:px-8"
          >
            <OrdersPageHeading />
            <OrdersTableCard />
          </main>
        </OrdersShell>
        <OrderDrawer />
      </OrderDrawerProvider>
    </OrdersProvider>
  );
}