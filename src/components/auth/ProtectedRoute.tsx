import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <main
        data-page="auth-loading"
        className="mx-auto flex min-h-[40vh] w-full max-w-6xl items-center justify-center px-4 sm:px-6"
      >
        <Spinner className="size-6 text-[#335b43]" />
      </main>
    );
  }

  if (status !== "authenticated") {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`/login?next=${next}`} />;
  }

  return <>{children}</>;
}
