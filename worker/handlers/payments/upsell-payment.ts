import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { orders, payments } from '../../db/schema';
import { json, readJson } from '../common';
import { CPAY_STATUS_SCHEDULED } from './payment-status';
import {
  type CardOnFilePaymentRequestBody,
  requireSecret,
} from './shared';

function firstSkuFromLineItemsJson(json: string): string | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const sku = (parsed[0] as { sku?: unknown }).sku;
    return typeof sku === 'string' && sku.trim() ? sku.trim() : null;
  } catch {
    return null;
  }
}

function firstSkuFromLineItemsArray(
  items: ReadonlyArray<Record<string, unknown>> | undefined,
): string | null {
  if (!items?.length) return null;
  const sku = items[0]?.['sku'];
  return typeof sku === 'string' && sku.trim() ? sku.trim() : null;
}

/**
 * Defers the ConvesioPay stored-card POST until the CartRover sync cron so the
 * upsell charge is spaced from the checkout authorization.
 */
export async function handleUpsellPayment(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<CardOnFilePaymentRequestBody>(request);
  const orderId = Number(body?.order_id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(
      { error: true, message: 'Missing or invalid `order_id` in request body.' },
      { status: 400 },
    );
  }
  if (!body?.amount || !body?.currency) {
    return json(
      { error: true, message: 'Missing required fields: amount, currency.' },
      { status: 400 },
    );
  }

  const database = db(env);

  const [order] = await database
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return json({ error: true, message: 'Order not found.' }, { status: 404 });
  }
  if (!order.stored_payment_method_id) {
    return json(
      { error: true, message: 'No stored payment method on this order.' },
      { status: 400 },
    );
  }

  const [latestPayment] = await database
    .select()
    .from(payments)
    .where(eq(payments.order_id, orderId))
    .orderBy(desc(payments.id))
    .limit(1);

  if (!latestPayment) {
    return json(
      { error: true, message: 'No payments found for this order.' },
      { status: 404 },
    );
  }

  const secret = requireSecret(env);
  if (secret instanceof Response) return secret;

  const incomingSku = firstSkuFromLineItemsArray(body.lineItems);
  if (incomingSku) {
    const existingScheduled = await database
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.order_id, orderId),
          eq(payments.cpay_status, CPAY_STATUS_SCHEDULED),
        ),
      );

    for (const row of existingScheduled) {
      if (firstSkuFromLineItemsJson(row.line_items) === incomingSku) {
        return json({
          deferred: true,
          alreadyQueued: true,
          order_id: orderId,
          message:
            'This add-on is already queued for payment. You will be charged when your order is finalized.',
        });
      }
    }
  }

  const now = Date.now();
  const lineItemsJson = JSON.stringify(body.lineItems ?? []);

  await database.insert(payments).values({
    order_id: orderId,
    cpay_status: CPAY_STATUS_SCHEDULED,
    customer_name: latestPayment.customer_name,
    customer_email: latestPayment.customer_email,
    customer_phone: latestPayment.customer_phone,
    customer_id: latestPayment.customer_id,
    line_items: lineItemsJson,
    amount_minor: body.amount,
    currency: body.currency,
    created_at: now,
  });

  return json({
    deferred: true,
    alreadyQueued: false,
    order_id: orderId,
    message:
      'Your add-on is saved. We will charge your saved card when your order is finalized (usually within a couple of hours).',
  });
}
