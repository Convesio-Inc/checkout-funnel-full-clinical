import type { ReactNode } from "react";

type SettingsLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

/**
 * SettingsLayout
 * -----------------------------------------------------------------------------
 * Two-column settings layout with side navigation and content pane.
 * -----------------------------------------------------------------------------
 */
export function SettingsLayout({ sidebar, children }: SettingsLayoutProps) {
  return (
    <div
      data-section="settings-layout"
      className="grid items-start gap-5 md:grid-cols-[220px_1fr] md:gap-9"
    >
      {sidebar}
      {children}
    </div>
  );
}
