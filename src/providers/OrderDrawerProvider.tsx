import {
  OrderDrawerContext,
  type OrderDrawerContextValue,
} from "@/context/orderDrawer";
import type { CartRoverListOrdersResult } from "../../worker/services/cart-rover";
import { type ReactNode, useCallback, useMemo, useState } from "react";

export function OrderDrawerProvider({ children }: { children: ReactNode }) {
  const [selectedOrder, setSelectedOrder] =
    useState<CartRoverListOrdersResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openOrder = useCallback((order: CartRoverListOrdersResult) => {
    setSelectedOrder(order);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo<OrderDrawerContextValue>(
    () => ({ selectedOrder, isOpen, openOrder, close }),
    [selectedOrder, isOpen, openOrder, close]
  );

  return (
    <OrderDrawerContext.Provider value={value}>
      {children}
    </OrderDrawerContext.Provider>
  );
}
