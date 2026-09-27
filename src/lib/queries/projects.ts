import "server-only";
import { MOCK_PROJECT_IMAGES, MOCK_PROJECT_TECHNOLOGIES, MOCK_PROJECTS } from "@/lib/mock/projects";
import type { Project, ProjectWithRelations } from "@/types";
import { getSkillsById } from "./skills";

/** Public rule: published AND visible. RLS enforces the same once Supabase lands. */
function isPublic(p: Project): boolean {
  return p.content_state === "published" && p.is_visible;
}

async function withRelations(projects: Project[]): Promise<ProjectWithRelations[]> {
  const skills = await getSkillsById();
  return projects.map((p) => ({
    ...p,
    technologies: MOCK_PROJECT_TECHNOLOGIES.filter((t) => t.project_id === p.id)
      .sort((a, b) => a.display_order - b.display_order)
      .flatMap((t) => {
        const skill = skills.get(t.skill_id);
        return skill ? [skill] : [];
      }),
    images: MOCK_PROJECT_IMAGES.filter((i) => i.project_id === p.id).sort((a, b) => a.display_order - b.display_order),
  }));
}

/** Published projects in display order. Swaps to Supabase in Phase 14. */
export async function getPublishedProjects(): Promise<ProjectWithRelations[]> {
  return withRelations(MOCK_PROJECTS.filter(isPublic).sort((a, b) => a.display_order - b.display_order));
}

/** A single published project, or null (drafts and archived are treated as missing). */
export async function getPublishedProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  const project = MOCK_PROJECTS.find((p) => p.slug === slug && isPublic(p));
  if (!project) return null;
  const [withRel] = await withRelations([project]);
  return withRel ?? null;
}
