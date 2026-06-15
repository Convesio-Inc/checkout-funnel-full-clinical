import { and, asc, eq, isNotNull } from 'drizzle-orm';
import { db } from '../../db/client';
import { orders, payments } from '../../db/schema';
import {
  applyParsedUpstreamToPaymentRow,
  fetchUpstreamPaymentById,
} from './apply-upstream-to-payment';
import {
  CPAY_STATUS_FAILED,
  CPAY_STATUS_PENDING,
  CPAY_STATUS_SCHEDULED,
} from './payment-status';
import {
  classifyStoredCardResponse,
  postStoredCardCharge,
  type StoredCardChargeLineItem,
} from './stored-card-charge';
import { PENDING_STATUSES, SUCCESS_STATUSES } from './shared';

type Database = ReturnType<typeof db>;

/** Placeholder `returnUrl` for server-side stored-card calls (no browser return). */
const CRON_STORED_CARD_RETURN_URL = 'https://invalid.invalid/thank-you';

function parseLineItemsJson(json: string): StoredCardChargeLineItem[] {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredCardChargeLineItem[];
  } catch {
    return [];
  }
}

/**
 * GET every in-flight upstream payment for this order so `pending` rows can
 * flip to `success` and merge line items before we run new stored-card posts.
 */
export async function reconcilePendingPaymentsWithUpstreamForOrder(
  env: Env,
  database: Database,
  orderId: number,
): Promise<void> {
  const rows = await database
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.order_id, orderId),
        eq(payments.cpay_status, CPAY_STATUS_PENDING),
        isNotNull(payments.cpay_id),
      ),
    );

  for (const row of rows) {
    if (!row.cpay_id) continue;
    const got = await fetchUpstreamPaymentById(env, row.cpay_id);
    if (got instanceof Response) continue;
    if (!got.parsed) continue;
    await applyParsedUpstreamToPaymentRow(env, database, orderId, row, got.parsed);
  }
}

/**
 * POST stored-card for each `scheduled` payment on the order, then reconcile
 * any `pending` result once via GET (CoF rarely returns `Pending`).
 */
export async function chargeScheduledUpsellPaymentsForOrder(
  env: Env,
  database: Database,
  order: typeof orders.$inferSelect,
  leadCustomerId: string | null,
): Promise<void> {
  if (!order.stored_payment_method_id) return;

  const scheduledRows = await database
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.order_id, order.id),
        eq(payments.cpay_status, CPAY_STATUS_SCHEDULED),
      ),
    )
    .orderBy(asc(payments.id));

  for (const row of scheduledRows) {
    const amount = row.amount_minor;
    const currency = row.currency?.trim();
    if (
      amount == null ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !currency
    ) {
      await database
        .update(payments)
        .set({ cpay_status: CPAY_STATUS_FAILED })
        .where(eq(payments.id, row.id));
      continue;
    }

    const lineItems = parseLineItemsJson(row.line_items);
    const now = Date.now();
    const orderNumber = `${row.id}-${now}`;

    const postResult = await postStoredCardCharge(env, {
      returnUrl: CRON_STORED_CARD_RETURN_URL,
      orderNumber,
      amount,
      currency,
      customerId: leadCustomerId ?? row.customer_id,
      storedPaymentMethodId: order.stored_payment_method_id,
      lineItems,
    });

    if (postResult instanceof Response) {
      await database
        .update(payments)
        .set({ cpay_status: CPAY_STATUS_FAILED })
        .where(eq(payments.id, row.id));
      continue;
    }

    const { upstream, parsed } = postResult;
    const { kind, upstreamStatus } = classifyStoredCardResponse(upstream, parsed);

    if (kind === 'action_required') {
      await database
        .update(payments)
        .set({ cpay_status: CPAY_STATUS_FAILED })
        .where(eq(payments.id, row.id));
      continue;
    }

    if (kind !== 'terminal_ok' || !parsed) {
      await database
        .update(payments)
        .set({ cpay_status: CPAY_STATUS_FAILED })
        .where(eq(payments.id, row.id));
      continue;
    }

    const isSuccess = !!upstreamStatus && SUCCESS_STATUSES.has(upstreamStatus);
    const isPending = !!upstreamStatus && PENDING_STATUSES.has(upstreamStatus);
    const customerIdFromUpstream =
      parsed.customerId ?? parsed.customer?.id ?? row.customer_id ?? null;

    if (!parsed.id) {
      await database
        .update(payments)
        .set({ cpay_status: CPAY_STATUS_FAILED })
        .where(eq(payments.id, row.id));
      continue;
    }

    // `applyParsedUpstreamToPaymentRow` only merges when the row is still
    // `pending`; persist `cpay_id` first, then reconcile like `/poll-payment`.
    await database
      .update(payments)
      .set({
        cpay_id: parsed.id,
        cpay_status: CPAY_STATUS_PENDING,
        customer_id: customerIdFromUpstream,
      })
      .where(eq(payments.id, row.id));

    const [pendingRow] = await database
      .select()
      .from(payments)
      .where(eq(payments.id, row.id))
      .limit(1);

    if (!pendingRow) continue;

    if (isSuccess) {
      await applyParsedUpstreamToPaymentRow(
        env,
        database,
        order.id,
        pendingRow,
        parsed,
      );
    } else if (isPending) {
      const got = await fetchUpstreamPaymentById(env, parsed.id);
      if (!(got instanceof Response) && got.parsed) {
        await applyParsedUpstreamToPaymentRow(
          env,
          database,
          order.id,
          pendingRow,
          got.parsed,
        );
      }
    }
  }
}
