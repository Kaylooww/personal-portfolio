import type { AboutCard } from "@/types";

/**
 * PLACEHOLDER CONTENT — replaced by the `about_cards` table in Phase 14.
 * Text follows reference 02-about.png (with "BST" corrected to "BS").
 */
const stamp = { created_at: "2026-09-27T00:00:00.000Z", updated_at: "2026-09-27T00:00:00.000Z" };

export const MOCK_ABOUT_CARDS: AboutCard[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    kind: "education",
    title: "Education",
    items: [
      { label: "BS Information Technology Student", icon: "graduation" },
      { label: "Philippines", icon: "pin" },
    ],
    display_order: 1,
    is_visible: true,
    ...stamp,
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    kind: "interests",
    title: "Interests",
    items: [
      { label: "Games & Interactive Media", icon: "gamepad" },
      { label: "Travel & Nature", icon: "mountain" },
      { label: "Photography", icon: "camera" },
      { label: "Music", icon: "music" },
    ],
    display_order: 2,
    is_visible: true,
    ...stamp,
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    kind: "focus",
    title: "Development Focus",
    items: [
      { label: "Frontend Development", icon: "monitor" },
      { label: "UI/UX Design", icon: "pen" },
      { label: "Web Development", icon: "globe" },
      { label: "Creative Projects", icon: "box" },
    ],
    display_order: 3,
    is_visible: true,
    ...stamp,
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    kind: "location",
    title: "Location",
    items: [{ label: "Philippines", icon: "palm" }],
    display_order: 4,
    is_visible: true,
    ...stamp,
  },
  {
    id: "a0000000-0000-0000-0000-000000000005",
    kind: "goals",
    title: "Current Goals",
    items: [
      { label: "Complete my degree", icon: null },
      { label: "Build meaningful projects", icon: null },
      { label: "Grow as a developer", icon: null },
      { label: "Explore more of the world", icon: null },
    ],
    display_order: 5,
    is_visible: true,
    ...stamp,
  },
];
