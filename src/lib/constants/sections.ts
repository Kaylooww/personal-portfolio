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
  /** In-world location metadata; navigation signs display the section label. */
  place: string;
}

export const PORTFOLIO_SECTIONS: readonly PortfolioSection[] = [
  { id: "airport", label: "Airport", href: "/", icon: "plane", meaning: "The journey begins", scene: "terminal", place: "Terminal" },
  { id: "about", label: "About", href: "/about", icon: "mountain", meaning: "Who I am", scene: "shore", place: "Shore" },
  { id: "skills", label: "Skills", href: "/skills", icon: "wrench", meaning: "The equipment I carry", scene: "jungle", place: "Jungle" },
  { id: "projects", label: "Projects", href: "/projects", icon: "pack", meaning: "Expeditions completed and underway", scene: "canyon", place: "Canyon" },
  { id: "journey", label: "Journey", href: "/journey", icon: "map", meaning: "Checkpoints along the route", scene: "ridge", place: "Ridge" },
  { id: "milestones", label: "Milestones", href: "/milestones", icon: "flag", meaning: "Achievements earned on the climb", scene: "citadel", place: "Citadel" },
  { id: "summit", label: "Summit", href: "/summit", icon: "summit", meaning: "Where the next climb begins", scene: "sunset", place: "The Summit" },
];

export function getSection(id: SectionId): PortfolioSection {
  const section = PORTFOLIO_SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}

/** Resolves the checkpoint for a URL path; nested routes (e.g. /projects/x) belong to their parent. */
export function getSectionForPath(pathname: string): PortfolioSection | null {
  if (pathname === "/") return PORTFOLIO_SECTIONS[0] ?? null;
  return (
    PORTFOLIO_SECTIONS.find(
      (s) => s.href !== "/" && (pathname === s.href || pathname.startsWith(`${s.href}/`)),
    ) ?? null
  );
}

/** The checkpoint after `id`, or null at the Summit. */
export function getNextSection(id: SectionId): PortfolioSection | null {
  return PORTFOLIO_SECTIONS[getSectionIndex(id) + 1] ?? null;
}

export function getSectionIndex(id: SectionId): number {
  return SECTION_IDS.indexOf(id);
}
