import { and, eq, gt, lte, or } from 'drizzle-orm';
import { db } from '../../db/client';
import { type UserRole, userSessions, users } from '../../db/schema';
import { json, readJsonFromResponse } from '../common';

export const AUTH_COOKIE_NAME = 'fc_auth_session';
const AUTH_OAUTH_STATE_COOKIE_NAME = 'fc_auth_oauth_state';
const AUTH_OAUTH_NEXT_COOKIE_NAME = 'fc_auth_oauth_next';
export const AUTH_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const AUTH_OAUTH_TTL_SECONDS = 10 * 60;
const AUTH_DEFAULT_NEXT_PATH = '/orders';
export const AUTH_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const AUTH_PASSWORD_MIN_LENGTH = 8;
export const USER_ROLES = ['owner', 'admin', 'member'] as const;
export const MANAGEABLE_USER_ROLES = ['admin', 'member'] as const;

export type ManageableUserRole = (typeof MANAGEABLE_USER_ROLES)[number];

export interface AuthRegisterBody {
  email?: string;
  password?: string;
  name?: string;
}

export interface AuthLoginBody {
  email?: string;
  password?: string;
}

export interface AuthSessionRow {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  token: string;
  expiresAt: number;
}

interface GoogleTokenExchangeResponse {
  access_token?: string;
}

interface GoogleUserInfoResponse {
  email?: string;
  email_verified?: boolean;
  name?: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function requireAuthSalt(env: Env): Response | string {
  const salt = env.AUTH_SALT?.trim();
  if (!salt) {
    return json(
      {
        error: true,
        message:
          'Worker is missing AUTH_SALT. Set it via `wrangler secret put AUTH_SALT`.',
      },
      { status: 500 },
    );
  }
  return salt;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function randomTokenHex(bytes = 24): string {
  const entropy = new Uint8Array(bytes);
  crypto.getRandomValues(entropy);
  return toHex(entropy);
}

async function sha512Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-512', encoded);
  return toHex(new Uint8Array(hash));
}

export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  return sha512Hex(`${salt}:${password}`);
}

export async function createSessionToken(salt: string): Promise<string> {
  const entropy = new Uint8Array(32);
  crypto.getRandomValues(entropy);
  return sha512Hex(`${salt}:${Date.now()}:${toHex(entropy)}`);
}

function buildCookie(name: string, value: string, maxAgeSeconds: number): string {
  return `${name}=${encodeURIComponent(
    value,
  )}; Max-Age=${maxAgeSeconds}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

function clearCookie(name: string): string {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

export function buildSessionCookie(token: string, maxAgeSeconds: number): string {
  return buildCookie(AUTH_COOKIE_NAME, token, maxAgeSeconds);
}

export function clearSessionCookie(): string {
  return clearCookie(AUTH_COOKIE_NAME);
}

function buildOAuthStateCookie(state: string): string {
  return buildCookie(AUTH_OAUTH_STATE_COOKIE_NAME, state, AUTH_OAUTH_TTL_SECONDS);
}

function clearOAuthStateCookie(): string {
  return clearCookie(AUTH_OAUTH_STATE_COOKIE_NAME);
}

function buildOAuthNextCookie(nextPath: string): string {
  return buildCookie(AUTH_OAUTH_NEXT_COOKIE_NAME, nextPath, AUTH_OAUTH_TTL_SECONDS);
}

function clearOAuthNextCookie(): string {
  return clearCookie(AUTH_OAUTH_NEXT_COOKIE_NAME);
}

function sanitizeNextPath(raw: string | null | undefined): string {
  const candidate = raw?.trim();
  if (!candidate) return AUTH_DEFAULT_NEXT_PATH;
  if (!candidate.startsWith('/')) return AUTH_DEFAULT_NEXT_PATH;
  if (candidate.startsWith('//')) return AUTH_DEFAULT_NEXT_PATH;
  return candidate;
}

function getCookie(request: Request, key: string): string | null {
  const raw = request.headers.get('Cookie');
  if (!raw) return null;

  const pairs = raw.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name === key) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
}

function errorText(err: unknown): string {
  const messages: string[] = [];
  let current: unknown = err;

  for (let i = 0; i < 4; i += 1) {
    if (typeof current === 'string') {
      messages.push(current);
      break;
    }

    if (!(current instanceof Error)) {
      break;
    }

    messages.push(current.message);
    current = (current as Error & { cause?: unknown }).cause;
    if (!current) break;
  }

  return messages.join(' | ');
}

export function isUniqueEmailViolation(err: unknown): boolean {
  return errorText(err).includes('UNIQUE constraint failed: users.email');
}

function isMissingAuthTablesError(err: unknown): boolean {
  const message = errorText(err);
  return (
    message.includes('no such table: users') ||
    message.includes('no such table: user_sessions') ||
    message.includes('no such column: users.role')
  );
}

function authTablesMissingResponse(): Response {
  return json(
    {
      error: true,
      message:
        'Auth tables are missing or outdated. Ensure `users` has a `role` column and `user_sessions` exists in D1 before using auth routes.',
    },
    { status: 500 },
  );
}

export function authDbErrorResponse(
  err: unknown,
  fallbackMessage: string,
): Response {
  if (isMissingAuthTablesError(err)) {
    return authTablesMissingResponse();
  }

  return json(
    {
      error: true,
      message: `${fallbackMessage} ${err instanceof Error ? err.message : String(err)}`,
    },
    { status: 500 },
  );
}

export function invalidCredentialsResponse(): Response {
  return json(
    { error: true, message: 'Invalid email or password.' },
    { status: 401 },
  );
}

export function unauthorizedResponse(): Response {
  return json(
    { error: true, message: 'Authentication error.' },
    {
      status: 401,
      headers: {
        'Set-Cookie': clearSessionCookie(),
      },
    },
  );
}

export function forbiddenResponse(message = 'Permission denied.'): Response {
  return json(
    { error: true, message },
    { status: 403 },
  );
}

export function isPrivilegedRole(role: UserRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function isManageableUserRole(role: string): role is ManageableUserRole {
  return MANAGEABLE_USER_ROLES.includes(role as ManageableUserRole);
}

function redirect(location: string, setCookies: string[] = []): Response {
  const headers = new Headers({
    Location: location,
    'Cache-Control': 'no-store',
  });
  for (const cookie of setCookies) {
    headers.append('Set-Cookie', cookie);
  }
  return new Response(null, { status: 302, headers });
}

function oauthCleanupCookies(): string[] {
  return [clearOAuthStateCookie(), clearOAuthNextCookie()];
}

function oauthErrorRedirect(
  code: string,
  setCookies: string[] = oauthCleanupCookies(),
): Response {
  return redirect(`/login?oauth_error=${encodeURIComponent(code)}`, setCookies);
}

function requireGoogleClientId(env: Env): Response | string {
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  if (!clientId) {
    return json(
      {
        error: true,
        message:
          'Worker is missing GOOGLE_OAUTH_CLIENT_ID. Set it via `wrangler secret put GOOGLE_OAUTH_CLIENT_ID`.',
      },
      { status: 500 },
    );
  }
  return clientId;
}

function requireGoogleClientSecret(env: Env): Response | string {
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  if (!clientSecret) {
    return json(
      {
        error: true,
        message:
          'Worker is missing GOOGLE_OAUTH_CLIENT_SECRET. Set it via `wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET`.',
      },
      { status: 500 },
    );
  }
  return clientSecret;
}

export async function readAuthenticatedSession(
  request: Request,
  env: Env,
): Promise<Response | AuthSessionRow | null> {
  const token = getCookie(request, AUTH_COOKIE_NAME);
  if (!token) return null;

  try {
    const now = Date.now();
    const [row] = await db(env)
      .select({
        userId: userSessions.userId,
        token: userSessions.token,
        expiresAt: userSessions.expiresAt,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(userSessions)
      .innerJoin(users, eq(users.id, userSessions.userId))
      .where(and(eq(userSessions.token, token), gt(userSessions.expiresAt, now)))
      .limit(1);

    if (row) return row;

    await db(env)
      .delete(userSessions)
      .where(or(eq(userSessions.token, token), lte(userSessions.expiresAt, now)));
    return null;
  } catch (err) {
    return authDbErrorResponse(err, 'Unable to validate auth session.');
  }
}

export async function handleGoogleStart(
  request: Request,
  env: Env,
): Promise<Response> {
  const clientId = requireGoogleClientId(env);
  if (clientId instanceof Response) return clientId;

  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get('next'));
  const state = randomTokenHex(24);
  const callbackUrl = `${url.origin}/auth/google/callback`;

  const authorizeUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'openid email profile');
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('prompt', 'select_account');

  return redirect(authorizeUrl.toString(), [
    buildOAuthStateCookie(state),
    buildOAuthNextCookie(nextPath),
  ]);
}

export async function handleGoogleCallback(
  request: Request,
  env: Env,
): Promise<Response> {
  const clientId = requireGoogleClientId(env);
  if (clientId instanceof Response) return clientId;

  const clientSecret = requireGoogleClientSecret(env);
  if (clientSecret instanceof Response) return clientSecret;

  const salt = requireAuthSalt(env);
  if (salt instanceof Response) return salt;

  const url = new URL(request.url);
  const upstreamError = url.searchParams.get('error')?.trim();
  if (upstreamError) {
    return oauthErrorRedirect('google_denied');
  }

  const code = url.searchParams.get('code')?.trim();
  const state = url.searchParams.get('state')?.trim();
  const expectedState = getCookie(request, AUTH_OAUTH_STATE_COOKIE_NAME);
  const nextPath = sanitizeNextPath(
    getCookie(request, AUTH_OAUTH_NEXT_COOKIE_NAME),
  );

  const cleanupCookies = oauthCleanupCookies();
  if (!code || !state || !expectedState || state !== expectedState) {
    return oauthErrorRedirect('invalid_state', cleanupCookies);
  }

  const callbackUrl = `${url.origin}/auth/google/callback`;
  const tokenExchangeBody = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: callbackUrl,
    grant_type: 'authorization_code',
  });

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: tokenExchangeBody.toString(),
    });
  } catch {
    return oauthErrorRedirect('token_exchange_failed', cleanupCookies);
  }

  const tokenPayload =
    await readJsonFromResponse<GoogleTokenExchangeResponse>(tokenResponse);
  const accessToken = tokenPayload?.access_token?.trim();
  if (!tokenResponse.ok || !accessToken) {
    return oauthErrorRedirect('token_exchange_failed', cleanupCookies);
  }

  let profileResponse: Response;
  try {
    profileResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );
  } catch {
    return oauthErrorRedirect('profile_lookup_failed', cleanupCookies);
  }

  const profile = await readJsonFromResponse<GoogleUserInfoResponse>(profileResponse);
  const email = normalizeEmail(profile?.email ?? '');
  if (!profileResponse.ok || !AUTH_EMAIL_REGEX.test(email)) {
    return oauthErrorRedirect('profile_lookup_failed', cleanupCookies);
  }

  if (!profile?.email_verified) {
    return oauthErrorRedirect('email_not_verified', cleanupCookies);
  }

  const name =
    profile.name?.trim() || email.split('@')[0] || `user-${crypto.randomUUID()}`;

  let userId: number;
  try {
    const [existingUser] = await db(env)
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      return oauthErrorRedirect('no_access', cleanupCookies);
    }

    userId = existingUser.id;
    if (existingUser.name !== name) {
      await db(env).update(users).set({ name }).where(eq(users.id, userId));
    }
  } catch {
    return oauthErrorRedirect('auth_failed', cleanupCookies);
  }

  const token = await createSessionToken(salt);
  const expiresAt = Date.now() + AUTH_SESSION_TTL_MS;
  try {
    await db(env).insert(userSessions).values({
      userId,
      token,
      expiresAt,
      createdAt: Date.now(),
    });
  } catch {
    return oauthErrorRedirect('session_failed', cleanupCookies);
  }

  return redirect(nextPath, [
    buildSessionCookie(token, Math.floor(AUTH_SESSION_TTL_MS / 1000)),
    ...cleanupCookies,
  ]);
}

export function getSessionTokenFromCookie(request: Request): string | null {
  return getCookie(request, AUTH_COOKIE_NAME);
}
