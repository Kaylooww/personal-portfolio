/**
 * Only same-site admin paths are allowed as post-login destinations, so a
 * crafted `?next=https://evil.example` or `?next=//evil.example` can't turn
 * the login page into an open redirect.
 */
export function safeAdminPath(candidate: string | null | undefined): string {
  if (!candidate) return "/admin";
  if (!candidate.startsWith("/admin") || candidate.startsWith("//") || candidate.includes("\\") || candidate.includes("..")) return "/admin";
  if (candidate.startsWith("/admin/login") || candidate.startsWith("/admin/unauthorized")) return "/admin";
  return candidate;
}

/** Routes under /admin that anyone may open. */
export const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/unauthorized"] as const;

export function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
