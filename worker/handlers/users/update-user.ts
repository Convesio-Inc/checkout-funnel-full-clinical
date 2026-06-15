import { findUserById, updateUserRoleById } from '../../db/users';
import {
  forbiddenResponse,
  isManageableUserRole,
  isPrivilegedRole,
  readAuthenticatedSession,
  unauthorizedResponse,
} from '../auth/shared';
import { json, readJson } from '../common';

interface UpdateUserBody {
  role?: string;
}

export async function handleUpdateUser(
  request: Request,
  env: Env,
  userId: number,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  if (!isPrivilegedRole(session.role)) {
    return forbiddenResponse('Only owners and admins can modify users.');
  }

  if (!Number.isSafeInteger(userId) || userId < 1) {
    return json(
      { error: true, message: 'Invalid user id.' },
      { status: 400 },
    );
  }

  const body = await readJson<UpdateUserBody>(request);
  if (!body) {
    return json({ error: true, message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (Object.keys(body).some((key) => key !== 'role')) {
    return json(
      {
        error: true,
        message: 'Invalid request body. Only `role` is allowed.',
      },
      { status: 400 },
    );
  }

  const role = body.role?.trim().toLowerCase();
  if (!role) {
    return json(
      {
        error: true,
        message: '`role` is required and must be `admin` or `member`.',
      },
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
        { error: true, message: 'Owner role cannot be modified.' },
        { status: 403 },
      );
    }

    const updatedUser = await updateUserRoleById(env, userId, role);
    if (!updatedUser) {
      return json(
        { error: true, message: 'User not found.' },
        { status: 404 },
      );
    }

    return json({ success: true, user: updatedUser });
  } catch (err) {
    return json(
      {
        error: true,
        message: `Unable to update user: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }
}
