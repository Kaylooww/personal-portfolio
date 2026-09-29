import "server-only";
import type { ServerSupabase } from "./helpers";

/**
 * Every media URL the database currently points at, mapped to a short
 * description of where it's used. Returns null if any lookup fails, so callers
 * can refuse to delete rather than guess.
 */
export async function findMediaReferences(supabase: ServerSupabase): Promise<Map<string, string> | null> {
  const [projects, images, skills, milestones, profile, settings] = await Promise.all([
    supabase.from("projects").select("title, thumbnail_url"),
    supabase.from("project_images").select("url, projects(title)"),
    supabase.from("skills").select("name, logo_url"),
    supabase.from("milestones").select("title, image_url"),
    supabase.from("profiles").select("photo_url, resume_url"),
    supabase.from("site_settings").select("og_image_url"),
  ]);
  if ([projects, images, skills, milestones, profile, settings].some((r) => r.error)) return null;

  const refs = new Map<string, string>();
  const add = (url: string | null | undefined, where: string) => {
    if (url) refs.set(url, where);
  };
  for (const p of projects.data ?? []) add(p.thumbnail_url, `Thumbnail · ${p.title}`);
  for (const i of images.data ?? []) add(i.url, `Screenshot · ${i.projects?.title ?? "project"}`);
  for (const s of skills.data ?? []) add(s.logo_url, `Logo · ${s.name}`);
  for (const m of milestones.data ?? []) add(m.image_url, `Image · ${m.title}`);
  for (const p of profile.data ?? []) {
    add(p.photo_url, "Profile photo");
    add(p.resume_url, "Résumé");
  }
  for (const s of settings.data ?? []) add(s.og_image_url, "Social share image");
  return refs;
}
