import type { JourneyEntry } from "@/types";

/**
 * PLACEHOLDER CONTENT — replaced by `journey_entries` in Phase 14.
 * Text follows reference 05-journey.png; the owner should confirm each entry
 * is accurate before launch (editable from the admin in Phase 13).
 */
const stamp = { created_at: "2026-09-27T00:00:00.000Z", updated_at: "2026-09-27T00:00:00.000Z" };

const entry = (
  n: number,
  period_label: string,
  title: string,
  subtitle: string,
  description: string,
  icon: string,
): JourneyEntry => ({
  id: `j0000000-0000-0000-0000-00000000000${n}`,
  period_label,
  date: null,
  title,
  subtitle,
  description,
  icon,
  display_order: n,
  is_visible: true,
  ...stamp,
});

export const MOCK_JOURNEY: JourneyEntry[] = [
  entry(1, "2020", "Senior High School", "STEM Program", "Built a strong foundation in problem-solving and technology.", "graduation"),
  entry(2, "2021", "University", "BSIT Student", "Started my journey in tech and discovered my passion for building.", "laptop"),
  entry(3, "2022", "Open Source", "Contributor", "Contributed to projects and learned the power of collaboration.", "code"),
  entry(4, "2023", "Student Organization", "Developer & Member", "Worked with a team to build real solutions and create impact.", "users"),
  entry(5, "2024", "Personal Projects", "UI/UX Enthusiast", "Turned ideas into real products and improved my skills day by day.", "gear"),
  entry(6, "2025", "Bigger Things", "In Progress", "Continuing to learn, build, and climb toward a greater version of myself.", "mountain"),
];
