import { mutationOptions } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  updateUserRole,
  type CreateUserArgs,
  type ManageableUserRole,
} from "@/lib/users";

interface UpdateUserRoleMutationArgs {
  user_id: number;
  role: ManageableUserRole;
}

export const createUserMutationOptions = () => {
  return mutationOptions({
    mutationFn: (args: CreateUserArgs) => createUser(args),
  });
};

export const updateUserRoleMutationOptions = () => {
  return mutationOptions({
    mutationFn: ({ user_id, role }: UpdateUserRoleMutationArgs) =>
      updateUserRole(user_id, role),
  });
};

export const deleteUserMutationOptions = () => {
  return mutationOptions({
    mutationFn: (user_id: number) => deleteUser(user_id),
  });
};
