import "server-only";
import { cache } from "react";
import type { ProjectWithRelations, Skill } from "@/types";
import { publicDb, queryFailed } from "./public-db";

/*
 * Public rule: content_state = 'published' AND is_visible. RLS enforces the
 * same; technologies whose skill is hidden come back as null and are dropped.
 */

const SELECT = "*, project_technologies(display_order, skills(*)), project_images(*)";

type Row = Awaited<ReturnType<typeof baseQuery>>["data"] extends (infer R)[] | null ? R : never;

function baseQuery() {
  return publicDb().from("projects").select(SELECT).eq("content_state", "published").eq("is_visible", true);
}

function toProject(row: Row): ProjectWithRelations {
  const { project_technologies, project_images, ...project } = row;
  return {
    ...project,
    technologies: [...project_technologies]
      .sort((a, b) => a.display_order - b.display_order)
      .map((t) => t.skills)
      .filter((s): s is Skill => s !== null),
    images: [...project_images].sort((a, b) => a.display_order - b.display_order),
  };
}

/** Published projects, featured first, then manual display order. */
export const getPublishedProjects = cache(async (): Promise<ProjectWithRelations[]> => {
  const { data, error } = await baseQuery().order("featured", { ascending: false }).order("display_order");
  if (error) queryFailed("projects", error);
  return data.map(toProject);
});

/** A single published project, or null (drafts, archived and hidden are treated as missing). */
export const getPublishedProjectBySlug = cache(async (slug: string): Promise<ProjectWithRelations | null> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const { data, error } = await baseQuery().eq("slug", slug).maybeSingle();
  if (error) queryFailed("the project", error);
  return data ? toProject(data) : null;
});

/** Lightweight discovery/order query; no descriptions, galleries or technology joins. */
export const getPublishedProjectIndex = cache(async () => {
  const { data, error } = await publicDb().from("projects").select("id, slug")
    .eq("content_state", "published").eq("is_visible", true).order("featured", { ascending: false }).order("display_order");
  if (error) queryFailed("project index", error);
  return data;
});
