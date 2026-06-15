import { createContext } from "react";
import type { OrderStatus } from "@/components/orders/orderStatus";

export interface OrdersContextValue {
  status: OrderStatus;
  setStatus: (status: OrderStatus) => void;
  page: number;
  setPage: (page: number) => void;
  query: string;
  setQuery: (query: string) => void;
}

export const OrdersContext = createContext<OrdersContextValue | null>(null);
