import {
  PENDING_STATUSES,
  requireSecret,
  resolveEnvironment,
  storedCardEndpoint,
  SUCCESS_STATUSES,
  type UpstreamPaymentResponse,
} from './shared';

export interface StoredCardChargeLineItem {
  description?: unknown;
  quantity?: unknown;
  amountIncludingTax?: unknown;
}

export interface StoredCardChargeArgs {
  returnUrl: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerId: string | null | undefined;
  storedPaymentMethodId: string;
  lineItems: ReadonlyArray<StoredCardChargeLineItem>;
}

export interface StoredCardChargeResult {
  upstream: Response;
  text: string;
  parsed: UpstreamPaymentResponse | null;
}

/**
 * POST `/v1/payments/stored-card` — shared by the deferred-upsell cron and
 * (if needed) other server-side CoF paths.
 */
export async function postStoredCardCharge(
  env: Env,
  args: StoredCardChargeArgs,
): Promise<StoredCardChargeResult | Response> {
  const secret = requireSecret(env);
  if (secret instanceof Response) return secret;

  const environment = resolveEnvironment(env);

  const payload = {
    integration: env.CPAY_INTEGRATION,
    returnUrl: args.returnUrl,
    orderNumber: args.orderNumber,
    amount: args.amount,
    currency: args.currency,
    customer: {
      id: args.customerId ?? undefined,
      storedPaymentMethodId: args.storedPaymentMethodId,
    },
    lineItems: args.lineItems.map((item) => ({
      description: item['description'],
      quantity: item['quantity'],
      amountIncludingTax: item['amountIncludingTax'],
    })),
  };

  let upstream: Response;
  try {
    upstream = await fetch(storedCardEndpoint(environment), {
      method: 'POST',
      headers: {
        Authorization: secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: true,
        message: `Upstream payment request failed: ${err instanceof Error ? err.message : String(err)}`,
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const text = await upstream.text();
  let parsed: UpstreamPaymentResponse | null = null;
  try {
    parsed = text ? (JSON.parse(text) as UpstreamPaymentResponse) : null;
  } catch {
    parsed = null;
  }

  return { upstream, text, parsed };
}

export function classifyStoredCardResponse(
  upstream: Response,
  parsed: UpstreamPaymentResponse | null,
): {
  kind: 'terminal_ok' | 'action_required' | 'failed';
  upstreamOk: boolean;
  upstreamStatus: string | undefined;
} {
  const upstreamOk = upstream.ok && !parsed?.error;
  const upstreamStatus = parsed?.status;

  if (parsed?.actionRequired?.redirectUrl) {
    return { kind: 'action_required', upstreamOk, upstreamStatus };
  }

  const isTerminalOk =
    upstreamOk &&
    !!upstreamStatus &&
    (SUCCESS_STATUSES.has(upstreamStatus) || PENDING_STATUSES.has(upstreamStatus));

  if (isTerminalOk) {
    return { kind: 'terminal_ok', upstreamOk, upstreamStatus };
  }

  return { kind: 'failed', upstreamOk, upstreamStatus };
}
