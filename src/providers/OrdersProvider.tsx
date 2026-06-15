import { OrdersContext, type OrdersContextValue } from "@/context/orders";
import type { OrderStatus } from "@/components/orders/orderStatus";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { page: pageParam } = useParams<{ page?: string }>();
  const navigate = useNavigate();

  const page = Number(pageParam) || 1;
  const [status, setStatusState] = useState<OrderStatus>("any");
  const [query, setQueryState] = useState("");

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage <= 1) {
        navigate("/orders");
      } else {
        navigate(`/orders/page/${newPage}`);
      }
    },
    [navigate]
  );

  const setStatus = useCallback(
    (newStatus: OrderStatus) => {
      setStatusState(newStatus);
      setQueryState("");
      navigate("/orders");
    },
    [navigate]
  );

  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);
      if (newQuery) {
        setStatusState("any");
        navigate("/orders");
      }
    },
    [navigate]
  );

  const value = useMemo<OrdersContextValue>(
    () => ({ status, setStatus, page, setPage, query, setQuery }),
    [status, setStatus, page, setPage, query, setQuery]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}
