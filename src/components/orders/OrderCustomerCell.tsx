type OrderCustomerCellProps = {
  customerName: string;
  customerEmail?: string;
  avatarInitials: string;
};

/**
 * OrderCustomerCell
 * -----------------------------------------------------------------------------
 * Customer identity cell with initials avatar, name, and email.
 * -----------------------------------------------------------------------------
 */
export function OrderCustomerCell({
  customerName,
  customerEmail,
  avatarInitials,
}: OrderCustomerCellProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold tracking-[0.02em] text-white bg-brand`}
      >
        {avatarInitials}
      </span>
      <span className="block">
        <span className="block text-sm leading-[1.3] font-semibold text-[#1A1A1A]">
          {customerName}
        </span>
        <span className="block text-xs leading-[1.3] text-[#7A7A7A] max-sm:hidden">
          {customerEmail ?? ''}
        </span>
      </span>
    </div>
  );
}
