/**
 * OrdersPageHeading
 * -----------------------------------------------------------------------------
 * Static heading block for the orders dashboard content area.
 * -----------------------------------------------------------------------------
 */
export function OrdersPageHeading() {
  return (
    <section data-section="orders-heading" className="mb-7 flex items-end justify-between gap-5">
      <div>
        <div className="mb-2.5 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#FF6A5B] uppercase">
          <span aria-hidden="true" className="h-0.5 w-[22px] bg-[#FF6A5B]" />
          <span>Commerce</span>
        </div>
        <h1 className="text-[clamp(32px,3.5vw,44px)] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#1A1A1A]">
          Orders
        </h1>
        <p className="mt-2.5 max-w-[520px] text-[15px] leading-[1.55] text-[#4A4A4A]">
          Every transaction across your managed storefronts. Filter, search, and drill in.
        </p>
      </div>
    </section>
  );
}
