/**
 * SectionCard
 * -----------------------------------------------------------------------------
 * Shared wrapper for the form sections (Customer / Shipping / Payment). Renders
 * a `<section>` as a self-contained card with a titled header, so each section
 * in the form column is visually distinct.
 *
 * Markers:
 *   - root             data-section="<section>" + data-slot="section-card"
 *   - title            data-slot="section-title"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends React.ComponentProps<"div"> {
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
    <Card
      data-section={section}
      data-slot="section-card"
      className={cn(
        "",
        className,
      )}
      {...rest}
    >
      {title ? (
        <CardHeader className="px-5 sm:px-6 border-b border-border pb-4">
          <CardTitle
            data-slot="section-title"
            className={cn(
              "text-base font-semibold tracking-tight",
              titleClassName,
            )}
          >
            {title}
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="px-5 sm:px-6">
        <div className="flex flex-col gap-3">{children}</div>
      </CardContent>
    </Card>
  );
}
