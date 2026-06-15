import { and, desc, or, sql, type SQL } from 'drizzle-orm';
import { db } from './client';
import { orders, payments } from './schema';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 10;

export interface SearchOrderFilters {
  query?: string;
  customer_email?: string;
  customer_name?: string;
  order_id?: number;
}

export interface SearchOrdersParams {
  page?: number;
  pageSize?: number;
  filters?: SearchOrderFilters;
}

export interface SearchOrdersResult {
  orderIds: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

function normalizePage(value: number | undefined): number {
  if (!Number.isInteger(value) || (value ?? 0) < 1) return DEFAULT_PAGE;
  return value as number;
}

function normalizePageSize(value: number | undefined): number {
  if (!Number.isInteger(value) || (value ?? 0) < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}

function buildWhereClause(filters: SearchOrderFilters = {}): SQL<unknown> | undefined {
  const clauses: Array<SQL<unknown>> = [];

  const customerEmail = filters.customer_email?.trim();
  if (customerEmail) {
    clauses.push(
      sql`lower(${payments.customer_email}) like ${
        `%${escapeLike(customerEmail.toLowerCase())}%`
      } escape '\\'`,
    );
  }

  const customerName = filters.customer_name?.trim();
  if (customerName) {
    clauses.push(
      sql`lower(coalesce(${payments.customer_name}, '')) like ${
        `%${escapeLike(customerName.toLowerCase())}%`
      } escape '\\'`,
    );
  }

  if (typeof filters.order_id === 'number') {
    clauses.push(sql`${orders.id} = ${filters.order_id}`);
  }

  const query = filters.query?.trim();
  if (query) {
    const escapedQuery = escapeLike(query);
    const queryLower = `%${escapedQuery.toLowerCase()}%`;
    const queryRaw = `%${escapedQuery}%`;

    clauses.push(
      or(
        sql`lower(${payments.customer_email}) like ${queryLower} escape '\\'`,
        sql`lower(coalesce(${payments.customer_name}, '')) like ${queryLower} escape '\\'`,
        sql`cast(${orders.id} as text) like ${queryRaw} escape '\\'`,
      ) as SQL<unknown>,
    );
  }

  return clauses.length > 0 ? (and(...clauses) as SQL<unknown>) : undefined;
}

export async function searchOrders(
  env: Env,
  params: SearchOrdersParams = {},
): Promise<SearchOrdersResult> {
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);
  const offset = (page - 1) * pageSize;
  const whereClause = buildWhereClause(params.filters ?? {});
  const database = db(env);

  const totalQuery = database
    .select({ total: sql<number>`count(distinct ${orders.id})` })
    .from(orders)
    .leftJoin(payments, sql`${payments.order_id} = ${orders.id}`);

  const [totalRow] = whereClause
    ? await totalQuery.where(whereClause)
    : await totalQuery;

  const total = Number(totalRow?.total ?? 0);
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

  const groupedQuery = database
    .select({
      orderId: orders.id,
      latestCreatedAt: sql<number>`coalesce(max(${payments.created_at}), ${orders.created_at})`,
    })
    .from(orders)
    .leftJoin(payments, sql`${payments.order_id} = ${orders.id}`);

  const groupedRows = await (whereClause
    ? groupedQuery.where(whereClause)
    : groupedQuery
  )
    .groupBy(orders.id)
    .orderBy(
      desc(sql`coalesce(max(${payments.created_at}), ${orders.created_at})`),
      desc(orders.id),
    )
    .limit(pageSize)
    .offset(offset);

  const orderIds = groupedRows.map((row) => String(row.orderId));

  return {
    orderIds,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: totalPages > 0 && page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
