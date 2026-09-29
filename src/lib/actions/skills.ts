"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fieldErrorsFrom, moveRow, moveRowInCategory, nextDisplayOrder, removeStoredFiles } from "@/lib/admin/helpers";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  skillCategoryFormSchema,
  skillFormSchema,
  toSkillRow,
  type SkillCategoryFormValues,
  type SkillFormValues,
} from "@/lib/validation/skill";
import { fail, fromDbError, ok, type ActionResult } from "./result";

/*
 * Same pattern as projects: requireAdmin() → validate → write with the admin's
 * own session (RLS guards) → revalidate. Skills appear on /skills and as
 * project technologies, so both are revalidated.
 */

const idSchema = z.uuid();
const direction = z.enum(["up", "down"]);

function revalidateSkills() {
  revalidatePath("/admin", "layout");
  revalidatePath("/skills");
  revalidatePath("/projects", "layout");
  revalidatePath("/");
}

// ── Skills ──────────────────────────────────────────────────

export async function saveSkill(input: { id?: string; values: SkillFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/skills");
  const id = input.id === undefined ? undefined : idSchema.safeParse(input.id);
  if (id && !id.success) return fail("Unknown skill.");
  const parsed = skillFormSchema.safeParse(input.values);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrorsFrom(parsed.error));

  const supabase = await createSupabaseServerClient();
  const row = toSkillRow(parsed.data);

  if (id?.success) {
    const before = await supabase.from("skills").select("logo_url").eq("id", id.data).maybeSingle();
    if (before.error) return fromDbError(before.error);
    if (!before.data) return fail("That skill no longer exists.");
    const upd = await supabase.from("skills").update(row).eq("id", id.data);
    if (upd.error) return fromDbError(upd.error, "slug");
    if (before.data.logo_url && before.data.logo_url !== row.logo_url) await removeStoredFiles(supabase, [before.data.logo_url]);
    revalidateSkills();
    return ok({ id: id.data }, "Skill saved");
  }

  const next = await nextDisplayOrder(supabase, "skills");
  if (next.error) return fromDbError(next.error);
  const ins = await supabase
    .from("skills")
    .insert({ ...row, display_order: next.order })
    .select("id")
    .single();
  if (ins.error) return fromDbError(ins.error, "slug");
  revalidateSkills();
  return ok({ id: ins.data.id }, "Skill added");
}

export async function setSkillFlag(skillId: string, flag: "featured" | "is_visible", value: boolean): Promise<ActionResult> {
  await requireAdmin("/admin/skills");
  const id = idSchema.safeParse(skillId);
  const f = z.enum(["featured", "is_visible"]).safeParse(flag);
  if (!id.success || !f.success || typeof value !== "boolean") return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const patch = f.data === "featured" ? { featured: value } : { is_visible: value };
  const { data, error } = await supabase.from("skills").update(patch).eq("id", id.data).select("id").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That skill no longer exists.");
  revalidateSkills();
  const message = f.data === "featured" ? (value ? "Marked as featured" : "Removed from featured") : value ? "Skill shown" : "Skill hidden";
  return ok(undefined, message);
}

/**
 * Moves a skill within its own category (the order the public gear board uses),
 * then renumbers every skill so display_order stays gap-free.
 */
export async function moveSkill(skillId: string, dir: "up" | "down"): Promise<ActionResult> {
  await requireAdmin("/admin/skills");
  const id = idSchema.safeParse(skillId);
  const d = direction.safeParse(dir);
  if (!id.success || !d.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const err = await moveRowInCategory(supabase, "skills", id.data, d.data);
  if (err) return fromDbError(err);
  revalidateSkills();
  return ok(undefined, "Order updated");
}

export async function deleteSkill(skillId: string): Promise<ActionResult> {
  await requireAdmin("/admin/skills");
  const id = idSchema.safeParse(skillId);
  if (!id.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  // Project technology links cascade with the skill.
  const { data, error } = await supabase.from("skills").delete().eq("id", id.data).select("name, logo_url").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That skill no longer exists.");
  await removeStoredFiles(supabase, [data.logo_url]);
  revalidateSkills();
  return ok(undefined, `Deleted "${data.name}"`);
}

// ── Categories ──────────────────────────────────────────────

export async function saveSkillCategory(input: { id?: string; values: SkillCategoryFormValues }): Promise<ActionResult<{ id: string }>> {
  await requireAdmin("/admin/skills/categories");
  const id = input.id === undefined ? undefined : idSchema.safeParse(input.id);
  if (id && !id.success) return fail("Unknown category.");
  const parsed = skillCategoryFormSchema.safeParse(input.values);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrorsFrom(parsed.error));

  const supabase = await createSupabaseServerClient();
  const row = { name: parsed.data.name, slug: parsed.data.slug, icon: parsed.data.icon || null, is_visible: parsed.data.is_visible };

  if (id?.success) {
    const { data, error } = await supabase.from("skill_categories").update(row).eq("id", id.data).select("id").maybeSingle();
    if (error) return fromDbError(error, "slug");
    if (!data) return fail("That category no longer exists.");
    revalidateSkills();
    return ok({ id: id.data }, "Category saved");
  }

  const next = await nextDisplayOrder(supabase, "skill_categories");
  if (next.error) return fromDbError(next.error);
  const ins = await supabase
    .from("skill_categories")
    .insert({ ...row, display_order: next.order })
    .select("id")
    .single();
  if (ins.error) return fromDbError(ins.error, "slug");
  revalidateSkills();
  return ok({ id: ins.data.id }, "Category added");
}

export async function setSkillCategoryVisibility(categoryId: string, visible: boolean): Promise<ActionResult> {
  await requireAdmin("/admin/skills/categories");
  const id = idSchema.safeParse(categoryId);
  if (!id.success || typeof visible !== "boolean") return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("skill_categories").update({ is_visible: visible }).eq("id", id.data).select("id").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That category no longer exists.");
  revalidateSkills();
  return ok(undefined, visible ? "Category shown" : "Category hidden");
}

export async function moveSkillCategory(categoryId: string, dir: "up" | "down"): Promise<ActionResult> {
  await requireAdmin("/admin/skills/categories");
  const id = idSchema.safeParse(categoryId);
  const d = direction.safeParse(dir);
  if (!id.success || !d.success) return fail("Invalid request.");

  const supabase = await createSupabaseServerClient();
  const err = await moveRow(supabase, "skill_categories", id.data, d.data);
  if (err) return fromDbError(err);
  revalidateSkills();
  return ok(undefined, "Order updated");
}

/** Deletes a category; its skills stay and become uncategorised (FK is ON DELETE SET NULL). */
export async function deleteSkillCategory(categoryId: string): Promise<ActionResult> {
  await requireAdmin("/admin/skills/categories");
  const id = idSchema.safeParse(categoryId);
  if (!id.success) return fail("Invalid request.");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("skill_categories").delete().eq("id", id.data).select("name").maybeSingle();
  if (error) return fromDbError(error);
  if (!data) return fail("That category no longer exists.");
  revalidateSkills();
  return ok(undefined, `Deleted "${data.name}"`);
}
