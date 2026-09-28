import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPublicAdminPath, safeAdminPath } from "@/lib/auth/paths";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Runs on /admin/* only. Two jobs:
 *  1. Refresh the Supabase session cookie so Server Components see a live session.
 *  2. Optimistically bounce signed-out visitors to the login page.
 * This is a convenience, not the security boundary — protected pages call
 * requireAdmin(), and RLS guards every write.
 */
export async function proxy(request: NextRequest) {
  const env = getSupabasePublicEnv();
  // Without Supabase the admin pages render their own "not configured" notice.
  if (!env) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // getClaims() validates the JWT (refreshing it if needed) — don't put logic between
  // client creation and this call, or sessions can be dropped at random.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  if (!signedIn && !isPublicAdminPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(safeAdminPath(pathname + search))}`;
    return redirectWithCookies(url, response);
  }

  return response;
}

/** Carries any refreshed auth cookies onto a redirect response. */
function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  matcher: ["/admin/:path*"],
};
