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
| `CheckpointPlaceholder` | `components/portfolio/CheckpointPlaceholder.tsx` | server | Temporary page body for unbuilt checkpoints (delete by Phase 8) |
| `FoundationPreview` | `components/portfolio/FoundationPreview.tsx` | server | Phase 1 token specimen at `/` (delete in Phase 2) |

## Planned

| Component | Folder | Phase |
|---|---|---|
| `TopNavigation`, `ExpeditionSidebar`, `MobileNavigation`, `CheckpointIcon` | `navigation/` | 2 |
| `SceneBackground` (responsive art plate + scrim) | `portfolio/` | 2 |
| `PassportCard`, `DepartureBoard`, `WoodSign` | `portfolio/`, `ui/` | 2 |
| `PageHero` | `portfolio/` | 2–3 |
| `InfoBoardCard` | `portfolio/` | 3 |
| `SkillCategory`, `SkillCard` | `skills/` | 4 |
| `ProjectCard`, `StatusBadge`, `ProjectFilters`, `ProjectGallery` | `projects/`, `ui/` | 5 |
| `JourneyRoute`, `JourneyCheckpoint` | `journey/` | 6 |
| `MilestoneBadge`, `MilestoneCard` | `milestones/` | 7 |
| `EmptyState`, `LoadingSkeleton` | `ui/` | 4–5 (first use) |
| `AdminSidebar`, `AdminHeader`, `StatCard` | `admin/` | 10 |
| `FormField`, `ImageUploader`, `ConfirmDialog`, `ReorderList`, `TechnologyPicker` | `forms/`, `ui/`, `admin/` | 11 |

Update this table as components are built.
