import type { ListUsersParams, UserSummary } from "../../worker/db/users";
import type { UserRole } from "../../worker/db/schema";

export type { ListUsersParams, UserSummary };

export type ManageableUserRole = Exclude<UserRole, "owner">;

export interface UsersPagination {
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export interface ListUsersResponse {
  data: UserSummary[];
  pagination: UsersPagination;
}

export interface ListUsersArgs {
  page?: ListUsersParams["page"];
  page_size?: ListUsersParams["pageSize"];
}

export interface SearchUsersArgs extends ListUsersArgs {
  q: string;
}

export interface CreateUserArgs {
  email: string;
  name?: string;
  role?: ManageableUserRole;
}

export interface GetUserResponse {
  user: UserSummary;
}

export interface UserMutationResponse {
  success: true;
  user: UserSummary;
}

function buildQueryString(args: object): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(args) as Array<[string, unknown]>) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

function readPagination(response: Response): UsersPagination {
  return {
    page: Number(response.headers.get("X-Page") ?? "1"),
    perPage: Number(response.headers.get("X-Per-Page") ?? "20"),
    totalCount: Number(response.headers.get("X-Total-Count") ?? "0"),
    totalPages: Number(response.headers.get("X-Total-Pages") ?? "0"),
  };
}

export async function getUsers(
  args: ListUsersArgs = {},
): Promise<ListUsersResponse> {
  const response = await fetch(`/users${buildQueryString(args)}`);
  const pagination = readPagination(response);
  const body = (await response.json()) as Pick<ListUsersResponse, "data">;
  return { ...body, pagination };
}

export async function searchUsers(
  args: SearchUsersArgs,
): Promise<ListUsersResponse> {
  const response = await fetch(`/users/search${buildQueryString(args)}`);
  const pagination = readPagination(response);
  const body = (await response.json()) as Pick<ListUsersResponse, "data">;
  return { ...body, pagination };
}

export async function getUser(user_id: number): Promise<GetUserResponse> {
  const response = await fetch(`/users/${user_id}`);
  return (await response.json()) as GetUserResponse;
}

export async function createUser(
  args: CreateUserArgs,
): Promise<UserMutationResponse> {
  const response = await fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  return (await response.json()) as UserMutationResponse;
}

export async function updateUserRole(
  user_id: number,
  role: ManageableUserRole,
): Promise<UserMutationResponse> {
  const response = await fetch(`/users/${user_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  return (await response.json()) as UserMutationResponse;
}

export async function deleteUser(
  user_id: number,
): Promise<UserMutationResponse> {
  const response = await fetch(`/users/${user_id}`, {
    method: "DELETE",
  });

  return (await response.json()) as UserMutationResponse;
}
