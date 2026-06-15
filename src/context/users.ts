import { createContext } from "react";

export interface UsersContextValue {
  page: number;
  setPage: (page: number) => void;
  query: string;
  setQuery: (query: string) => void;
}

export const UsersContext = createContext<UsersContextValue | null>(null);
