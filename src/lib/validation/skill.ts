import { z } from "zod";
import { CONTENT_ICON_KEYS } from "@/components/ui/ContentIcon";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugField = z.string().trim().min(1, { error: "A slug is required." }).max(80).regex(SLUG, {
  error: "Lowercase letters, numbers and single dashes only.",
});
/** "" = no icon; otherwise must be a key ContentIcon can draw. */
const iconField = z.string().refine((v) => v === "" || (CONTENT_ICON_KEYS as string[]).includes(v), { error: "Pick an icon from the list." });

export const skillCategoryFormSchema = z.object({
  name: z.string().trim().min(1, { error: "Name the category." }).max(60),
  slug: slugField,
  icon: iconField,
  is_visible: z.boolean(),
});
export type SkillCategoryFormValues = z.infer<typeof skillCategoryFormSchema>;

export const EMPTY_SKILL_CATEGORY_FORM: SkillCategoryFormValues = { name: "", slug: "", icon: "", is_visible: true };

export const skillFormSchema = z.object({
  name: z.string().trim().min(1, { error: "Name the skill." }).max(60),
  slug: slugField,
  category_id: z.union([z.literal(""), z.uuid({ error: "Pick a category." })]),
  description: z.string().trim().max(300, { error: "Keep it under 300 characters." }),
  icon: iconField,
  logo_url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), { error: "Invalid logo URL." }),
  /** Kept as text in the form; "" means "don't show a level". */
  proficiency: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d{1,3}$/.test(v) && Number(v) <= 100), { error: "Use a whole number from 0 to 100, or leave it empty." }),
  featured: z.boolean(),
  is_visible: z.boolean(),
});
export type SkillFormValues = z.infer<typeof skillFormSchema>;

export const EMPTY_SKILL_FORM: SkillFormValues = {
  name: "",
  slug: "",
  category_id: "",
  description: "",
  icon: "",
  logo_url: "",
  proficiency: "",
  featured: false,
  is_visible: true,
};

const nullIfEmpty = (v: string) => (v === "" ? null : v);

export function toSkillRow(v: SkillFormValues) {
  return {
    name: v.name,
    slug: v.slug,
    category_id: nullIfEmpty(v.category_id),
    description: nullIfEmpty(v.description),
    icon: nullIfEmpty(v.icon),
    logo_url: nullIfEmpty(v.logo_url),
    proficiency: v.proficiency === "" ? null : Number(v.proficiency),
    featured: v.featured,
    is_visible: v.is_visible,
  };
}

export function skillToFormValues(s: {
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  icon: string | null;
  logo_url: string | null;
  proficiency: number | null;
  featured: boolean;
  is_visible: boolean;
}): SkillFormValues {
  return {
    name: s.name,
    slug: s.slug,
    category_id: s.category_id ?? "",
    description: s.description ?? "",
    icon: s.icon ?? "",
    logo_url: s.logo_url ?? "",
    proficiency: s.proficiency === null ? "" : String(s.proficiency),
    featured: s.featured,
    is_visible: s.is_visible,
  };
}
