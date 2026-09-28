import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalProjects: number | null;
  publishedProjects: number | null;
  draftProjects: number | null;
  totalSkills: number | null;
  totalMilestones: number | null;
  journeyEntries: number | null;
}

/**
 * Counts for the admin dashboard, read with the admin's own session so RLS
 * applies (the admin sees every row). A failed count shows as "—" rather than
 * breaking the page.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();
  const head = { count: "exact", head: true } as const;

  const [total, published, drafts, skills, milestones, journey] = await Promise.all([
    supabase.from("projects").select("id", head),
    supabase.from("projects").select("id", head).eq("content_state", "published"),
    supabase.from("projects").select("id", head).eq("content_state", "draft"),
    supabase.from("skills").select("id", head),
    supabase.from("milestones").select("id", head),
    supabase.from("journey_entries").select("id", head),
  ]);

  const n = (r: { count: number | null; error: unknown }) => (r.error ? null : r.count);
  return {
    totalProjects: n(total),
    publishedProjects: n(published),
    draftProjects: n(drafts),
    totalSkills: n(skills),
    totalMilestones: n(milestones),
    journeyEntries: n(journey),
  };
}
