/**
 * SiteFooter
 * -----------------------------------------------------------------------------
 * Quiet storefront footer: copyright, policy links, secure-checkout assurance.
 * Paper background with a hairline top border to match the Meridian chrome.
 * -----------------------------------------------------------------------------
 */

import { Icon } from "@/components/icons";

const POLICY_LINKS = ["Privacy", "Terms", "Refunds", "Contact"];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper/60 backdrop-blur mt-12">
      <div className="max-w-[1180px] mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11.5px] text-ink3">
        <div>© 2026 Meridian Botanicals — Portland, OR</div>
        <nav className="flex items-center gap-5">
          {POLICY_LINKS.map((label) => (
            <a key={label} href="#" className="hover:text-ink transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <div className="inline-flex items-center gap-1.5">
          <Icon.Lock className="w-3.5 h-3.5" /> Secure checkout
        </div>
      </div>
    </footer>
  );
}
