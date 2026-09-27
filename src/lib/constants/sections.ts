/**
 * The seven checkpoints of the expedition, in climbing order.
 * Drives the top navigation, expedition sidebar and mobile map (Phase 2).
 *
 * The final destination is SUMMIT. "PEAK" is only the name of the game
 * that inspired the visual language — it is never a route or nav label.
 */
export const SECTION_IDS = [
  "airport",
  "about",
  "skills",
  "projects",
  "journey",
  "milestones",
  "summit",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionIcon = "plane" | "mountain" | "wrench" | "pack" | "map" | "flag" | "summit";

export type SectionScene = "terminal" | "shore" | "jungle" | "canyon" | "ridge" | "citadel" | "sunset";

export interface PortfolioSection {
  id: SectionId;
  label: string;
  href: `/${string}`;
  icon: SectionIcon;
  /** The expedition metaphor for this checkpoint. */
  meaning: string;
  /** Background artwork theme; assets arrive with each page's phase. */
  scene: SectionScene;
}

export const PORTFOLIO_SECTIONS: readonly PortfolioSection[] = [
  { id: "airport", label: "Airport", href: "/", icon: "plane", meaning: "The journey begins", scene: "terminal" },
  { id: "about", label: "About", href: "/about", icon: "mountain", meaning: "Who I am", scene: "shore" },
  { id: "skills", label: "Skills", href: "/skills", icon: "wrench", meaning: "The equipment I carry", scene: "jungle" },
  { id: "projects", label: "Projects", href: "/projects", icon: "pack", meaning: "Expeditions completed and underway", scene: "canyon" },
  { id: "journey", label: "Journey", href: "/journey", icon: "map", meaning: "Checkpoints along the route", scene: "ridge" },
  { id: "milestones", label: "Milestones", href: "/milestones", icon: "flag", meaning: "Achievements earned on the climb", scene: "citadel" },
  { id: "summit", label: "Summit", href: "/summit", icon: "summit", meaning: "Where the next climb begins", scene: "sunset" },
];

export function getSection(id: SectionId): PortfolioSection {
  const section = PORTFOLIO_SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}

export function getSectionIndex(id: SectionId): number {
  return SECTION_IDS.indexOf(id);
}
