import { listUsers } from '../../db/users';
import {
  readAuthenticatedSession,
  unauthorizedResponse,
} from '../auth/shared';
import {
  json,
  parseOptionalPositiveInteger,
  withPaginationHeaders,
} from '../common';

export async function handleSearchUsers(
  request: Request,
  env: Env,
): Promise<Response> {
  const session = await readAuthenticatedSession(request, env);
  if (session instanceof Response) return session;
  if (!session) return unauthorizedResponse();

  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim();
  if (!q) {
    return json(
      {
        error: true,
        message: 'A non-empty `q` query param is required.',
      },
      { status: 400 },
    );
  }

  const pageParam = parseOptionalPositiveInteger(url.searchParams.get('page'), 'page');
  if (pageParam instanceof Response) return pageParam;

  const pageSizeParam = parseOptionalPositiveInteger(
    url.searchParams.get('page_size'),
    'page_size',
  );
  if (pageSizeParam instanceof Response) return pageSizeParam;

  try {
    const result = await listUsers(env, {
      page: pageParam,
      pageSize: pageSizeParam,
      search: q,
    });

    const response = json(result);
    return withPaginationHeaders(
      response,
      url,
      {
        page: result.pagination.page,
        pageSize: result.pagination.pageSize,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
      { pageParam: 'page', pageSizeParam: 'page_size' },
    );
  } catch (err) {
    return json(
      {
        error: true,
        message: `Unable to search users: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }
}
