import { and, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { userSessions, users } from '../../db/schema';
import { json, readJson } from '../common';
import {
  AUTH_EMAIL_REGEX,
  AUTH_SESSION_TTL_MS,
  type AuthLoginBody,
  authDbErrorResponse,
  buildSessionCookie,
  createSessionToken,
  hashPassword,
  invalidCredentialsResponse,
  normalizeEmail,
  requireAuthSalt,
} from './shared';

export async function handleLogin(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<AuthLoginBody>(request);
  if (!body) {
    return json({ error: true, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const salt = requireAuthSalt(env);
  if (salt instanceof Response) return salt;

  const email = normalizeEmail(body.email ?? '');
  const password = body.password ?? '';

  if (!AUTH_EMAIL_REGEX.test(email) || !password) {
    return invalidCredentialsResponse();
  }

  try {
    const passwordHash = await hashPassword(password, salt);
    const [user] = await db(env)
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(and(eq(users.email, email), eq(users.passwordHash, passwordHash)))
      .limit(1);

    if (!user) {
      return invalidCredentialsResponse();
    }

    const token = await createSessionToken(salt);
    const expiresAt = Date.now() + AUTH_SESSION_TTL_MS;

    await db(env).insert(userSessions).values({
      userId: user.id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        expires_at: expiresAt,
      },
      {
        headers: {
          'Set-Cookie': buildSessionCookie(
            token,
            Math.floor(AUTH_SESSION_TTL_MS / 1000),
          ),
        },
      },
    );
  } catch (err) {
    return authDbErrorResponse(err, 'Unable to login.');
  }
}
