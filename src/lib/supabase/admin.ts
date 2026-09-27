import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { requireSupabasePublicEnv } from "./env";

/**
 * SERVICE-ROLE client — bypasses RLS. Server-only (enforced by `server-only`).
 * Use sparingly and only after verifying the caller is the admin: seeding,
 * maintenance tasks, storage housekeeping. Never pass its results to the
 * client without filtering.
 */
export function createSupabaseAdminClient() {
  const { url } = requireSupabasePublicEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set (server-only secret; see .env.example).");
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
