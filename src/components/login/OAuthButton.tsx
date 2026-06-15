/**
 * OAuthButton
 * -----------------------------------------------------------------------------
 * Shared social sign-in row style used by all provider buttons.
 * -----------------------------------------------------------------------------
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type OAuthButtonVariant = "primary" | "default";

interface OAuthButtonProps {
  icon: ReactNode;
  label: string;
  variant?: OAuthButtonVariant;
  href?: string;
  onClick?: () => void;
}

export function OAuthButton({
  icon,
  label,
  variant = "default",
  href,
  onClick,
}: OAuthButtonProps) {
  const content = (
    <>
      <span className="grid h-[22px] w-[22px] place-items-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <ArrowRight
        className={cn(
          "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5",
          variant === "primary"
            ? "text-white/70 group-hover:text-white"
            : "text-[#7A7A7A] group-hover:text-[#1A1A1A]"
        )}
      />
    </>
  );

  const className = cn(
    "group h-12 w-full justify-start gap-3.5 rounded-xl border px-[18px] text-[14.5px] font-semibold shadow-none transition-all duration-200",
    "focus-visible:ring-3 focus-visible:ring-[rgba(10,102,208,0.35)] focus-visible:ring-offset-2",
    variant === "primary"
      ? "border-[#0D2743] bg-[#0D2743] text-white hover:-translate-y-px hover:border-[#0a1f36] hover:bg-[#0a1f36] hover:text-white"
      : "border-[#ECECEC] bg-white text-[#1A1A1A] hover:-translate-y-px hover:border-[#d6d6d6] hover:bg-white hover:text-[#1A1A1A] hover:shadow-[0_6px_16px_rgba(13,39,67,0.06)]"
  );

  if (href) {
    return (
      <Button asChild variant="outline" data-slot="oauth-button" className={className}>
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      data-slot="oauth-button"
      className={className}
      onClick={onClick}
    >
      {content}
    </Button>
  );
}
