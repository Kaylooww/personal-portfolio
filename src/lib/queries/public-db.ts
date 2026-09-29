import "server-only";
import { createSupabasePublicClient } from "@/lib/supabase/public";

/*
 * Public reads use the cookie-less anon client: pages stay statically
 * generated, and RLS limits results to published, visible content. The
 * queries also filter explicitly, so the rules hold even if a policy changes.
 */

let client: ReturnType<typeof createSupabasePublicClient> | null = null;

/** Shared anon client — safe to reuse because it never carries a user session. */
export function publicDb() {
  client ??= createSupabasePublicClient();
  return client;
}

/** Logs the real error server-side and throws a generic one for the error boundary. */
export function queryFailed(what: string, error: unknown): never {
  console.error(`[public] failed to load ${what}`, error);
  throw new Error(`Couldn't load ${what}. Please try again shortly.`);
}
