import { json } from '../common';
import { readAuthenticatedSession, unauthorizedResponse } from './shared';

export async function handleSession(
  request: Request,
  env: Env,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  return json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    expires_at: session.expiresAt,
  });
}
