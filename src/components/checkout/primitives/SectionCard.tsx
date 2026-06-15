/**
 * SectionCard
 * -----------------------------------------------------------------------------
 * Shared white "gloss" card with an optional titled header. Used by the
 * thank-you page surfaces. Title renders in the Instrument Serif display face
 * by default; pass `titleClassName` to override.
 *
 * Markers:
 *   - root             data-section="<section>" + data-slot="section-card"
 *   - title            data-slot="section-title"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionCardProps extends React.ComponentProps<"section"> {
  section: string;
  title?: string;
  titleClassName?: string;
}

export function SectionCard({
  section,
  title,
  titleClassName,
  className,
  children,
  ...rest
}: SectionCardProps) {
  return (
    <section
      data-section={section}
      data-slot="section-card"
      className={cn("gloss-card rounded-md overflow-hidden", className)}
      {...rest}
    >
      {title ? (
        <header className="px-5 sm:px-6 pt-5 pb-4 border-b border-line2">
          <h2
            data-slot="section-title"
            className={cn("serif text-[24px] leading-[1.1] tracking-tight text-ink", titleClassName)}
          >
            {title}
          </h2>
        </header>
      ) : null}
      <div className="px-5 sm:px-6 py-5">
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </section>
  );
}
