import { z } from "zod";
import { CONTENT_STATES, PROJECT_STATUSES } from "@/lib/constants/status";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "My Cool App!" → "my-cool-app" */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const optionalText = (max: number) => z.string().trim().max(max, { error: `Keep it under ${max} characters.` });

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), { error: "Enter a full link starting with https://" });

const optionalDate = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), { error: "Use a valid date." });

/**
 * Shape of the project form. Everything is a string/boolean/array as the form
 * holds it; `toProjectRow()` converts empties to nulls for the database. The
 * same schema runs in the browser (React Hook Form) and in the Server Action.
 */
export const projectFormSchema = z
  .object({
    title: z.string().trim().min(1, { error: "Give the project a title." }).max(120),
    slug: z.string().trim().min(1, { error: "A URL slug is required." }).max(80).regex(SLUG, {
      error: "Lowercase letters, numbers and single dashes only (e.g. my-project).",
    }),
    short_description: z.string().trim().min(1, { error: "Add a one-line summary." }).max(300, {
      error: "Keep the summary under 300 characters.",
    }),
    description: optionalText(5000),
    problem: optionalText(3000),
    solution: optionalText(3000),
    features: optionalText(4000),
    process: optionalText(5000),
    role: optionalText(80),
    status: z.enum(PROJECT_STATUSES as [string, ...string[]]),
    content_state: z.enum(CONTENT_STATES as [string, ...string[]]),
    github_url: optionalUrl,
    demo_url: optionalUrl,
    documentation_url: optionalUrl,
    thumbnail_url: optionalUrl,
    started_on: optionalDate,
    finished_on: optionalDate,
    featured: z.boolean(),
    is_visible: z.boolean(),
    technology_ids: z.array(z.uuid()).max(30, { error: "Pick at most 30 technologies." }),
  })
  .refine((v) => !v.started_on || !v.finished_on || v.finished_on >= v.started_on, {
    path: ["finished_on"],
    error: "The finish date can't be before the start date.",
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

const nullIfEmpty = (v: string) => (v === "" ? null : v);

/** Form values → columns for insert/update (technologies are written separately). */
export function toProjectRow(v: ProjectFormValues) {
  return {
    title: v.title,
    slug: v.slug,
    short_description: v.short_description,
    description: nullIfEmpty(v.description),
    problem: nullIfEmpty(v.problem),
    solution: nullIfEmpty(v.solution),
    features: v.features
      .split(/\r?\n/)
      .map((f) => f.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean),
    process: nullIfEmpty(v.process),
    role: nullIfEmpty(v.role),
    status: v.status as (typeof PROJECT_STATUSES)[number],
    content_state: v.content_state as (typeof CONTENT_STATES)[number],
    github_url: nullIfEmpty(v.github_url),
    demo_url: nullIfEmpty(v.demo_url),
    documentation_url: nullIfEmpty(v.documentation_url),
    thumbnail_url: nullIfEmpty(v.thumbnail_url),
    started_on: nullIfEmpty(v.started_on),
    finished_on: nullIfEmpty(v.finished_on),
    featured: v.featured,
    is_visible: v.is_visible,
  };
}

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  problem: "",
  solution: "",
  features: "",
  process: "",
  role: "",
  status: "planned",
  content_state: "draft",
  github_url: "",
  demo_url: "",
  documentation_url: "",
  thumbnail_url: "",
  started_on: "",
  finished_on: "",
  featured: false,
  is_visible: true,
  technology_ids: [],
};

export const projectImageSchema = z.object({
  url: z.string().trim().regex(/^https?:\/\/\S+$/),
  alt: z.string().trim().max(200),
  caption: z.string().trim().max(300),
});

/** Database row → form values (nulls become empty strings, features become lines). */
export function projectToFormValues(
  p: {
    title: string;
    slug: string;
    short_description: string;
    description: string | null;
    problem: string | null;
    solution: string | null;
    features: string[];
    process: string | null;
    role: string | null;
    status: string;
    content_state: string;
    github_url: string | null;
    demo_url: string | null;
    documentation_url: string | null;
    thumbnail_url: string | null;
    started_on: string | null;
    finished_on: string | null;
    featured: boolean;
    is_visible: boolean;
  },
  technologyIds: string[],
): ProjectFormValues {
  return {
    title: p.title,
    slug: p.slug,
    short_description: p.short_description,
    description: p.description ?? "",
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    features: p.features.join("\n"),
    process: p.process ?? "",
    role: p.role ?? "",
    status: p.status,
    content_state: p.content_state,
    github_url: p.github_url ?? "",
    demo_url: p.demo_url ?? "",
    documentation_url: p.documentation_url ?? "",
    thumbnail_url: p.thumbnail_url ?? "",
    started_on: p.started_on ?? "",
    finished_on: p.finished_on ?? "",
    featured: p.featured,
    is_visible: p.is_visible,
    technology_ids: technologyIds,
  };
}
