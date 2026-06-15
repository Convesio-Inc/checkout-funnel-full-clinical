import { OrdersContext } from "@/context/orders";
import { listOrdersQueryOptions, searchOrdersQueryOptions } from "@/query-options/orders";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider.");

  const { data: listData, isLoading: listLoading } = useQuery({
    ...listOrdersQueryOptions({ status: ctx.status, page: ctx.page }),
    enabled: !ctx.query,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...searchOrdersQueryOptions({ query: ctx.query, page: ctx.page }),
    enabled: !!ctx.query,
  });

  const data = ctx.query ? searchData : listData;
  const isLoading = ctx.query ? searchLoading : listLoading;

  return { data, isLoading, ...ctx };
}
