import { UsersContext, type UsersContextValue } from "@/context/users";
import { type ReactNode, useCallback, useMemo, useState } from "react";

export function UsersProvider({ children }: { children: ReactNode }) {
  const [page, setPageState] = useState(1);
  const [query, setQueryState] = useState("");

  const setPage = useCallback((nextPage: number) => {
    setPageState(nextPage);
  }, []);

  const setQuery = useCallback((nextQuery: string) => {
    setQueryState(nextQuery);
    setPageState(1);
  }, []);

  const value = useMemo<UsersContextValue>(
    () => ({ page, setPage, query, setQuery }),
    [page, setPage, query, setQuery],
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}
