/**
 * LoginLegal
 * -----------------------------------------------------------------------------
 * Divider, SAML link, and legal agreement copy shown under social sign-in rows.
 * -----------------------------------------------------------------------------
 */

import { Separator } from "@/components/ui/separator";

export function LoginLegal() {
  return (
    <div data-section="login-legal" className="mt-6">
      <div
        data-slot="divider"
        className="flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.18em] text-[#7A7A7A] uppercase"
      >
        <Separator className="flex-1 bg-[#ECECEC]" />
      </div>

      <p data-slot="legal-copy" className="mt-7 text-center text-xs leading-[1.6] text-[#7A7A7A]">
        By continuing you agree to Convesio&apos;s{" "}
        <a
          href="https://convesio.com/terms-of-service/"
          className="border-b border-[#E3E3E3] pb-px text-[#4A4A4A] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://convesio.com/privacy-policy/"
          className="border-b border-[#E3E3E3] pb-px text-[#4A4A4A] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
