/**
 * LoginShell
 * -----------------------------------------------------------------------------
 * Full-viewport layout wrapper for the login page, including the decorative
 * radial background washes from the reference design.
 * -----------------------------------------------------------------------------
 */

import type { PropsWithChildren } from "react";

export function LoginShell({ children }: PropsWithChildren) {
  return (
    <div className="relative grid min-h-dvh grid-rows-[auto_1fr_auto] overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[280px] -right-[220px] z-0 h-[640px] w-[640px] bg-[radial-gradient(closest-side,rgba(255,106,91,0.09),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[300px] -left-[240px] z-0 h-[560px] w-[560px] bg-[radial-gradient(closest-side,rgba(112,240,161,0.08),transparent_70%)]"
      />

      <div className="relative z-10 contents">{children}</div>
    </div>
  );
}
