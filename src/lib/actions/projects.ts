"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { fieldErrorsFrom, removeStoredFiles, renumber, swapInOrder, type ServerSupabase as Supabase } from "@/lib/admin/helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { projectFormSchema, projectImageSchema, toProjectRow, type ProjectFormValues } from "@/lib/validation/project";
import type { ContentState } from "@/types";
import { fail, fromDbError, ok, type ActionResult } from "./result";

/*
 * Every action: requireAdmin() → validate → write with the admin's own session
 * (RLS is the final guard) → revalidate affected pages. The service-role key is
 * never used here.
 */

const idSchema = z.uuid();
const direction = z.enum(["up", "down"]);

function revalidateProjects(slugs: (string | null | undefined)[] = []) {
  revalidatePath("/admin", "layout");
  revalidatePath("/projects");
  revalidatePath("/");
  for (const slug of slugs) if (slug) revalidatePath(`/projects/${slug}`);
}




async function syncTechnologies(supabase: Supabase, projectId: string, skillIds: string[]) {
  const unique = [...new Set(skillIds)];
  const del = await supabase.from("project_technologies").delete().eq("project_id", projectId);
  if (del.error) return del.error;
  if (unique.length === 0) return null;
  const ins = await supabase
    .from("project_technologies")
    .insert(unique.map((skill_id, i) => ({ project_id: projectId, skill_id, display_order: i + 1 })));
  return ins.error;
}

// ── Create / update ─────────────────────────────────────────

export async function saveProject(input: { id?: string; values: ProjectFormValues }): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin("/admin/projects");

  const id = input.id === undefined ? undefined : idSchema.safeParse(input.id);
  if (id && !id.success) return fail("Unknown project.");
  const parsed = projectFormSchema.safeParse(input.values);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrorsFrom(parsed.error));

  const supabase = await createSupabaseServerClient();
  const row = toProjectRow(parsed.data);

  if (id?.success) {
    const before = await supabase.from("projects").select("slug, thumbnail_url").eq("id", id.data).maybeSingle();
    if (before.error) return fromDbError(before.error);
    if (!before.data) return fail("That project no longer exists.");

    const upd = await supabase.from("projects").update(row).eq("id", id.data);
    if (upd.error) return fromDbError(upd.error, "slug");
    const techErr = await syncTechnologies(supabase, id.data, parsed.data.technology_ids);
    if (techErr) return fromDbError(techErr);
    if (before.data.thumbnail_url && before.data.thumbnail_url !== row.thumbnail_url) {
      await removeStoredFiles(supabase, [before.data.thumbnail_url]);
    }
    revalidateProjects([before.data.slug, row.slug]);
    return ok({ id: id.data, slug: row.slug }, row.content_state === "published" ? "Project published" : "Project saved");
  }

  const last = await supabase.from("projects").select("display_order").order("display_order", { ascending: false }).limit(1);
  if (last.error) return fromDbError(last.error);
  const ins = await supabase
    .from("projects")
    .insert({ ...row, display_order: (last.data[0]?.display_order ?? 0) + 1 })
    .select("id")
    .single();
  if (ins.error) return fromDbError(ins.error, "slug");
  const techErr = await syncTechnologies(supabase, ins.data.id, parsed.data.technology_ids);
  if (techErr) return fromDbError(techErr);
  revalidateProjects([row.slug]);
  return ok({ id: ins.data.id, slug: row.slug }, row.content_state === "published" ? "Project published" : "Draft saved");
}

// ── Publishing workflow ─────────────────────────────────────

const STATE_MESSAGE: Record<ContentState, string> = {
  draft: "Moved back to drafts",
  published: "Project published",
  archived: "Project archived",
};

export async function setProjectContentState(projectId: string, state: ContentState): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(projectId);
  const st = z.enum(["draft", "published", "archived"]).safeParse(state);
  if (!id.success || !st.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("projects").update({ content_state: st.data }).eq("id", id.data).select("slug").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That project no longer exists.");
  revalidateProjects([data.slug]);
  return ok(undefined, STATE_MESSAGE[st.data]);
}

export async function setProjectFlag(projectId: string, flag: "featured" | "is_visible", value: boolean): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(projectId);
  const f = z.enum(["featured", "is_visible"]).safeParse(flag);
  if (!id.success || !f.success || typeof value !== "boolean") return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const patch = f.data === "featured" ? { featured: value } : { is_visible: value };
  const { data, error } = await supabase.from("projects").update(patch).eq("id", id.data).select("slug").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That project no longer exists.");
  revalidateProjects([data.slug]);
  const message =
    f.data === "featured" ? (value ? "Marked as featured" : "Removed from featured") : value ? "Project shown" : "Project hidden";
  return ok(undefined, message);
}

export async function moveProject(projectId: string, dir: "up" | "down"): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(projectId);
  const d = direction.safeParse(dir);
  if (!id.success || !d.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("projects").select("id").order("display_order").order("created_at");
  if (error) return fromDbError(error);
  const ids = swapInOrder(
    data.map((r) => r.id),
    id.data,
    d.data,
  );
  if (!ids) return ok(undefined);
  const err = await renumber(supabase, "projects", ids);
  if (err) return fromDbError(err);
  revalidateProjects();
  return ok(undefined, "Order updated");
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(projectId);
  if (!id.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const [proj, imgs] = await Promise.all([
    supabase.from("projects").select("slug, title, thumbnail_url").eq("id", id.data).maybeSingle(),
    supabase.from("project_images").select("url").eq("project_id", id.data),
  ]);
  if (proj.error || imgs.error) return fromDbError(proj.error ?? imgs.error);
  if (!proj.data) return fail("That project no longer exists.");

  // Technologies and image rows cascade with the project.
  const del = await supabase.from("projects").delete().eq("id", id.data);
  if (del.error) return fromDbError(del.error);
  await removeStoredFiles(supabase, [proj.data.thumbnail_url, ...imgs.data.map((i) => i.url)]);
  revalidateProjects([proj.data.slug]);
  return ok(undefined, `Deleted "${proj.data.title}"`);
}

// ── Screenshots ─────────────────────────────────────────────

async function slugOfProject(supabase: Supabase, projectId: string) {
  const { data } = await supabase.from("projects").select("slug").eq("id", projectId).maybeSingle();
  return data?.slug ?? null;
}

export async function addProjectImage(
  projectId: string,
  image: { url: string; alt: string; caption: string },
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(projectId);
  const img = projectImageSchema.safeParse(image);
  if (!id.success || !img.success) return fail("Invalid image.");

  const supabase = await createSupabaseServerClient();
  const last = await supabase
    .from("project_images")
    .select("display_order")
    .eq("project_id", id.data)
    .order("display_order", { ascending: false })
    .limit(1);
  if (last.error) return fromDbError(last.error);
  const ins = await supabase
    .from("project_images")
    .insert({
      project_id: id.data,
      url: img.data.url,
      alt: img.data.alt,
      caption: img.data.caption || null,
      display_order: (last.data[0]?.display_order ?? 0) + 1,
    })
    .select("id")
    .single();
  if (ins.error) return fromDbError(ins.error);
  revalidateProjects([await slugOfProject(supabase, id.data)]);
  return ok({ id: ins.data.id }, "Screenshot added");
}

export async function updateProjectImage(imageId: string, patch: { alt: string; caption: string }): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(imageId);
  const p = projectImageSchema.pick({ alt: true, caption: true }).safeParse(patch);
  if (!id.success || !p.success) return fail("Invalid image details.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_images")
    .update({ alt: p.data.alt, caption: p.data.caption || null })
    .eq("id", id.data)
    .select("project_id")
    .maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That screenshot no longer exists.");
  revalidateProjects([await slugOfProject(supabase, data.project_id)]);
  return ok(undefined, "Screenshot details saved");
}

export async function moveProjectImage(imageId: string, dir: "up" | "down"): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(imageId);
  const d = direction.safeParse(dir);
  if (!id.success || !d.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const owner = await supabase.from("project_images").select("project_id").eq("id", id.data).maybeSingle();
  if (owner.error) return fromDbError(owner.error);
  if (!owner.data) return fail("That screenshot no longer exists.");
  const { data, error } = await supabase.from("project_images").select("id").eq("project_id", owner.data.project_id).order("display_order");
  if (error) return fromDbError(error);
  const ids = swapInOrder(
    data.map((r) => r.id),
    id.data,
    d.data,
  );
  if (!ids) return ok(undefined);
  const err = await renumber(supabase, "project_images", ids);
  if (err) return fromDbError(err);
  revalidateProjects([await slugOfProject(supabase, owner.data.project_id)]);
  return ok(undefined, "Order updated");
}

export async function deleteProjectImage(imageId: string): Promise<ActionResult> {
  await requireAdmin("/admin/projects");
  const id = idSchema.safeParse(imageId);
  if (!id.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("project_images").delete().eq("id", id.data).select("url, project_id").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That screenshot no longer exists.");
  await removeStoredFiles(supabase, [data.url]);
  revalidateProjects([await slugOfProject(supabase, data.project_id)]);
  return ok(undefined, "Screenshot deleted");
}
