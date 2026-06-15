import {
  LoginBrandMark,
  LoginFooter,
  LoginHeader,
  LoginLegal,
  LoginShell,
  OAuthProviderList,
} from "@/components/login";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_denied: "Google sign-in was canceled.",
  invalid_state: "Your login session expired. Please try again.",
  token_exchange_failed: "Google login failed while confirming your account.",
  profile_lookup_failed: "Google login failed while loading your profile.",
  email_not_verified: "Your Google account email must be verified.",
  no_access: "This Google account does not have access to this workspace.",
  auth_failed: "Unable to complete sign-in right now.",
  session_failed: "Unable to create your session. Please try again.",
};

function sanitizeNextPath(raw: string | null): string {
  if (!raw) return "/orders";
  if (!raw.startsWith("/")) return "/orders";
  if (raw.startsWith("//")) return "/orders";
  return raw;
}

export function LoginPage() {
  const { status } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const nextPath = sanitizeNextPath(query.get("next"));
  const oauthError = query.get("oauth_error")?.trim() ?? "";
  const oauthErrorMessage = oauthError
    ? OAUTH_ERROR_MESSAGES[oauthError] ?? "Unable to complete Google sign-in."
    : null;

  if (status === "loading") {
    return (
      <main
        data-page="login-loading"
        className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 sm:px-6"
      >
        <Spinner className="size-6 text-[#335b43]" />
      </main>
    );
  }

  if (status === "authenticated") {
    return <Navigate replace to={nextPath} />;
  }

  return (
    <LoginShell>
      <LoginHeader />
      <main
        data-page="login"
        className="flex items-center justify-center px-6 py-10 max-sm:px-4"
      >
        <div className="flex w-full max-w-[420px] flex-col animate-in fade-in slide-in-from-bottom-1 duration-500">
          <LoginBrandMark />
          <h1 className="mb-2.5 text-center text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
            Welcome back
          </h1>
          <p className="mb-8 text-center text-[15px] leading-[1.55] text-[#4A4A4A]">
            Sign in to manage your sites, deployments, and billing.
          </p>
          <OAuthProviderList nextPath={nextPath} />
          {oauthErrorMessage && (
            <p className="mt-4 rounded-lg border border-[#f2d7d7] bg-[#fff6f6] px-3 py-2 text-center text-sm text-[#9d2929]">
              {oauthErrorMessage}
            </p>
          )}
          <LoginLegal />
        </div>
      </main>
      <LoginFooter />
    </LoginShell>
  );
}