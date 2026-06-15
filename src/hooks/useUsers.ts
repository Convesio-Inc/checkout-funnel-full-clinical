import { UsersContext } from "@/context/users";
import {
  listUsersQueryOptions,
  searchUsersQueryOptions,
} from "@/query-options/users";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    throw new Error("useUsers must be used within a UsersProvider.");
  }

  const trimmedQuery = ctx.query.trim();

  const { data: listData, isLoading: listLoading } = useQuery({
    ...listUsersQueryOptions({ page: ctx.page }),
    enabled: !trimmedQuery,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...searchUsersQueryOptions({ q: trimmedQuery, page: ctx.page }),
    enabled: trimmedQuery.length > 0,
  });

  const data = trimmedQuery ? searchData : listData;
  const isLoading = trimmedQuery ? searchLoading : listLoading;

  return { data, isLoading, ...ctx };
}
