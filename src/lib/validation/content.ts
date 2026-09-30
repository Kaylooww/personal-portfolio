import { z } from "zod";
import { CONTENT_ICON_KEYS } from "@/components/ui/ContentIcon";
import type { AboutCardKind, DepartureStatus, SocialPlatform } from "@/types";
import type { MilestoneAccent } from "@/types/database";

/*
 * Schemas for Phase 13 content editors. Each is used by its React Hook Form
 * and re-run in the matching Server Action. Form values are strings/booleans;
 * the `to…Row` helpers convert empties to nulls for the database.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const url = (message = "Enter a full link starting with https://") =>
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), { error: message });
const date = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), { error: "Use a valid date." });
const icon = z.string().refine((v) => v === "" || (CONTENT_ICON_KEYS as string[]).includes(v), { error: "Pick an icon from the list." });
const text = (max: number) => z.string().trim().max(max, { error: `Keep it under ${max} characters.` });
const required = (label: string, max: number) => z.string().trim().min(1, { error: `${label} is required.` }).max(max, { error: `Keep it under ${max} characters.` });
const nullIfEmpty = (v: string) => (v === "" ? null : v);
const lines = (v: string) =>
  v
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

// ── Profile ──────────────────────────────────────────────────

export const profileFormSchema = z.object({
  full_name: required("Full name", 120),
  display_first: required("First line of the name", 60),
  display_last: required("Second line of the name", 60),
  headline_roles: text(300).refine((v) => lines(v).length <= 6, { error: "Up to 6 roles." }),
  tagline: text(200),
  intro: text(600),
  bio: text(1200),
  location: text(80),
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || z.email().safeParse(v).success, { error: "Enter a valid email address." }),
  photo_url: url("Invalid photo URL."),
  resume_url: url("Invalid résumé URL."),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function toProfileRow(v: ProfileFormValues) {
  return {
    full_name: v.full_name,
    display_first: v.display_first,
    display_last: v.display_last,
    headline_roles: lines(v.headline_roles),
    tagline: v.tagline,
    intro: v.intro,
    bio: v.bio,
    location: nullIfEmpty(v.location),
    email: nullIfEmpty(v.email.toLowerCase()),
    photo_url: nullIfEmpty(v.photo_url),
    resume_url: nullIfEmpty(v.resume_url),
  };
}

// ── About cards ──────────────────────────────────────────────

export const ABOUT_CARD_KINDS: readonly { value: AboutCardKind; label: string }[] = [
  { value: "education", label: "Education" },
  { value: "interests", label: "Interests" },
  { value: "focus", label: "Development focus" },
  { value: "location", label: "Location" },
  { value: "goals", label: "Goals (checklist)" },
];

export const aboutCardFormSchema = z.object({
  kind: z.enum(["education", "interests", "focus", "location", "goals"]),
  title: required("Title", 80),
  items: z
    .array(z.object({ label: required("Item text", 120), icon }))
    .min(1, { error: "Add at least one line." })
    .max(12, { error: "Up to 12 lines per card." }),
  is_visible: z.boolean(),
});
export type AboutCardFormValues = z.infer<typeof aboutCardFormSchema>;

export const EMPTY_ABOUT_CARD: AboutCardFormValues = { kind: "interests", title: "", items: [{ label: "", icon: "" }], is_visible: true };

export function toAboutCardRow(v: AboutCardFormValues) {
  return { kind: v.kind, title: v.title, items: v.items.map((i) => ({ label: i.label, icon: nullIfEmpty(i.icon) })), is_visible: v.is_visible };
}

// ── Journey ──────────────────────────────────────────────────

export const journeyFormSchema = z.object({
  period_label: required("Period", 20),
  date,
  title: required("Title", 80),
  subtitle: text(80),
  description: text(400),
  icon,
  is_visible: z.boolean(),
});
export type JourneyFormValues = z.infer<typeof journeyFormSchema>;

export const EMPTY_JOURNEY: JourneyFormValues = { period_label: "", date: "", title: "", subtitle: "", description: "", icon: "", is_visible: true };

export function toJourneyRow(v: JourneyFormValues) {
  return {
    period_label: v.period_label,
    date: nullIfEmpty(v.date),
    title: v.title,
    subtitle: nullIfEmpty(v.subtitle),
    description: nullIfEmpty(v.description),
    icon: nullIfEmpty(v.icon),
    is_visible: v.is_visible,
  };
}

// ── Milestone categories ─────────────────────────────────────

export const MILESTONE_ACCENTS: readonly { value: MilestoneAccent; label: string }[] = [
  { value: "navy", label: "Navy" },
  { value: "red", label: "Red" },
  { value: "gold", label: "Gold" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
];

export const milestoneCategoryFormSchema = z.object({
  name: required("Name", 60),
  slug: z.string().trim().min(1, { error: "A slug is required." }).max(80).regex(SLUG, { error: "Lowercase letters, numbers and single dashes only." }),
  description: text(200),
  badge_icon: icon,
  accent: z.enum(["navy", "red", "gold", "blue", "green", "purple"]),
  is_visible: z.boolean(),
});
export type MilestoneCategoryFormValues = z.infer<typeof milestoneCategoryFormSchema>;

export const EMPTY_MILESTONE_CATEGORY: MilestoneCategoryFormValues = { name: "", slug: "", description: "", badge_icon: "star", accent: "navy", is_visible: true };

export function toMilestoneCategoryRow(v: MilestoneCategoryFormValues) {
  return { name: v.name, slug: v.slug, description: nullIfEmpty(v.description), badge_icon: nullIfEmpty(v.badge_icon), accent: v.accent, is_visible: v.is_visible };
}

// ── Milestones ───────────────────────────────────────────────

export const milestoneFormSchema = z.object({
  title: required("Title", 120),
  category_id: z.union([z.literal(""), z.uuid({ error: "Pick a category." })]),
  issuer: text(120),
  organization: text(120),
  date,
  date_display: z.enum(["day", "month", "year"]),
  description: text(600),
  badge_icon: icon,
  image_url: url("Invalid image URL."),
  pdf_url: url("Invalid PDF URL."),
  certificate_url: url(),
  external_url: url(),
  featured: z.boolean(),
  is_visible: z.boolean(),
});
export type MilestoneFormValues = z.infer<typeof milestoneFormSchema>;

export const EMPTY_MILESTONE: MilestoneFormValues = {
  title: "",
  category_id: "",
  issuer: "",
  organization: "",
  date: "",
  date_display: "day",
  description: "",
  badge_icon: "",
  image_url: "",
  pdf_url: "",
  certificate_url: "",
  external_url: "",
  featured: false,
  is_visible: true,
};

export function toMilestoneRow(v: MilestoneFormValues) {
  return {
    title: v.title,
    category_id: nullIfEmpty(v.category_id),
    issuer: nullIfEmpty(v.issuer),
    organization: nullIfEmpty(v.organization),
    date: nullIfEmpty(v.date),
    date_display: v.date_display,
    description: nullIfEmpty(v.description),
    badge_icon: nullIfEmpty(v.badge_icon),
    image_url: nullIfEmpty(v.image_url),
    pdf_url: nullIfEmpty(v.pdf_url),
    certificate_url: nullIfEmpty(v.certificate_url),
    external_url: nullIfEmpty(v.external_url),
    featured: v.featured,
    is_visible: v.is_visible,
  };
}

export function milestoneToFormValues(m: Record<keyof ReturnType<typeof toMilestoneRow>, unknown>): MilestoneFormValues {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    title: s(m.title),
    category_id: s(m.category_id),
    issuer: s(m.issuer),
    organization: s(m.organization),
    date: s(m.date),
    date_display: m.date_display === "day" || m.date_display === "year" ? m.date_display : "month",
    description: s(m.description),
    badge_icon: s(m.badge_icon),
    image_url: s(m.image_url),
    pdf_url: s(m.pdf_url),
    certificate_url: s(m.certificate_url),
    external_url: s(m.external_url),
    featured: m.featured === true,
    is_visible: m.is_visible !== false,
  };
}

// ── Social links ─────────────────────────────────────────────

export const SOCIAL_PLATFORMS: readonly { value: SocialPlatform; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "other", label: "Other" },
];

export const socialLinkFormSchema = z
  .object({
    platform: z.enum(["github", "linkedin", "email", "website", "facebook", "other"]),
    label: required("Label", 40),
    url: z.string().trim().min(1, { error: "Add the address." }).max(500),
    is_visible: z.boolean(),
  })
  .superRefine((v, ctx) => {
    const ok =
      v.platform === "email"
        ? /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(v.url) || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.url)
        : /^https?:\/\/\S+$/i.test(v.url);
    if (!ok) ctx.addIssue({ code: "custom", path: ["url"], message: v.platform === "email" ? "Enter an email address." : "Enter a full link starting with https://" });
  });
export type SocialLinkFormValues = z.infer<typeof socialLinkFormSchema>;

export const EMPTY_SOCIAL_LINK: SocialLinkFormValues = { platform: "github", label: "", url: "", is_visible: true };

export function toSocialLinkRow(v: SocialLinkFormValues) {
  // Email links are stored as mailto: so the public page can use them directly.
  const address = v.platform === "email" && !v.url.toLowerCase().startsWith("mailto:") ? `mailto:${v.url}` : v.url;
  return { platform: v.platform, label: v.label, url: address, is_visible: v.is_visible };
}

// ── Site settings ────────────────────────────────────────────

export const DEPARTURE_STATUSES: readonly { value: DepartureStatus; label: string }[] = [
  { value: "ready", label: "Ready" },
  { value: "up_next", label: "Up next" },
  { value: "planned", label: "Planned" },
];

export const DEPARTURE_ICONS = ["laptop", "palm", "mountain", "plane"] as const;

export const siteSettingsFormSchema = z.object({
  site_title: required("Site title", 120),
  site_description: text(300),
  og_image_url: url("Invalid image URL."),
  departures: z
    .array(
      z.object({
        destination: required("Destination", 40),
        status: z.enum(["ready", "up_next", "planned"]),
        icon: z.enum(DEPARTURE_ICONS),
      }),
    )
    .max(6, { error: "Up to 6 departures fit on the board." }),
  departures_note: text(80),
  summit_note: text(120),
  summit_message: text(600),
  resume_enabled: z.boolean(),
});
export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;

export function toSiteSettingsRow(v: SiteSettingsFormValues) {
  return {
    site_title: v.site_title,
    site_description: v.site_description,
    og_image_url: nullIfEmpty(v.og_image_url),
    departures: v.departures,
    departures_note: nullIfEmpty(v.departures_note),
    summit_note: nullIfEmpty(v.summit_note),
    summit_message: nullIfEmpty(v.summit_message),
    resume_enabled: v.resume_enabled,
  };
}
