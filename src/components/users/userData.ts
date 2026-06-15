export type UserRole = "owner" | "admin" | "member";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  color: string;
  is_you?: boolean;
};

export type NewUserPayload = {
  name: string;
  email: string;
  role: Exclude<UserRole, "owner">;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

export const AVATAR_BACKGROUND_COLOR = "#FF6A5B";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
