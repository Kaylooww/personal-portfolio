/**
 * Public Supabase settings. `NEXT_PUBLIC_*` values are inlined at build time,
 * so they must be read with literal `process.env.X` access (no dynamic keys).
 */
export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

/** True once `.env.local` (or Vercel env) has the project URL and anon key. */
export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}

export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }
  return env;
}

/** Storage bucket for all portfolio media. Must match supabase/migrations/*_storage.sql. */
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-media";
