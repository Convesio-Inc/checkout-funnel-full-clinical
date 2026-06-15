import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type UsersTableToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  addUserDialog: ReactNode;
};

/**
 * UsersTableToolbar
 * -----------------------------------------------------------------------------
 * Toolbar with search input and add-user action.
 * -----------------------------------------------------------------------------
 */
export function UsersTableToolbar({
  query,
  onQueryChange,
  addUserDialog,
}: UsersTableToolbarProps) {
  return (
    <div
      data-section="users-table-toolbar"
      className="flex flex-wrap items-center gap-3 border-b border-[#ECECEC] p-4"
    >
      <div
        data-slot="user-search"
        role="search"
        className="relative w-full min-w-[220px] max-w-[280px]"
      >
        <Search className="pointer-events-none absolute top-1/2 left-[13px] h-4 w-4 -translate-y-1/2 text-[#7A7A7A]" />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name or email..."
          className="h-10 rounded-[10px] border-[#ECECEC] bg-[#FAFAFA] pr-3.5 pl-10 text-sm text-[#1A1A1A] placeholder:text-[#7A7A7A] focus-visible:border-[#0D2743] focus-visible:ring-[3px] focus-visible:ring-[#0D2743]/10"
        />
      </div>
      <div className="flex-1" />
      {addUserDialog}
    </div>
  );
}
