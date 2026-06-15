import { searchOrders, type SearchOrderFilters } from '../../db/order-search';
import { CartRoverService } from '../../services/cart-rover';
import {
  json,
  parseOptionalPositiveInteger,
  withPaginationHeaders,
} from '../common';
import { readAuthenticatedSession, unauthorizedResponse } from '../auth/shared';

export async function handleSearchOrders(
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
  if (typeof pageSizeParam === 'number' && pageSizeParam > 10) {
    return json(
      {
        error: true,
        message: 'Invalid `page_size` query param. Maximum value is 10.',
      },
      { status: 400 },
    );
  }

  const orderIdParam = parseOptionalPositiveInteger(
    url.searchParams.get('order_id'),
    'order_id',
  );
  if (orderIdParam instanceof Response) return orderIdParam;

  const filters: SearchOrderFilters = {};
  const query = url.searchParams.get('query')?.trim();
  const customerEmail = url.searchParams.get('customer_email')?.trim();
  const customerName = url.searchParams.get('customer_name')?.trim();

  if (query) filters.query = query;
  if (customerEmail) filters.customer_email = customerEmail;
  if (customerName) filters.customer_name = customerName;
  if (typeof orderIdParam === 'number') filters.order_id = orderIdParam;

  const cartRover = new CartRoverService(
    env.CARTROVER_API_USER,
    env.CARTROVER_API_KEY,
  );

  try {
    const grouped = await searchOrders(env, {
      page: pageParam,
      pageSize: pageSizeParam,
      filters,
    });

    const pagination = {
      page: grouped.pagination.page,
      pageSize: grouped.pagination.pageSize,
      total: grouped.pagination.total,
      totalPages: grouped.pagination.totalPages,
    };

    if (grouped.orderIds.length === 0) {
      const response = json({
        success_code: true,
        response: [],
      });
      return withPaginationHeaders(
        response,
        url,
        pagination,
        { pageParam: 'page', pageSizeParam: 'page_size' },
      );
    }

    // IMPORTANT: We intentionally do two parallel calls per order (`viewOrder` + `viewOrderStatus`).
    // This is not ideal, but CartRover does not include `order_status` on `viewOrder`
    // and does not provide usable webhooks for us to persist authoritative status in our DB.
    const orderResults = await Promise.all(
      grouped.orderIds.map(async (orderId) => {
        const [order, orderStatus] = await Promise.all([
          cartRover.viewOrder(orderId),
          cartRover.viewOrderStatus(orderId),
        ]);

        return { order, orderStatus };
      }),
    );

    const successfulOrders = orderResults
      .filter((result) => result.order.success_code)
      .map((result) => ({
        ...result.order.response,
        ...(result.orderStatus.success_code ? result.orderStatus.response : {}),
      }));

    const response = json({
      success_code: orderResults.every(
        (result) => result.order.success_code && result.orderStatus.success_code,
      ),
      response: successfulOrders,
    });
    return withPaginationHeaders(
      response,
      url,
      pagination,
      { pageParam: 'page', pageSizeParam: 'page_size' },
    );
  } catch (err) {
    return json(
      {
        error: true,
        message: `Unable to search orders: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 502 },
    );
  }
}
