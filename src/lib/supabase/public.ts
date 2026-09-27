import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { requireSupabasePublicEnv } from "./env";

/**
 * Cookie-less anon client for public reads (Phase 14). Because it never touches
 * the request, pages that use it can still be statically generated and cached;
 * RLS guarantees it only ever sees published, visible content.
 */
export function createSupabasePublicClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
