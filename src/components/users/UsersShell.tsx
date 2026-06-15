import type { PropsWithChildren } from "react";

/**
 * UsersShell
 * -----------------------------------------------------------------------------
 * Full-viewport shell for the settings users page.
 * -----------------------------------------------------------------------------
 */
export function UsersShell({ children }: PropsWithChildren) {
  return <div className="flex min-h-dvh flex-col bg-background">{children}</div>;
}
