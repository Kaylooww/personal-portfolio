import type { Project, ProjectImage, ProjectTechnology } from "@/types";

/**
 * PLACEHOLDER CONTENT — replaced by `projects`, `project_technologies` and
 * `project_images` in Phase 14.
 *
 * The reference image's project names (SkyTrack, CampNotes, Summit Social,
 * Peak Planner) are NOT Kyle's work and are deliberately not used. Only
 * "Expedition Portfolio" (this site) is real; the rest are labelled samples.
 * One draft and one archived row exist to prove the public filter hides them.
 */
const stamp = { created_at: "2026-09-27T00:00:00.000Z", updated_at: "2026-09-27T00:00:00.000Z" };

const base = {
  description: null,
  problem: null,
  solution: null,
  features: [],
  process: null,
  thumbnail_url: null,
  github_url: null,
  demo_url: null,
  documentation_url: null,
  featured: false,
  started_on: null,
  finished_on: null,
  published_at: "2026-09-27T00:00:00.000Z",
  is_visible: true,
  ...stamp,
} satisfies Partial<Project>;

export const MOCK_PROJECTS: Project[] = [
  {
    ...base,
    id: "p0000000-0000-0000-0000-000000000001",
    title: "Expedition Portfolio",
    slug: "expedition-portfolio",
    short_description:
      "This portfolio — a game-inspired climb from the airport to the summit, with an admin dashboard to manage every checkpoint.",
    description:
      "A personal portfolio designed as an expedition. Each section is a checkpoint on the route, with hand-built scenery, paper cards, wooden signs and a trail map for navigation.",
    problem: "Most student portfolios look like the same template. I wanted one that shows personality and can grow without code changes.",
    solution: "A themed Next.js site backed by Supabase, where projects, skills, journey entries and milestones are all managed from a protected admin.",
    features: [
      "Seven themed checkpoints, from Airport to Summit",
      "Responsive navigation: top bar, route sidebar and mobile map",
      "Search and status filters for projects",
      "Admin dashboard for all content (in progress)",
    ],
    process: "Built phase by phase: foundation, navigation, each checkpoint, then the database and admin.",
    role: "Designer & Developer",
    status: "in_progress",
    content_state: "published",
    featured: true,
    started_on: "2026-09-01",
    display_order: 1,
  },
  {
    ...base,
    id: "p0000000-0000-0000-0000-000000000002",
    title: "Sample Completed Project",
    slug: "sample-completed-project",
    short_description: "Placeholder card showing a finished expedition. Replace it from the admin dashboard.",
    features: ["Placeholder feature one", "Placeholder feature two"],
    role: "Full Stack Developer",
    status: "completed",
    content_state: "published",
    started_on: "2025-01-01",
    finished_on: "2025-05-01",
    display_order: 2,
  },
  {
    ...base,
    id: "p0000000-0000-0000-0000-000000000003",
    title: "Sample Planned Project",
    slug: "sample-planned-project",
    short_description: "Placeholder card for an expedition that is mapped out but not yet started.",
    role: "Frontend Developer",
    status: "planned",
    content_state: "published",
    display_order: 3,
  },
  {
    ...base,
    id: "p0000000-0000-0000-0000-000000000004",
    title: "Sample Idea",
    slug: "sample-idea",
    short_description: "Placeholder card for an idea still being sketched in the journal.",
    role: "Product Designer",
    status: "idea",
    content_state: "published",
    display_order: 4,
  },
  {
    ...base,
    id: "p0000000-0000-0000-0000-000000000005",
    title: "Unpublished Draft",
    slug: "unpublished-draft",
    short_description: "Must never appear publicly.",
    role: null,
    status: "completed",
    content_state: "draft",
    published_at: null,
    display_order: 5,
  },
  {
    ...base,
    id: "p0000000-0000-0000-0000-000000000006",
    title: "Archived Project",
    slug: "archived-project",
    short_description: "Must never appear publicly.",
    role: null,
    status: "archived",
    content_state: "archived",
    display_order: 6,
  },
];

const tech = (project: number, skill: number, order: number): ProjectTechnology => ({
  project_id: `p0000000-0000-0000-0000-00000000000${project}`,
  skill_id: `s0000000-0000-0000-0000-${String(skill).padStart(12, "0")}`,
  display_order: order,
});

/** Skill ids follow MOCK_SKILLS order: 1 JavaScript, 2 Java, 4 HTML, 5 CSS, 6 React, 9 PostgreSQL, 10 Git, 11 Figma. */
export const MOCK_PROJECT_TECHNOLOGIES: ProjectTechnology[] = [
  tech(1, 6, 1),
  tech(1, 1, 2),
  tech(1, 5, 3),
  tech(1, 9, 4),
  tech(1, 11, 5),
  tech(2, 4, 1),
  tech(2, 5, 2),
  tech(2, 1, 3),
  tech(3, 6, 1),
  tech(3, 10, 2),
  tech(4, 11, 1),
];

export const MOCK_PROJECT_IMAGES: ProjectImage[] = [];
