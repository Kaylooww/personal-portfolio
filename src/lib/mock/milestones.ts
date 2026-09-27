import type { Milestone, MilestoneCategory } from "@/types";

/**
 * PLACEHOLDER CONTENT — replaced by `milestone_categories` / `milestones` in Phase 14.
 * Categories follow reference 06-milestones.png. Milestones are clearly labelled
 * samples — real achievements are added from the admin (Phase 13).
 * One hidden milestone exists to prove the visibility filter.
 */
const stamp = { created_at: "2026-09-27T00:00:00.000Z", updated_at: "2026-09-27T00:00:00.000Z" };

const category = (
  n: number,
  name: string,
  slug: string,
  description: string,
  badge_icon: string,
  accent: MilestoneCategory["accent"],
): MilestoneCategory => ({
  id: `m0000000-0000-0000-0000-00000000000${n}`,
  name,
  slug,
  description,
  badge_icon,
  accent,
  display_order: n,
  is_visible: true,
  ...stamp,
});

export const MOCK_MILESTONE_CATEGORIES: MilestoneCategory[] = [
  category(1, "Certifications", "certifications", "Professional certifications & qualifications.", "certificate", "navy"),
  category(2, "Competitions", "competitions", "Hackathons, contests & challenges.", "flag", "red"),
  category(3, "Awards", "awards", "Recognition, honors & scholarships.", "star", "gold"),
  category(4, "Major Projects", "major-projects", "Significant builds and contributions.", "mountain", "blue"),
  category(5, "Academic Achievements", "academics", "Education, research & academic excellence.", "book", "green"),
  category(6, "Important Accomplishments", "accomplishments", "Milestones, leadership & impact.", "trophy", "purple"),
];

const milestone = (n: number, categoryN: number, fields: Partial<Milestone> & Pick<Milestone, "title">): Milestone => ({
  id: `n0000000-0000-0000-0000-00000000000${n}`,
  category_id: `m0000000-0000-0000-0000-00000000000${categoryN}`,
  issuer: null,
  organization: null,
  date: null,
  description: null,
  badge_icon: null,
  image_url: null,
  certificate_url: null,
  external_url: null,
  featured: false,
  display_order: n,
  is_visible: true,
  ...stamp,
  ...fields,
});

export const MOCK_MILESTONES: Milestone[] = [
  milestone(1, 1, {
    title: "Sample Certification",
    issuer: "Placeholder Issuer",
    date: "2025-06-01",
    description: "Placeholder milestone — replace it from the admin dashboard.",
  }),
  milestone(2, 4, {
    title: "Expedition Portfolio",
    organization: "Personal project",
    date: "2026-09-01",
    description: "Designing and building this portfolio as a themed, content-managed expedition.",
  }),
  milestone(3, 5, {
    title: "Sample Academic Achievement",
    organization: "Placeholder School",
    date: "2025-03-01",
    description: "Placeholder milestone — replace it from the admin dashboard.",
  }),
  milestone(4, 2, { title: "Hidden Milestone", description: "Must never appear publicly.", is_visible: false }),
];
