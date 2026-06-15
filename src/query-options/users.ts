import { queryOptions } from "@tanstack/react-query";
import {
  getUser,
  getUsers,
  searchUsers,
  type ListUsersArgs,
  type SearchUsersArgs,
} from "@/lib/users";

export const listUsersQueryOptions = (args: ListUsersArgs = {}) => {
  return queryOptions({
    queryKey: ["users", args],
    queryFn: () => getUsers(args),
  });
};

export const searchUsersQueryOptions = (args: SearchUsersArgs) => {
  return queryOptions({
    queryKey: ["users-search", args],
    queryFn: () => searchUsers(args),
  });
};

export const getUserQueryOptions = (user_id: number) => {
  return queryOptions({
    queryKey: ["users", user_id],
    queryFn: () => getUser(user_id),
  });
};
