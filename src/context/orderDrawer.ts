import { createContext } from "react";
import type { CartRoverListOrdersResult } from "../../worker/services/cart-rover";

export interface OrderDrawerContextValue {
  selectedOrder: CartRoverListOrdersResult | null;
  isOpen: boolean;
  openOrder: (order: CartRoverListOrdersResult) => void;
  close: () => void;
}

export const OrderDrawerContext = createContext<OrderDrawerContextValue | null>(
  null
);
