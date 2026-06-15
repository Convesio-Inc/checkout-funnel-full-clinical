import { Button } from "@/components/ui/button";
import type { User, UserRole } from "./userData";
import { UserMemberCell } from "./UserMemberCell";
import { UserRolePill } from "./UserRolePill";
import { UserRoleSelect } from "./UserRoleSelect";

type UserRowProps = {
  user: User;
  onRoleChange: (user_id: string, role: Exclude<UserRole, "owner">) => void;
  onRemove: (user_id: string) => void;
  roleEditingDisabled?: boolean;
  removeDisabled?: boolean;
};

/**
 * UserRow
 * -----------------------------------------------------------------------------
 * Presentational table row for one workspace member.
 * -----------------------------------------------------------------------------
 */
export function UserRow({
  user,
  onRoleChange,
  onRemove,
  roleEditingDisabled = false,
  removeDisabled = false,
}: UserRowProps) {
  const is_owner = user.role === "owner";

  return (
    <tr className="transition-colors hover:bg-[#FAFAFA]">
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle">
        <UserMemberCell user={user} />
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 align-middle">
        {is_owner ? (
          <UserRolePill role="owner" />
        ) : roleEditingDisabled ? (
          <UserRolePill role={user.role === "admin" ? "admin" : "member"} />
        ) : (
          <UserRoleSelect
            value={user.role === "admin" ? "admin" : "member"}
            onValueChange={(role) => onRoleChange(user.id, role)}
          />
        )}
      </td>
      <td className="border-b border-[#ECECEC] px-5 py-4 text-right align-middle">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(user.id)}
          disabled={is_owner || removeDisabled}
          title={
            removeDisabled
              ? "Team changes are not available yet"
              : is_owner
                ? "Owner cannot be removed"
                : "Remove user"
          }
          className="h-auto px-2 py-1 text-[12.5px] font-medium text-[#7A7A7A] hover:bg-[#FEEAE8] hover:text-[#B0352E]"
        >
          Remove
        </Button>
      </td>
    </tr>
  );
}
