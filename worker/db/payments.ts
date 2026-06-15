import { and, count, desc, eq, type SQL } from 'drizzle-orm';
import { db } from './client';
import { payments } from './schema';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface ListPaymentsFilters {
  customer_email?: string;
  order_id?: number;
  cpay_status?: string;
}

export interface ListPaymentsParams {
  page?: number;
  pageSize?: number;
  filters?: ListPaymentsFilters;
}

export interface ListPaymentsResult {
  data: Array<typeof payments.$inferSelect>;
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

function buildFilterClauses(filters: ListPaymentsFilters = {}): Array<SQL<unknown>> {
  const clauses: Array<SQL<unknown>> = [];

  if (filters.customer_email?.trim()) {
    clauses.push(eq(payments.customer_email, filters.customer_email.trim()));
  }
  if (typeof filters.order_id === 'number') {
    clauses.push(eq(payments.order_id, filters.order_id));
  }
  if (filters.cpay_status?.trim()) {
    clauses.push(eq(payments.cpay_status, filters.cpay_status.trim()));
  }

  return clauses;
}

export async function listPayments(
  env: Env,
  params: ListPaymentsParams = {},
): Promise<ListPaymentsResult> {
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);
  const offset = (page - 1) * pageSize;
  const filters = params.filters ?? {};
  const clauses = buildFilterClauses(filters);
  const whereClause = clauses.length > 0 ? and(...clauses) : undefined;
  const database = db(env);

  const [totalRow] = whereClause
    ? await database.select({ total: count() }).from(payments).where(whereClause)
    : await database.select({ total: count() }).from(payments);

  const rows = whereClause
    ? await database
        .select()
        .from(payments)
        .where(whereClause)
        .orderBy(desc(payments.created_at), desc(payments.id))
        .limit(pageSize)
        .offset(offset)
    : await database
        .select()
        .from(payments)
        .orderBy(desc(payments.created_at), desc(payments.id))
        .limit(pageSize)
        .offset(offset);

  const total = Number(totalRow?.total ?? 0);
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

  return {
    data: rows,
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
