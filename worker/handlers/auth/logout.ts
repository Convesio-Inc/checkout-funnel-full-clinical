import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { userSessions } from '../../db/schema';
import { json } from '../common';
import {
  authDbErrorResponse,
  clearSessionCookie,
  getSessionTokenFromCookie,
} from './shared';

export async function handleLogout(
  request: Request,
  env: Env,
): Promise<Response> {
  const token = getSessionTokenFromCookie(request);
  if (token) {
    try {
      await db(env).delete(userSessions).where(eq(userSessions.token, token));
    } catch (err) {
      return authDbErrorResponse(err, 'Unable to logout.');
    }
  }

  return json(
    { success: true },
    {
      headers: {
        'Set-Cookie': clearSessionCookie(),
      },
    },
  );
}
