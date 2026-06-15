// Raw line items can arrive in either of two shapes: the cpay request shape
// (`amountIncludingTax`, in minor units) or the previously-aggregated shape
// stored in `orders.items` (`amountMinor`). Either is acceptable.
export type AnyLineItem = {
  sku?: unknown;
  description?: unknown;
  quantity?: unknown;
  amountIncludingTax?: unknown;
  amountMinor?: unknown;
};

export type AggregatedLineItem = {
  sku: string;
  description: string;
  quantity: number;
  amountMinor: number;
};

function readAmountMinor(item: AnyLineItem): number {
  if (item.amountMinor != null) return Number(item.amountMinor);
  if (item.amountIncludingTax != null) return Number(item.amountIncludingTax);
  return 0;
}

export function aggregateLineItems(
  lineItems: ReadonlyArray<AnyLineItem | undefined> | undefined,
): AggregatedLineItem[] {
  return Array.from(
    (lineItems ?? []).reduce(
      (acc, item) => {
        if (!item) return acc;
        const sku = String(item.sku ?? item.description ?? 'unknown');
        const quantity = Number(item.quantity ?? 1);
        const amountMinor = readAmountMinor(item);
        const existing = acc.get(sku);

        if (existing) {
          existing.quantity += quantity;
          existing.amountMinor += amountMinor;
          return acc;
        }

        acc.set(sku, {
          sku,
          description: String(item.description ?? ''),
          quantity,
          amountMinor,
        });
        return acc;
      },
      new Map<string, AggregatedLineItem>(),
    ).values(),
  );
}
