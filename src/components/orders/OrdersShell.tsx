import type { PropsWithChildren } from "react";

/**
 * OrdersShell
 * -----------------------------------------------------------------------------
 * Full-viewport shell for the orders dashboard page.
 * -----------------------------------------------------------------------------
 */
export function OrdersShell({ children }: PropsWithChildren) {
  return <div className="flex min-h-dvh flex-col bg-background">{children}</div>;
}
