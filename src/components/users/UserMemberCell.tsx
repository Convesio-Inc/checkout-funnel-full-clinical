import type { User } from "./userData";
import { initials } from "./userData";

type UserMemberCellProps = {
  user: User;
};

/**
 * UserMemberCell
 * -----------------------------------------------------------------------------
 * User identity cell with avatar, name, badge, and email.
 * -----------------------------------------------------------------------------
 */
export function UserMemberCell({ user }: UserMemberCellProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold tracking-[0.02em] text-white"
        style={{ backgroundColor: user.color }}
      >
        {initials(user.name)}
      </span>

      <span className="block">
        <span className="block text-sm leading-[1.3] font-semibold text-[#1A1A1A]">
          {user.name}
          {user.is_you && (
            <span className="ml-1.5 inline-flex items-center rounded-full border border-[#ECECEC] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-semibold text-[#4A4A4A] uppercase">
              You
            </span>
          )}
        </span>
        <span className="block text-xs leading-[1.3] text-[#7A7A7A]">
          {user.email}
        </span>
      </span>
    </div>
  );
}
