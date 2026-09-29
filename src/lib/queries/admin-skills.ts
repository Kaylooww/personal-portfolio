import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Skill, SkillCategory } from "@/types";

export interface AdminSkillFilters {
  q?: string;
  /** A category id, or "none" for uncategorised skills. */
  category?: string;
}

export function parseSkillFilters(params: Record<string, string | string[] | undefined>): AdminSkillFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const category = one(params.category);
  return {
    q: one(params.q)?.slice(0, 100),
    category: category === "none" || /^[0-9a-f-]{36}$/i.test(category ?? "") ? category : undefined,
  };
}

export type AdminSkillCategory = SkillCategory & { skillCount: number };

/** All categories (visible or not) in display order, with how many skills each holds. */
export async function listAdminSkillCategories(): Promise<AdminSkillCategory[]> {
  const supabase = await createSupabaseServerClient();
  const [cats, skills] = await Promise.all([
    supabase.from("skill_categories").select("*").order("display_order").order("created_at"),
    supabase.from("skills").select("category_id"),
  ]);
  if (cats.error || skills.error) {
    console.error("[admin] listAdminSkillCategories", cats.error ?? skills.error);
    throw new Error("Could not load skill categories.");
  }
  return cats.data.map((c) => ({ ...c, skillCount: skills.data.filter((s) => s.category_id === c.id).length }));
}

export type AdminSkillListItem = Skill & { projectCount: number };

function sanitiseSearch(q: string): string {
  return q.replace(/[,()*%_\\"'.:]/g, " ").replace(/\s+/g, " ").trim();
}

/** Every skill in display order, filtered, with how many projects list it as a technology. */
export async function listAdminSkills(filters: AdminSkillFilters): Promise<AdminSkillListItem[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("skills").select("*, project_technologies(project_id)").order("display_order").order("created_at");
  if (filters.category === "none") query = query.is("category_id", null);
  else if (filters.category) query = query.eq("category_id", filters.category);
  const q = filters.q ? sanitiseSearch(filters.q) : "";
  if (q) query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) {
    console.error("[admin] listAdminSkills", error);
    throw new Error("Could not load skills.");
  }
  return data.map(({ project_technologies, ...skill }) => ({ ...skill, projectCount: project_technologies.length }));
}

export async function getAdminSkill(id: string): Promise<AdminSkillListItem | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("skills").select("*, project_technologies(project_id)").eq("id", id).maybeSingle();
  if (error) {
    console.error("[admin] getAdminSkill", error);
    throw new Error("Could not load the skill.");
  }
  if (!data) return null;
  const { project_technologies, ...skill } = data;
  return { ...skill, projectCount: project_technologies.length };
}
