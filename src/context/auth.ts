import { createContext } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "owner" | "admin" | "member";
}

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface AuthActionResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Shape of JSON error responses from the `/auth/*` worker endpoints. */
export interface AuthErrorResponse {
  message?: string;
}

/** Shape of the JSON body returned by `GET /auth/session`. */
export interface AuthSessionResponse {
  user?: AuthUser;
}