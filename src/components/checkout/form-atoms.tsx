/**
 * form-atoms
 * -----------------------------------------------------------------------------
 * Shared building blocks for the checkout form: the uppercase-labelled `Field`
 * wrapper, the numbered `SectionHead`, and the `inputCls` string used by every
 * text input / select so they share the flat gloss-input treatment.
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

export const inputCls =
  "w-full gloss-input rounded-md px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3/70";

export interface FieldProps {
  label: string;
  children: React.ReactNode;
  /** Tailwind grid-span class. Defaults to full width within a 2-col grid. */
  span?: string;
  optional?: boolean;
  hint?: string;
  /** Stable field marker (data-field) preserved from the original components. */
  dataField?: string;
}

export function Field({
  label,
  children,
  span = "col-span-2",
  optional = false,
  hint,
  dataField,
}: FieldProps) {
  return (
    <label className={"block " + span} data-field={dataField}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] uppercase tracking-[0.14em] text-ink2 font-medium">
          {label}
        </span>
        {optional && <span className="text-[10.5px] text-ink3">optional</span>}
        {hint && <span className="text-[10.5px] text-ink3">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export interface SectionHeadProps {
  n: string;
  title: string;
  sub: string;
}

export function SectionHead({ n, title, sub }: SectionHeadProps) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <div className="flex items-baseline gap-2.5">
        <span className="num text-[11px] w-5 h-5 inline-flex items-center justify-center rounded-full bg-forest text-bone">
          {n}
        </span>
        <h3 className="font-semibold text-[15px] tracking-tight text-ink">{title}</h3>
      </div>
      <span className="text-[11.5px] text-ink3">{sub}</span>
    </div>
  );
}
