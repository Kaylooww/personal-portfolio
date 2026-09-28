import "server-only";
import { CONTENT_STATES, PROJECT_STATUSES } from "@/lib/constants/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentState, Project, ProjectImage, ProjectStatus, Skill } from "@/types";

export interface AdminProjectFilters {
  q?: string;
  state?: ContentState;
  status?: ProjectStatus;
}

export type AdminProjectListItem = Pick<
  Project,
  "id" | "title" | "slug" | "short_description" | "thumbnail_url" | "status" | "content_state" | "featured" | "is_visible" | "display_order" | "updated_at"
>;

export function parseProjectFilters(params: Record<string, string | string[] | undefined>): AdminProjectFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const state = one(params.state);
  const status = one(params.status);
  return {
    q: one(params.q)?.slice(0, 100),
    state: CONTENT_STATES.find((s) => s === state),
    status: PROJECT_STATUSES.find((s) => s === status),
  };
}

/** Characters that would break a PostgREST `or=(…)` filter or act as LIKE wildcards. */
function sanitiseSearch(q: string): string {
  return q.replace(/[,()*%_\\"'.:]/g, " ").replace(/\s+/g, " ").trim();
}

/** Every project (any state), in display order, filtered for the admin list. */
export async function listAdminProjects(filters: AdminProjectFilters): Promise<AdminProjectListItem[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("projects")
    .select("id, title, slug, short_description, thumbnail_url, status, content_state, featured, is_visible, display_order, updated_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (filters.state) query = query.eq("content_state", filters.state);
  if (filters.status) query = query.eq("status", filters.status);
  const q = filters.q ? sanitiseSearch(filters.q) : "";
  if (q) query = query.or(`title.ilike.%${q}%,short_description.ilike.%${q}%,slug.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) {
    console.error("[admin] listAdminProjects", error);
    throw new Error("Could not load projects.");
  }
  return data;
}

export interface AdminProjectDetail {
  project: Project;
  technologyIds: string[];
  images: ProjectImage[];
}

export async function getAdminProject(id: string): Promise<AdminProjectDetail | null> {
  const supabase = await createSupabaseServerClient();
  const [projectRes, techRes, imageRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_technologies").select("skill_id, display_order").eq("project_id", id).order("display_order"),
    supabase.from("project_images").select("*").eq("project_id", id).order("display_order"),
  ]);
  if (projectRes.error || techRes.error || imageRes.error) {
    console.error("[admin] getAdminProject", projectRes.error ?? techRes.error ?? imageRes.error);
    throw new Error("Could not load the project.");
  }
  if (!projectRes.data) return null;
  return {
    project: projectRes.data,
    technologyIds: techRes.data.map((t) => t.skill_id),
    images: imageRes.data,
  };
}

export type SkillOption = Pick<Skill, "id" | "name" | "slug" | "logo_url"> & { category: string | null };

/** All skills (visible or not) for the technology picker, grouped by category name. */
export async function listSkillOptions(): Promise<SkillOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, slug, logo_url, display_order, skill_categories(name, display_order)")
    .order("display_order");
  if (error) {
    console.error("[admin] listSkillOptions", error);
    throw new Error("Could not load skills.");
  }
  const categoryOrder = (s: (typeof data)[number]) => s.skill_categories?.display_order ?? Number.MAX_SAFE_INTEGER;
  return [...data]
    .sort((a, b) => categoryOrder(a) - categoryOrder(b))
    .map((s) => ({ id: s.id, name: s.name, slug: s.slug, logo_url: s.logo_url, category: s.skill_categories?.name ?? null }));
}
