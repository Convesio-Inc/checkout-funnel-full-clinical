import type { CartRoverListOrdersArgs } from "../../../worker/services/cart-rover";

export type OrderStatus = NonNullable<CartRoverListOrdersArgs['status']>;

type OrderStatusMeta = {
  status: OrderStatus;
  label: string;
  pill: string;
  dot: string;
};

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  'new': {
    status: 'new',
    label: "New",
    pill: "border-[#C9EBD6] bg-[#E8F7EF] text-[#1F7A4C]",
    dot: "bg-[#2BB673]",
  },
  'at_wms': {
    status: 'at_wms',
    label: "At WMS",
    pill: "border-[#F6E3B3] bg-[#FFF6E5] text-[#8A5A00]",
    dot: "bg-[#F5A623]",
  },
  'new_or_at_wms': {
    status: 'new_or_at_wms',
    label: "New or At WMS",
    pill: "border-[#C5DEF4] bg-[#E6F1FC] text-[#18568F]",
    dot: "bg-[#2D85D8]",
  },
  'partial': {
    status: 'partial',
    label: "Partial",
    pill: "border-[#F9CFCB] bg-[#FEEAE8] text-[#B0352E]",
    dot: "bg-[#E85A4C]",
  },
  'shipped': {
    status: 'shipped',
    label: "Shipped",
    pill: "border-[#C9EBD6] bg-[#E8F7EF] text-[#1F7A4C]",
    dot: "bg-[#2BB673]",
  },
  'confirmed': {
    status: 'confirmed',
    label: "Confirmed",
    pill: "border-[#F6E3B3] bg-[#FFF6E5] text-[#8A5A00]",
    dot: "bg-[#8C8C8C]",
  },
  'shipped_or_confirmed': {
    status: 'shipped_or_confirmed',
    label: "Shipped or Confirmed",
    pill: "border-[#E2E5E9] bg-[#F1F2F4] text-[#555555]",
    dot: "bg-[#8C8C8C]",
  },
  'error': {
    status: 'error',
    label: "Error",
    pill: "border-[#E2E5E9] bg-[#F1F2F4] text-[#555555]",
    dot: "bg-[#8C8C8C]",
  },
  'canceled': {
    status: 'canceled',
    label: "Canceled",
    pill: "border-[#E2E5E9] bg-[#F1F2F4] text-[#555555]",
    dot: "bg-[#8C8C8C]",
  },
  'any': {
    status: 'any',
    label: "Any",
    pill: "border-[#E2E5E9] bg-[#F1F2F4] text-[#555555]",
    dot: "bg-[#8C8C8C]",
  },
};
