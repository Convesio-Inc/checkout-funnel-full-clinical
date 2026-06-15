import { Users } from "lucide-react";
import { Link } from "react-router";

/**
 * SettingsSidebar
 * -----------------------------------------------------------------------------
 * Settings side navigation with the active user management item.
 * -----------------------------------------------------------------------------
 */
export function SettingsSidebar() {
  return (
    <aside
      data-section="settings-sidebar"
      aria-label="Settings sections"
      className="flex flex-col gap-1 p-1 md:sticky md:top-20"
    >
      <Link
        to="/settings/users"
        className="inline-flex items-center gap-2.5 rounded-lg bg-[#FAFAFA] px-3 py-2.5 text-[13.5px] font-semibold text-[#1A1A1A]"
      >
        <Users className="h-4 w-4 text-[#FF6A5B]" />
        <span>User management</span>
      </Link>
    </aside>
  );
}
