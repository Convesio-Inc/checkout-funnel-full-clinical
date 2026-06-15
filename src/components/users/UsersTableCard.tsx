import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, NewUserPayload } from "./userData";
import { AVATAR_BACKGROUND_COLOR } from "./userData";
import { AddUserDialog } from "./AddUserDialog";
import { UsersTable } from "./UsersTable";
import { UsersTableToolbar } from "./UsersTableToolbar";
import { useUsers } from "@/hooks/useUsers";
import type { UserSummary } from "@/lib/users";
import {
  createUserMutationOptions,
  deleteUserMutationOptions,
} from "@/mutation-options/users";

function mapSummaryToUser(summary: UserSummary): User {
  return {
    id: String(summary.id),
    name: summary.name,
    email: summary.email,
    role: summary.role,
    color: AVATAR_BACKGROUND_COLOR,
  };
}

/**
 * UsersTableCard
 * -----------------------------------------------------------------------------
 * Members table backed by list/search API via useUsers (context + React Query).
 * Invite + remove are wired via mutations; role changes remain read-only.
 * -----------------------------------------------------------------------------
 */
export function UsersTableCard() {
  const { data, isLoading, query, setQuery } = useUsers();
  const queryClient = useQueryClient();
  const createUserMutation = useMutation(createUserMutationOptions());
  const deleteUserMutation = useMutation(deleteUserMutationOptions());

  const rows = useMemo(() => {
    if (!data?.data?.length) {
      return [];
    }
    return data.data.map((summary) => mapSummaryToUser(summary));
  }, [data]);

  const handle_add_user = async (payload: NewUserPayload) => {
    const response = await createUserMutation.mutateAsync(payload);
    const result = response as unknown as {
      success?: boolean;
      message?: string;
    };

    if (!result.success) {
      throw new Error(result.message ?? "Unable to create user.");
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["users"] }),
      queryClient.invalidateQueries({ queryKey: ["users-search"] }),
    ]);
  };

  const handle_remove_user = async (user_id: string) => {
    const parsed_id = Number(user_id);
    if (!Number.isInteger(parsed_id) || parsed_id < 1) {
      return;
    }

    const user = rows.find((row) => row.id === user_id);
    if (!user || user.role === "owner") {
      return;
    }

    const should_remove = window.confirm(
      `Remove ${user.name} from the workspace?`,
    );
    if (!should_remove) {
      return;
    }

    const response = await deleteUserMutation.mutateAsync(parsed_id);
    const result = response as unknown as {
      success?: boolean;
      message?: string;
    };

    if (!result.success) {
      throw new Error(result.message ?? "Unable to remove user.");
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["users"] }),
      queryClient.invalidateQueries({ queryKey: ["users-search"] }),
    ]);
  };

  return (
    <section
      data-section="users-table-card"
      aria-label="User management table"
      className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white"
    >
      <UsersTableToolbar
        query={query}
        onQueryChange={setQuery}
        addUserDialog={<AddUserDialog onAddUser={handle_add_user} />}
      />
      {isLoading ? (
        <div className="px-5 py-12 text-center text-sm text-[#7A7A7A]">
          Loading users...
        </div>
      ) : (
        <UsersTable
          users={rows}
          roleEditingDisabled
          onRoleChange={() => {}}
          onRemove={(user_id) => {
            handle_remove_user(user_id).catch((error) => {
              window.alert(
                error instanceof Error && error.message
                  ? error.message
                  : "Unable to remove user.",
              );
            });
          }}
        />
      )}
    </section>
  );
}
