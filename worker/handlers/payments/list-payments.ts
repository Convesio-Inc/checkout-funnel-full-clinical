import { listPayments, type ListPaymentsFilters } from '../../db/payments';
import {
  json,
  parseOptionalPositiveInteger,
  withPaginationHeaders,
} from '../common';
import { readAuthenticatedSession, unauthorizedResponse } from '../auth/shared';

export async function handleListPayments(
  request: Request,
  env: Env,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  const url = new URL(request.url);

  const pageParam = parseOptionalPositiveInteger(url.searchParams.get('page'), 'page');
  if (pageParam instanceof Response) return pageParam;

  const pageSizeParam = parseOptionalPositiveInteger(
    url.searchParams.get('page_size'),
    'page_size',
  );
  if (pageSizeParam instanceof Response) return pageSizeParam;

  const orderIdParam = parseOptionalPositiveInteger(
    url.searchParams.get('order_id'),
    'order_id',
  );
  if (orderIdParam instanceof Response) return orderIdParam;

  const filters: ListPaymentsFilters = {};
  const customerEmail = url.searchParams.get('customer_email')?.trim();
  const cpayStatus = url.searchParams.get('cpay_status')?.trim();

  if (customerEmail) filters.customer_email = customerEmail;
  if (typeof orderIdParam === 'number') filters.order_id = orderIdParam;
  if (cpayStatus) filters.cpay_status = cpayStatus;

  try {
    const result = await listPayments(env, {
      page: pageParam,
      pageSize: pageSizeParam,
      filters,
    });

    const response = json(result);
    return withPaginationHeaders(
      response,
      url,
      {
        page: result.pagination.page,
        pageSize: result.pagination.pageSize,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
      { pageParam: 'page', pageSizeParam: 'page_size' },
    );
  } catch (err) {
    return json(
      {
        error: true,
        message: `Unable to load payments: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }
}
