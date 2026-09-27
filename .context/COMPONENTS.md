# Components

Rule: Server Component unless it needs state, effects, or browser APIs. One component per file; name the file after the component.

## Built (Phase 1)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `LogoMark` | `components/ui/LogoMark.tsx` | server | Twin-peak mark; inherits `currentColor`; decorative unless `title` given |
| `PaperCard` | `components/ui/PaperCard.tsx` | server | Paper surface; `as`, `variant` (`plain`/`pinned` tape), `tilt`, `interactive` hover lift |
| `ButtonLink` + `buttonClasses()` | `components/ui/ButtonLink.tsx` | server | Link styled as expedition button (`primary` 3D blue, `secondary` paper, `ghost`); `buttonClasses` reused by `<button>` |
| `SectionTitle` | `components/ui/SectionTitle.tsx` | server | Eyebrow → heavy title with blue spark → handwritten note with swoosh; `size` hero/title, `as` h1/h2 |
| `Container` | `components/layout/Container.tsx` | server | Max-width + fluid gutters |
| `SkipLink` | `components/layout/SkipLink.tsx` | server | "Skip to content" for keyboard users |
| `PortfolioShell` | `components/layout/PortfolioShell.tsx` | server | Public frame; reserves sidebar column at `lg`; hosts nav in Phase 2 |

## Built (Phase 2)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `CheckpointIcon` | `components/navigation/CheckpointIcon.tsx` | server | Line glyph per `SectionIcon` (plane, mountain, wrench, pack, map, flag, summit) |
| `TopNavigation` | `components/navigation/TopNavigation.tsx` | client | Floating paper pill (lg+), centred on the content column; `aria-current` on the active item |
| `ExpeditionSidebar` | `components/navigation/ExpeditionSidebar.tsx` | client | Fixed left route map (lg+); dashed trail, solid blue for climbed stretch |
| `MobileNavigation` | `components/navigation/MobileNavigation.tsx` | client | < lg: paper bar (logo, `NN / Label`, 7-dot progress, **Map** button) + native `<dialog>` expedition map |
| `UiIcon` | `components/ui/UiIcon.tsx` | server | Generic line icons (arrows, folder, menu, close, key, laptop, palm, plane) |
| `WoodSign` | `components/ui/WoodSign.tsx` | server | Wooden sign, `tone` light/dark, optional `href`, optional sandwich-board legs |
| `SceneBackground` | `components/portfolio/SceneBackground.tsx` | server | Fixed full-bleed scene + scrims; scenes registered per `SectionScene` |
| `TerminalScene` | `components/portfolio/scenes/TerminalScene.tsx` | server | **Stand-in** SVG terminal art until a painted plate is supplied |
| `PassportCard` | `components/portfolio/PassportCard.tsx` | server | Taped passport photo (next/image or silhouette fallback), airmail + postmark |
| `DepartureBoard` | `components/portfolio/DepartureBoard.tsx` | server | Accessible `<table>` of `SiteSettings.departures` |
| `NextStopSign` | `components/portfolio/NextStopSign.tsx` | server | Sandwich board linking to the next checkpoint (`section.place`) |
| `AirportIntro` | `components/portfolio/airport/AirportIntro.tsx` | server | Name, roles, tagline, START THE CLIMB / VIEW PROJECTS |
| `GateSign` | `components/portfolio/airport/GateSign.tsx` | server | Decorative "GATE 01" sign (xl+) |

## Built (Phases 3–8)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `ContentIcon` | `components/ui/ContentIcon.tsx` | server | Icon registry referenced by **stored keys** (about items, categories, journey, badges); `CONTENT_ICON_KEYS` for admin pickers |
| `Spark` | `components/ui/Spark.tsx` | server | Three-stroke mark after headings |
| `EmptyState` | `components/ui/EmptyState.tsx` | server | Paper "nothing here yet" note with optional action |
| `StatusBadge` | `components/ui/StatusBadge.tsx` | server | Project status pill with icon (AA colours) |
| `SignPost` | `components/ui/SignPost.tsx` | server | Decorative post with arrow planks (xl+) |
| `CheckpointPage` | `components/portfolio/CheckpointPage.tsx` | server | Scene + padded container for checkpoints 2–7 |
| `AboutIntroCard`, `InfoBoardCard`, `NoticeBoard` | `components/portfolio/about/` | server | Intro card; pinned notes; wood-framed board (CSS columns) |
| `SkillMark`, `SkillCard`, `SkillCategoryPanel`, `GearBoard` | `components/skills/` | server | Logo or monogram; skill tile; category panel; plank board (+ empty state) |
| `ProjectThumbnail`, `TechStack`, `ProjectLinks`, `ProjectCard`, `ProjectDetail` | `components/projects/` | server | Image or themed plate; tech marks; external links; card with flag tab; detail page |
| `ProjectExplorer` | `components/projects/ProjectExplorer.tsx` | client | Search + status filter, live result count, empty state |
| `JourneyCheckpoint`, `JourneyRoute`, `JourneyTimeline` | `components/journey/` | server | Card; computed snaking mountain route (lg+); vertical trail (below lg) |
| `MilestoneBadge`, `MilestoneCard`, `MilestoneCategoryCard` | `components/milestones/` | shared | Enamel hex badge; log entry; category card that toggles the filter |
| `MilestoneExplorer` | `components/milestones/MilestoneExplorer.tsx` | client | Category grid filters the milestone log |
| `SummitActions` | `components/portfolio/SummitActions.tsx` | server | Contact / View Projects / social buttons; hides missing links |
| Scenes | `components/portfolio/scenes/*Scene.tsx` | server | Stand-in SVG art: Terminal, Shore, Jungle, Canyon, Ridge, Citadel, Sunset |

`NextStopSign` gained a `note` prop. `CheckpointPlaceholder` was removed (all checkpoints built).

Hook: `useActiveSection()` (`hooks/useActiveSection.ts`) → `{ section, index }` from the pathname; nested routes map to their parent.

`SectionTitle` gained `subtitle` (line between title and note) and `titleClassName` (size override).

## Planned

| Component | Folder | Phase |
|---|---|---|
| `LoadingSkeleton` | `ui/` | 15 |
| `AdminSidebar`, `AdminHeader`, `StatCard` | `admin/` | 10 |
| `FormField`, `ImageUploader`, `ConfirmDialog`, `ReorderList`, `TechnologyPicker` | `forms/`, `ui/`, `admin/` | 11 |

Update this table as components are built.
