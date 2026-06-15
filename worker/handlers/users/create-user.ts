import { createUser } from '../../db/users';
import {
  AUTH_EMAIL_REGEX,
  forbiddenResponse,
  hashPassword,
  isManageableUserRole,
  isPrivilegedRole,
  isUniqueEmailViolation,
  normalizeEmail,
  readAuthenticatedSession,
  requireAuthSalt,
  unauthorizedResponse,
} from '../auth/shared';
import { json, readJson } from '../common';

interface CreateUserBody {
  email?: string;
  name?: string;
  role?: string;
}

const GENERATED_PASSWORD_CHARSET =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+';
const GENERATED_PASSWORD_LENGTH = 16;

function generateRandomPassword(length = GENERATED_PASSWORD_LENGTH): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let password = '';
  for (let index = 0; index < length; index += 1) {
    password += GENERATED_PASSWORD_CHARSET[
      bytes[index] % GENERATED_PASSWORD_CHARSET.length
    ];
  }

  return password;
}

export async function handleCreateUser(
  request: Request,
  env: Env,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  if (!isPrivilegedRole(session.role)) {
    return forbiddenResponse('Only owners and admins can create users.');
  }

  const body = await readJson<CreateUserBody>(request);
  if (!body) {
    return json({ error: true, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? '');
  const password = generateRandomPassword();
  const role = body.role?.trim().toLowerCase() ?? 'member';
  const name =
    body.name?.trim() || email.split('@')[0] || `user-${crypto.randomUUID()}`;

  if (!AUTH_EMAIL_REGEX.test(email)) {
    return json(
      { error: true, message: 'A valid `email` is required.' },
      { status: 400 },
    );
  }

  if (!isManageableUserRole(role)) {
    return json(
      {
        error: true,
        message: 'Invalid `role`. Use `admin` or `member`.',
      },
      { status: 400 },
    );
  }

  const salt = requireAuthSalt(env);
  if (salt instanceof Response) return salt;

  try {
    const passwordHash = await hashPassword(password, salt);
    const user = await createUser(env, {
      email,
      passwordHash,
      name,
      role,
    });

    return json(
      {
        success: true,
        user
      },
      { status: 201 },
    );
  } catch (err) {
    if (isUniqueEmailViolation(err)) {
      return json(
        { error: true, message: 'User with this email already exists.' },
        { status: 409 },
      );
    }

    return json(
      {
        error: true,
        message: `Unable to create user: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }
}
