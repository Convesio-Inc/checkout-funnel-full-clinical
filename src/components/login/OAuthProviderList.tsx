/**
 * OAuthProviderList
 * -----------------------------------------------------------------------------
 * Provider stack for social sign-in options displayed in the login card.
 * -----------------------------------------------------------------------------
 */

import { OAuthButton } from "./OAuthButton";

interface OAuthProviderListProps {
  nextPath: string;
}

export function OAuthProviderList({ nextPath }: OAuthProviderListProps) {
  const googleStartHref = `/auth/google/start?next=${encodeURIComponent(nextPath)}`;
  const handleGoogleLogin = () => {
    window.location.assign(googleStartHref);
  };

  return (
    <div data-section="oauth-provider-list" className="flex flex-col gap-2.5">
      {/* <OAuthButton icon={<GitHubMark />} label="Continue with GitHub" /> */}
      <OAuthButton
        icon={<GoogleMark />}
        label="Continue with Google"
        onClick={handleGoogleLogin}
      />
      {/* <OAuthButton icon={<GitLabMark />} label="Continue with GitLab" /> */}
      {/* <OAuthButton icon={<BitbucketMark />} label="Continue with Bitbucket" /> */}
    </div>
  );
}

// function GitHubMark() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//       <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.95 3.2 9.14 7.64 10.62.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.11.68-3.77-1.33-3.77-1.33-.51-1.3-1.24-1.64-1.24-1.64-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.21 3.26.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 2.8-.38c.95 0 1.9.13 2.8.38 2.13-1.45 3.07-1.15 3.07-1.15.61 1.53.23 2.67.11 2.95.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.24-5.11 5.51.4.35.75 1.03.75 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54 4.43-1.48 7.63-5.67 7.63-10.62C23.25 5.48 18.27.5 12 .5z" />
//     </svg>
//   );
// }

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

// function GitLabMark() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
//       <path fill="#E24329" d="M12 21.42l3.68-11.32H8.32L12 21.42z" />
//       <path
//         fill="#FC6D26"
//         d="M12 21.42L8.32 10.1H3.16L12 21.42zM12 21.42l3.68-11.32h5.16L12 21.42z"
//       />
//       <path
//         fill="#FCA326"
//         d="M3.16 10.1L2.04 13.55a.76.76 0 0 0 .28.85L12 21.42 3.16 10.1zm17.68 0l1.12 3.45a.76.76 0 0 1-.28.85L12 21.42l8.84-11.32z"
//       />
//       <path
//         fill="#E24329"
//         d="M3.16 10.1h5.16L6.1 3.27a.38.38 0 0 0-.72 0L3.16 10.1zm17.68 0h-5.16L17.9 3.27a.38.38 0 0 1 .72 0l2.22 6.83z"
//       />
//     </svg>
//   );
// }

// function BitbucketMark() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
//       <path
//         fill="#2684FF"
//         d="M.78 2.5a.78.78 0 0 0-.77.89l3.26 19.79c.08.45.47.78.93.78h15.67a.7.7 0 0 0 .7-.59l3.26-19.98a.78.78 0 0 0-.77-.89H.78zm14.02 14.3H9.22L7.74 9.04h8.42L14.8 16.8z"
//       />
//     </svg>
//   );
// }
