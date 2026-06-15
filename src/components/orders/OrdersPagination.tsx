import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

function buildPageWindow(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1].filter(
    (n) => n >= 1 && n <= total
  ));
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}

/**
 * OrdersPagination
 * -----------------------------------------------------------------------------
 * Dynamic pagination strip rendered under the orders table.
 * -----------------------------------------------------------------------------
 */
export function OrdersPagination() {
  const { data, page, setPage } = useOrders();

  const totalPages = data?.pagination.totalPages ?? 1;
  const perPage = data?.pagination.perPage ?? 20;
  const totalCount = data?.pagination.totalCount ?? 0;
  const itemCount = data?.response.length ?? 0;
  const startIndex = itemCount > 0 ? (page - 1) * perPage + 1 : 0;
  const endIndex = (page - 1) * perPage + itemCount;

  const window = buildPageWindow(page, totalPages);

  return (
    <div
      data-section="orders-pagination"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECECEC] bg-[#FDFDFD] px-5 py-3.5"
    >
      <p className="text-[13px] text-[#7A7A7A]">
        Showing <strong className="font-semibold text-[#1A1A1A]">{startIndex}</strong>–
        <strong className="font-semibold text-[#1A1A1A]">{endIndex}</strong> of{" "}
        <strong className="font-semibold text-[#1A1A1A]">{totalCount}</strong>
      </p>

      <div aria-label="Pagination" className="inline-flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          aria-label="Previous page"
          className="h-[34px] w-[34px] rounded-lg border-[#ECECEC]"
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {window.map((entry, i) =>
          entry === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-[13px] text-[#7A7A7A]">…</span>
          ) : (
            <Button
              key={entry}
              variant={entry === page ? "default" : "outline"}
              size="sm"
              aria-current={entry === page ? "page" : undefined}
              className="h-[34px] min-w-[34px] rounded-lg px-2.5 text-[13px] font-semibold"
              onClick={() => setPage(entry)}
            >
              {entry}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages}
          aria-label="Next page"
          className="h-[34px] w-[34px] rounded-lg border-[#ECECEC]"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
