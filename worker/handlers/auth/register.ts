import { count } from 'drizzle-orm';
import { db } from '../../db/client';
import { type UserRole, users } from '../../db/schema';
import { json, readJson } from '../common';
import {
  AUTH_EMAIL_REGEX,
  AUTH_PASSWORD_MIN_LENGTH,
  type AuthRegisterBody,
  authDbErrorResponse,
  hashPassword,
  isUniqueEmailViolation,
  normalizeEmail,
  requireAuthSalt,
} from './shared';

export async function handleRegister(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<AuthRegisterBody>(request);
  if (!body) {
    return json({ error: true, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const salt = requireAuthSalt(env);
  if (salt instanceof Response) return salt;

  const email = normalizeEmail(body.email ?? '');
  const password = body.password ?? '';
  const name =
    body.name?.trim() || email.split('@')[0] || `user-${crypto.randomUUID()}`;

  if (!AUTH_EMAIL_REGEX.test(email)) {
    return json(
      { error: true, message: 'A valid `email` is required.' },
      { status: 400 },
    );
  }

  if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
    return json(
      {
        error: true,
        message: `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  try {
    const [totalUsersRow] = await db(env)
      .select({ total: count() })
      .from(users);
    const role: UserRole = Number(totalUsersRow?.total ?? 0) === 0 ? 'owner' : 'member';

    const passwordHash = await hashPassword(password, salt);
    await db(env).insert(users).values({
      email,
      passwordHash,
      name,
      role,
      createdAt: Date.now(),
    });
    return json({ success: true, user: { email, name, role } }, { status: 201 });
  } catch (err) {
    if (isUniqueEmailViolation(err)) {
      return json(
        { error: true, message: 'User with this email already exists.' },
        { status: 409 },
      );
    }
    return authDbErrorResponse(err, 'Unable to create user.');
  }
}
