import "server-only";
import type { z } from "zod";
import { MEDIA_BUCKET, storagePathFromPublicUrl } from "@/lib/storage/media";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

/*
 * Shared plumbing for admin Server Actions. Deliberately NOT a "use server"
 * module: exporting these from one would expose them as callable endpoints.
 */

export type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/** Tables whose rows carry a `display_order`. */
export type OrderedTable =
  | "projects"
  | "project_images"
  | "skills"
  | "skill_categories"
  | "about_cards"
  | "journey_entries"
  | "milestones"
  | "milestone_categories"
  | "social_links";

/** First message per field path, for React Hook Form's setError. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Best-effort removal of files we host; external URLs are ignored. */
export async function removeStoredFiles(supabase: ServerSupabase, urls: (string | null | undefined)[]) {
  const paths = urls.map(storagePathFromPublicUrl).filter((p): p is string => p !== null);
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.error("[admin] storage cleanup failed", error);
}

/** Rewrites display_order as 1..n in the given id order. Returns the first error, if any. */
export async function renumber(supabase: ServerSupabase, table: OrderedTable, ids: string[]) {
  const results = await Promise.all(ids.map((id, i) => supabase.from(table).update({ display_order: i + 1 }).eq("id", id)));
  return results.find((r) => r.error)?.error ?? null;
}

/** Tables with an `is_visible` flag. */
export type VisibleTable = Exclude<OrderedTable, "project_images">;

/** Sets is_visible; `found` is false when no row matched. */
export async function setVisibility(supabase: ServerSupabase, table: VisibleTable, id: string, visible: boolean) {
  const { data, error } = await supabase.from(table).update({ is_visible: visible }).eq("id", id).select("id");
  return { error, found: (data?.length ?? 0) > 0 };
}

/** Deletes one row by id; `found` is false when no row matched. */
export async function deleteById(supabase: ServerSupabase, table: OrderedTable, id: string) {
  const { data, error } = await supabase.from(table).delete().eq("id", id).select("id");
  return { error, found: (data?.length ?? 0) > 0 };
}

/** display_order for a new row: one past the current maximum. */
export async function nextDisplayOrder(supabase: ServerSupabase, table: OrderedTable) {
  const { data, error } = await supabase.from(table).select("display_order").order("display_order", { ascending: false }).limit(1);
  return { order: (data?.[0]?.display_order ?? 0) + 1, error };
}

/** Moves a row one place in a flat ordered list, then renumbers the list 1..n. */
export async function moveRow(supabase: ServerSupabase, table: OrderedTable, id: string, dir: "up" | "down") {
  const { data, error } = await supabase.from(table).select("id").order("display_order").order("created_at");
  if (error) return error;
  const ids = swapInOrder(
    data.map((r) => r.id),
    id,
    dir,
  );
  return ids ? renumber(supabase, table, ids) : null;
}

/**
 * Moves a row within its category (how the public pages group skills and
 * milestones), then renumbers the whole table so display_order stays gap-free.
 */
export async function moveRowInCategory(supabase: ServerSupabase, table: "skills" | "milestones", id: string, dir: "up" | "down") {
  const { data, error } = await supabase.from(table).select("id, category_id").order("display_order").order("created_at");
  if (error) return error;
  const me = data.find((r) => r.id === id);
  if (!me) return null;
  const siblings = data.filter((r) => r.category_id === me.category_id).map((r) => r.id);
  const reordered = swapInOrder(siblings, id, dir);
  if (!reordered) return null;
  const queue = [...reordered];
  const all = data.map((r) => (r.category_id === me.category_id ? queue.shift()! : r.id));
  return renumber(supabase, table, all);
}

/**
 * Swaps `id` with its neighbour inside `ids` (already in display order).
 * Returns the new order, or null when the move is out of range.
 */
export function swapInOrder(ids: string[], id: string, dir: "up" | "down"): string[] | null {
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= ids.length) return null;
  const next = [...ids];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}
