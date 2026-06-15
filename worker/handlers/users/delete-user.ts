import { deleteUserById, findUserById } from '../../db/users';
import {
  forbiddenResponse,
  isPrivilegedRole,
  readAuthenticatedSession,
  unauthorizedResponse,
} from '../auth/shared';
import { json } from '../common';

export async function handleDeleteUser(
  request: Request,
  env: Env,
  userId: number,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  if (!isPrivilegedRole(session.role)) {
    return forbiddenResponse('Only owners and admins can delete users.');
  }

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return json(
      { error: true, message: 'Invalid user id.' },
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

    if (user.role === 'owner') {
      return json(
        { error: true, message: 'Owners cannot be deleted.' },
        { status: 403 },
      );
    }

    const deletedUser = await deleteUserById(env, userId);
    if (!deletedUser) {
      return json(
        { error: true, message: 'User not found.' },
        { status: 404 },
      );
    }

    return json({ success: true, user: deletedUser });
  } catch (err) {
    return json(
      {
        error: true,
        message: `Unable to delete user: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }
}
