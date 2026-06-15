export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...init.headers,
    },
  });
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export async function readJsonFromResponse<T>(
  response: Response,
): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function parseOptionalPositiveInteger(
  value: string | null,
  field: string,
): number | Response | undefined {
  if (value == null || value.trim() === '') return undefined;
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) {
    return json(
      {
        error: true,
        message: `Invalid \`${field}\` query param. Use a positive integer.`,
      },
      { status: 400 },
    );
  }

  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return json(
      {
        error: true,
        message: `Invalid \`${field}\` query param. Use a positive integer.`,
      },
      { status: 400 },
    );
  }

  return parsed;
}

export function parseOptionalBoolean(
  value: string | null,
  field: string,
): boolean | Response | undefined {
  if (value == null || value.trim() === '') return undefined;

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;

  return json(
    {
      error: true,
      message: `Invalid \`${field}\` query param. Use true/false or 1/0.`,
    },
    { status: 400 },
  );
}

export function parseOptionalYesNo(
  value: string | null,
  field: string,
): 'Y' | 'N' | Response | undefined {
  if (value == null || value.trim() === '') return undefined;

  const normalized = value.trim().toUpperCase();
  if (normalized === 'Y' || normalized === 'N') return normalized;

  return json(
    {
      error: true,
      message: `Invalid \`${field}\` query param. Use Y or N.`,
    },
    { status: 400 },
  );
}

export interface PaginationHeaders {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface PaginationHeaderOptions {
  pageParam?: string;
  pageSizeParam?: string;
}

function buildPaginatedLink(
  requestUrl: URL,
  page: number,
  pageSize: number,
  options: PaginationHeaderOptions = {},
): string {
  const pageParam = options.pageParam ?? 'page';
  const pageSizeParam = options.pageSizeParam ?? 'page_size';
  const pageUrl = new URL(requestUrl.toString());
  pageUrl.searchParams.set(pageParam, String(page));
  pageUrl.searchParams.set(pageSizeParam, String(pageSize));
  return pageUrl.toString();
}

export function withPaginationHeaders(
  response: Response,
  requestUrl: URL,
  pagination: PaginationHeaders,
  options: PaginationHeaderOptions = {},
): Response {
  response.headers.set('X-Total-Count', String(pagination.total));
  response.headers.set('X-Page', String(pagination.page));
  response.headers.set('X-Per-Page', String(pagination.pageSize));
  response.headers.set('X-Total-Pages', String(pagination.totalPages));

  if (pagination.totalPages <= 0) {
    response.headers.delete('Link');
    return response;
  }

  const links: string[] = [];
  links.push(
    `<${buildPaginatedLink(requestUrl, 1, pagination.pageSize, options)}>; rel="first"`,
  );

  if (pagination.page > 1) {
    links.push(
      `<${buildPaginatedLink(
        requestUrl,
        pagination.page - 1,
        pagination.pageSize,
        options,
      )}>; rel="prev"`,
    );
  }

  if (pagination.page < pagination.totalPages) {
    links.push(
      `<${buildPaginatedLink(
        requestUrl,
        pagination.page + 1,
        pagination.pageSize,
        options,
      )}>; rel="next"`,
    );
  }

  links.push(
    `<${buildPaginatedLink(
      requestUrl,
      pagination.totalPages,
      pagination.pageSize,
      options,
    )}>; rel="last"`,
  );

  response.headers.set('Link', links.join(', '));
  return response;
}
