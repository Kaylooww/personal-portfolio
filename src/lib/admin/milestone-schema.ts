import "server-only";
import type { ServerSupabase } from "./helpers";

/** The owner's live database may still be on the original milestone schema. */
export function isMissingMilestoneDocumentColumn(error: { code?: string; message?: string } | null): boolean {
  return (error?.code === "42703" || error?.code === "PGRST204")
    && /\b(date_display|pdf_url)\b/i.test(error.message ?? "");
}

export async function checkMilestoneDocumentFields(supabase: ServerSupabase) {
  const { error } = await supabase.from("milestones").select("date_display, pdf_url").limit(1);
  if (!error) return { available: true, error: null };
  if (isMissingMilestoneDocumentColumn(error)) return { available: false, error: null };
  return { available: false, error };
}
