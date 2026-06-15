/**
 * LoginHeader
 * -----------------------------------------------------------------------------
 * Top navigation row for the login screen containing Convesio branding and a
 * back-to-site link.
 * -----------------------------------------------------------------------------
 */

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function LoginHeader() {
  return (
    <header data-section="login-header" className="px-5 py-6 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link to="/">
          <img alt="Convesio" className="h-[26px] w-auto" src="/convesio-logo.svg" />
        </Link>

        <a
          href="https://convesio.com"
          aria-label="Back to site"
          className="inline-flex items-center gap-2 text-[13px] text-[#7A7A7A] transition-colors hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to convesio.com</span>
        </a>
      </div>
    </header>
  );
}
