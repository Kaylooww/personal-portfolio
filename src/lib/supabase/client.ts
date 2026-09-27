"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { requireSupabasePublicEnv } from "./env";

/**
 * Browser client (anon key + the user's session cookie). Use only in Client
 * Components that genuinely need it — e.g. the admin login form (Phase 10).
 * All public reads happen on the server.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
