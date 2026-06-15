import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { db } from '../../db/client';
import { payments } from '../../db/schema';
import { json, readJson } from '../common';
import {
  applyParsedUpstreamToPaymentRow,
  fetchUpstreamPaymentById,
} from './apply-upstream-to-payment';
import { CPAY_STATUS_PENDING } from './payment-status';

interface PollPaymentBody {
  order_id?: number | string;
}

export async function handlePollPayment(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<PollPaymentBody>(request);
  const orderId = Number(body?.order_id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(
      { error: true, message: 'Missing or invalid `order_id` in request body.' },
      { status: 400 },
    );
  }

  // Most recent `pending` row that already has a `cpay_id` (submitted upstream).
  // Deferred upsell rows stay `scheduled` with no `cpay_id` until the cron.
  const database = db(env);
  const [pendingPayment] = await database
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.order_id, orderId),
        eq(payments.cpay_status, CPAY_STATUS_PENDING),
        isNotNull(payments.cpay_id),
      ),
    )
    .orderBy(desc(payments.id))
    .limit(1);

  const [fallbackPayment] = pendingPayment
    ? [pendingPayment]
    : await database
        .select()
        .from(payments)
        .where(and(eq(payments.order_id, orderId), isNotNull(payments.cpay_id)))
        .orderBy(desc(payments.id))
        .limit(1);

  const targetPayment = pendingPayment ?? fallbackPayment;

  if (!targetPayment || !targetPayment.cpay_id) {
    return json(
      { error: true, message: 'No payment found for the given order.' },
      { status: 404 },
    );
  }

  const got = await fetchUpstreamPaymentById(env, targetPayment.cpay_id);
  if (got instanceof Response) return got;

  const { response: upstream, text, parsed } = got;

  if (parsed) {
    await applyParsedUpstreamToPaymentRow(
      env,
      database,
      orderId,
      targetPayment,
      parsed,
    );
  }

  return new Response(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
