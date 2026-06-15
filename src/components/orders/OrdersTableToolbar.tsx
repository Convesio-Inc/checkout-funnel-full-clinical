import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { OrdersFilterChips } from "./OrdersFilterChips";
import { useOrders } from "@/hooks/useOrders";
import { useEffect, useState } from "react";

/**
 * OrdersTableToolbar
 * -----------------------------------------------------------------------------
 * Toolbar with search, status filters, and count summary.
 * -----------------------------------------------------------------------------
 */
export function OrdersTableToolbar() {
  const { data, setQuery, setStatus, setPage } = useOrders();
  const [inputValue, setInputValue] = useState("");
  const totalOrders = data?.response.length ?? 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("any");
      setPage(1);
      setQuery(inputValue.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div
      data-section="orders-table-toolbar"
      className="flex flex-wrap items-center gap-3 border-b border-[#ECECEC] p-4"
    >
      <div role="search" className="relative w-full min-w-[220px] max-w-[360px] flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-[13px] h-4 w-4 -translate-y-1/2 text-[#7A7A7A]" />
        <Input
          data-slot="order-search"
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search order, customer, email..."
          className="h-10 rounded-[10px] border-[#ECECEC] bg-[#FAFAFA] pr-3.5 pl-10 text-sm text-[#1A1A1A] placeholder:text-[#7A7A7A] focus-visible:border-[#0D2743] focus-visible:ring-[3px] focus-visible:ring-[#0D2743]/10"
        />
      </div>

      <OrdersFilterChips />

      <div className="ml-auto text-[13px] text-[#7A7A7A] max-md:hidden">
        Showing <strong className="font-semibold text-[#1A1A1A]">{totalOrders}</strong> of{" "}
        <strong className="font-semibold text-[#1A1A1A]">{data?.pagination.totalCount}</strong> orders
      </div>
    </div>
  );
}
