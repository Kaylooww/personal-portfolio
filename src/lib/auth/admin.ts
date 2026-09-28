import "server-only";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeAdminPath } from "./paths";

/**
 * The single admin, named by ADMIN_EMAIL. The database enforces the same rule
 * through private.admin_users + RLS; this check decides what the app renders.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && email && email.trim().toLowerCase() === admin);
}

export type AdminSession =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "forbidden"; user: User }
  | { status: "admin"; user: User };

/**
 * Verifies the session with Supabase Auth (`getUser()` hits the Auth server,
 * unlike reading the cookie). Cached per request so layout + page share one call.
 */
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  if (!isSupabaseConfigured()) return { status: "unconfigured" };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { status: "anonymous" };
  return isAdminEmail(data.user.email) ? { status: "admin", user: data.user } : { status: "forbidden", user: data.user };
});

/**
 * Gate for every protected admin page and Server Action. Redirects instead of
 * returning when the caller isn't the admin, so callers can rely on the result.
 */
export async function requireAdmin(returnTo = "/admin"): Promise<User> {
  const session = await getAdminSession();
  switch (session.status) {
    case "admin":
      return session.user;
    case "forbidden":
      redirect("/admin/unauthorized");
    case "anonymous":
    case "unconfigured":
      redirect(`/admin/login?next=${encodeURIComponent(safeAdminPath(returnTo))}`);
  }
}
