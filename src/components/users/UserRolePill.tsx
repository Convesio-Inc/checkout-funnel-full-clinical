import { cn } from "@/lib/utils";
import type { UserRole } from "./userData";
import { ROLE_LABELS } from "./userData";

type UserRolePillProps = {
  role: UserRole;
};

const role_classname: Record<UserRole, string> = {
  owner: "border-[#F9CFCB] bg-[#FEEAE8] text-[#B0352E]",
  admin: "border-[#C5DEF4] bg-[#E6F1FC] text-[#18568F]",
  member: "border-[#ECECEC] bg-[#FAFAFA] text-[#4A4A4A]",
};

/**
 * UserRolePill
 * -----------------------------------------------------------------------------
 * Role badge used for non-editable owner roles.
 * -----------------------------------------------------------------------------
 */
export function UserRolePill({ role }: UserRolePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        role_classname[role],
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
