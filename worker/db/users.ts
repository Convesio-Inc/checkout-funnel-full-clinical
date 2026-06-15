import { and, count, desc, eq, or, sql, type SQL } from 'drizzle-orm';
import { db } from './client';
import { type UserRole, userSessions, users } from './schema';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MANAGEABLE_ROLES = ['admin', 'member'] as const;

type ManageableUserRole = (typeof MANAGEABLE_ROLES)[number];

function isManageableUserRole(role: string): role is ManageableUserRole {
  return MANAGEABLE_ROLES.includes(role as ManageableUserRole);
}

function manageableRoleWhereClause(): SQL<unknown> {
  return or(eq(users.role, 'admin'), eq(users.role, 'member')) as SQL<unknown>;
}

export interface UserSummary {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
}

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ListUsersResult {
  data: Array<UserSummary>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateUserParams {
  email: string;
  name: string;
  passwordHash: string;
  role: ManageableUserRole;
}

function normalizePage(value: number | undefined): number {
  if (!Number.isInteger(value) || (value ?? 0) < 1) return DEFAULT_PAGE;
  return value as number;
}

function normalizePageSize(value: number | undefined): number {
  if (!Number.isInteger(value) || (value ?? 0) < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(value as number, MAX_PAGE_SIZE);
}

function buildWhereClauses(search: string | undefined): Array<SQL<unknown>> {
  const clauses: Array<SQL<unknown>> = [];
  const normalizedSearch = search?.trim().toLowerCase();

  if (normalizedSearch) {
    const pattern = `%${normalizedSearch}%`;
    clauses.push(
      or(
        sql`lower(${users.name}) like ${pattern}`,
        sql`lower(${users.email}) like ${pattern}`,
      ) as SQL<unknown>,
    );
  }

  return clauses;
}

function baseUserSelection() {
  return {
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
    createdAt: users.createdAt,
  };
}

export async function listUsers(
  env: Env,
  params: ListUsersParams = {},
): Promise<ListUsersResult> {
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);
  const offset = (page - 1) * pageSize;

  const clauses = buildWhereClauses(params.search);
  const whereClause = clauses.length > 0 ? and(...clauses) : undefined;
  const database = db(env);

  const [totalRow] = whereClause
    ? await database.select({ total: count() }).from(users).where(whereClause)
    : await database.select({ total: count() }).from(users);

  const rows = whereClause
    ? await database
        .select(baseUserSelection())
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt), desc(users.id))
        .limit(pageSize)
        .offset(offset)
    : await database
        .select(baseUserSelection())
        .from(users)
        .orderBy(desc(users.createdAt), desc(users.id))
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

export async function findUserById(
  env: Env,
  userId: number,
): Promise<UserSummary | null> {
  const [user] = await db(env)
    .select(baseUserSelection())
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function createUser(
  env: Env,
  params: CreateUserParams,
): Promise<UserSummary> {
  if (!isManageableUserRole(params.role)) {
    throw new Error('Invalid role for user creation.');
  }

  await db(env)
    .insert(users)
    .values({
      email: params.email,
      passwordHash: params.passwordHash,
      name: params.name,
      role: params.role,
      createdAt: Date.now(),
    });

  const [createdUser] = await db(env)
    .select(baseUserSelection())
    .from(users)
    .where(eq(users.email, params.email))
    .limit(1);

  if (!createdUser) {
    throw new Error('Unable to load the created user.');
  }

  return createdUser;
}

export async function deleteUserById(
  env: Env,
  userId: number,
): Promise<UserSummary | null> {
  const existingUser = await findUserById(env, userId);
  if (!existingUser) return null;

  await db(env).delete(userSessions).where(eq(userSessions.userId, userId));
  await db(env)
    .delete(users)
    .where(and(eq(users.id, userId), manageableRoleWhereClause()));

  const stillExists = await findUserById(env, userId);
  if (stillExists) return null;

  return existingUser;
}

export async function updateUserRoleById(
  env: Env,
  userId: number,
  role: ManageableUserRole,
): Promise<UserSummary | null> {
  if (!isManageableUserRole(role)) {
    throw new Error('Invalid role for user update.');
  }

  await db(env)
    .update(users)
    .set({ role })
    .where(and(eq(users.id, userId), manageableRoleWhereClause()));

  const updatedUser = await findUserById(env, userId);
  if (!updatedUser) return null;
  if (updatedUser.role !== role) return null;

  return updatedUser;
}
