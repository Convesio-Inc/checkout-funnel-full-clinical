import {
  AuthContext,
  type AuthContextValue,
  type AuthErrorResponse,
  type AuthSessionResponse,
} from "@/context/auth";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function getErrorMessage(
  payload: AuthErrorResponse | null,
  fallback: string
): string {
  return payload?.message?.trim() || fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/auth/session", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const payload = await readJson<AuthSessionResponse>(response);

      if (!response.ok || !payload?.user) {
        setUser(null);
        setStatus("anonymous");
        return;
      }

      setUser(payload.user);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshSession();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [refreshSession]);

  const login = useCallback<AuthContextValue["login"]>(async (email, password) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await readJson<AuthSessionResponse & AuthErrorResponse>(
        response
      );

      if (!response.ok || !payload?.user) {
        return {
          ok: false,
          error: getErrorMessage(payload, "Invalid email or password."),
        };
      }

      setUser(payload.user);
      setStatus("authenticated");
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "Unable to login right now. Please try again.",
      };
    }
  }, []);

  const register = useCallback<AuthContextValue["register"]>(
    async (name, email, password) => {
      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const payload = await readJson<AuthErrorResponse>(response);

        if (!response.ok) {
          return {
            ok: false,
            error: getErrorMessage(payload, "Could not register user."),
          };
        }
      } catch {
        return {
          ok: false,
          error: "Unable to register right now. Please try again.",
        };
      }

      return login(email, password);
    },
    [login]
  );

  const logout = useCallback<AuthContextValue["logout"]>(async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      refreshSession,
    }),
    [login, logout, refreshSession, register, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
