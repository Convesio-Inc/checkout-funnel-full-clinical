import { findUserById } from '../../db/users';
import {
  readAuthenticatedSession,
  unauthorizedResponse,
} from '../auth/shared';
import { json } from '../common';

export async function handleGetUser(
  request: Request,
  env: Env,
  userId: number,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return json(
      {
        error: true,
        message: 'Invalid user id.',
      },
      { status: 400 },
    );
  }

  try {
    const user = await findUserById(env, userId);
    if (!user) {
      return json(
        { error: true, message: 'User not found.' },
        { status: 404 },
      );
    }

    return json({ user });
  } catch (err) {
    return json(
      {
        error: true,
        message: `Unable to get user: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }
}
