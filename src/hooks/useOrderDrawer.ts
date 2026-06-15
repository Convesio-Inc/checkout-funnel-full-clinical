import { OrderDrawerContext } from "@/context/orderDrawer";
import { useContext } from "react";

export function useOrderDrawer() {
  const ctx = useContext(OrderDrawerContext);
  if (!ctx) {
    throw new Error(
      "useOrderDrawer must be used within an OrderDrawerProvider."
    );
  }

  return ctx;
}
