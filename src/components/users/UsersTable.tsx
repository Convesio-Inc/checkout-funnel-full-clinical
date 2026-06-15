import type { User, UserRole } from "./userData";
import { UserRow } from "./UserRow";

type UsersTableProps = {
  users: User[];
  onRoleChange: (user_id: string, role: Exclude<UserRole, "owner">) => void;
  onRemove: (user_id: string) => void;
  roleEditingDisabled?: boolean;
  removeDisabled?: boolean;
};

/**
 * UsersTable
 * -----------------------------------------------------------------------------
 * Members table for the settings user management pane.
 * -----------------------------------------------------------------------------
 */
export function UsersTable({
  users,
  onRoleChange,
  onRemove,
  roleEditingDisabled = false,
  removeDisabled = false,
}: UsersTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        data-section="users-table"
        aria-label="Workspace members"
        className="w-full min-w-[760px] border-separate border-spacing-0 text-sm"
      >
        <thead>
          <tr>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Member
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Role
            </th>
            <th className="bg-[#FAFAFA] px-5 py-3.5 text-right text-[11px] font-semibold tracking-[0.12em] text-[#7A7A7A] uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-12 text-center text-sm text-[#7A7A7A]">
                No matches.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onRoleChange={onRoleChange}
              onRemove={onRemove}
              roleEditingDisabled={roleEditingDisabled}
              removeDisabled={removeDisabled}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
