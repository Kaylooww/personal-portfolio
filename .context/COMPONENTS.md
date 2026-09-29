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

## Built (Phase 10 — admin)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | client | Section nav with active state; sidebar (lg+) / tab row (below lg); Log out |
| `AdminHeader` | `components/admin/AdminHeader.tsx` | server | Signed-in email + "View site" |
| `AdminPageHeader` | `components/admin/AdminPageHeader.tsx` | server | Page title, description, actions |
| `StatCard` | `components/admin/StatCard.tsx` | server | Dashboard number tile linking to its section |
| `AdminComingSoon` | `components/admin/AdminComingSoon.tsx` | server | Placeholder for sections built later |
| `LoginForm` | `components/admin/LoginForm.tsx` | client | `useActionState` + `signIn` Server Action; works without JS |
| `SignOutButton` | `components/admin/SignOutButton.tsx` | client | Form posting to `signOut`, pending state |
| `TextField` | `components/forms/TextField.tsx` | client-usable | Labelled input with hint/error wired to `aria-describedby` |

## Built (Phase 11 — project management)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `ToastProvider` / `useToast` | `components/ui/Toast.tsx` | client | Success/error notes (`role=status`/`alert`), mounted in the admin layout |
| `ConfirmDialog` | `components/ui/ConfirmDialog.tsx` | client | Native `<dialog>` confirmation; focus starts on Cancel |
| `TextAreaField`, `SelectField`, `CheckboxField` | `components/forms/` | client-usable | Labelled fields matching `TextField` |
| `ImageUploader` + `uploadImage()` | `components/forms/ImageUploader.tsx` | client | Direct-to-Storage upload, preview, replace/remove, discard of abandoned uploads |
| `ContentStatePill` | `components/admin/ContentStatePill.tsx` | server | Draft / Published / Archived |
| `ProjectAdminList`, `ProjectRowActions`, `ProjectFilters` | `components/admin/projects/` | server / client / client | List rows; row actions; URL-driven search + filters |
| `ProjectForm`, `TechnologyPicker` | `components/admin/projects/` | client | RHF + zod editor; ordered skill picker |
| `ProjectImagesManager`, `DeleteProjectButton` | `components/admin/projects/` | client | Screenshot gallery manager; danger-zone delete |

`UiIcon` gained `trash`. `AdminSidebar` scrolls the active tab into view on small screens.

## Built (Phase 12 — skills management)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `AdminFilters` | `components/admin/AdminFilters.tsx` | client | Generic URL-driven search + select filters (Projects and Skills use it) |
| `RowIconButton`, `EyeIcon` | `components/admin/RowIconButton.tsx` | client | Row action button; show/hide icon |
| `useAdminAction` | `components/admin/useAdminAction.ts` | client hook | Run a Server Action in a transition and toast the result |
| `DangerDeleteButton` | `components/admin/DangerDeleteButton.tsx` | client | Confirmed delete via a bound Server Action, then redirect (replaced `DeleteProjectButton`) |
| `FormSection` | `components/admin/FormSection.tsx` | server | Paper panel for form groups |
| `IconPicker` | `components/forms/IconPicker.tsx` | client | Radio grid over `CONTENT_ICON_KEYS` (optional "none") |
| `SkillAdminList`, `SkillRowActions`, `SkillForm` | `components/admin/skills/` | server / client / client | Grouped list; row actions; editor with logo + icon |
| `CategoryManager`, `CategoryForm` | `components/admin/skills/` | client | Category list with inline edit; create/edit form |

## Built (Phase 13 — content management)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `InlineListManager` | `components/admin/InlineListManager.tsx` | client | Generic ordered list: inline create/edit, reorder, show/hide, confirmed delete |
| `useFormAction`, `FormSaveBar` | `components/admin/` | client hook / server | RHF → Server Action submit with field errors; save footer (sticky or inline) |
| `DocumentUploader` | `components/forms/DocumentUploader.tsx` | client | PDF upload to Storage (résumé) |
| `ProfileForm`, `SiteSettingsForm` | `components/admin/content/` | client | Singleton editors (departures via `useFieldArray`) |
| `AboutCardsManager` + `AboutCardForm` | `components/admin/content/` | client | About cards with repeatable lines + icons |
| `JourneyManager` + `JourneyForm` | `components/admin/content/` | client | Journey checkpoints |
| `SocialLinksManager` | `components/admin/content/` | client | Social links (email → `mailto:`) |
| `MilestoneAdminList`, `MilestoneForm`, `MilestoneCategoryManager` | `components/admin/milestones/` | client | Grouped list + row actions; editor; categories with live badge preview |
| `MediaBrowser` | `components/admin/MediaBrowser.tsx` | client | Storage browser with usage, filters, copy link, delete unused |

Removed: `AdminComingSoon` (no placeholders left). `AdminNavItem.phase` removed.

## Built (Phase 15 — polish)

| Component | Path | Kind | Purpose |
|---|---|---|---|
| `SafeImage` | `components/ui/SafeImage.tsx` | client | next/image with a `fallback` when the file fails to load; used by every image |
| `TrailMessage` | `components/ui/TrailMessage.tsx` | server | 404 / error message block (logo, eyebrow, title, handwritten note, actions) |
| `LoadingSkeleton`, `SkeletonBlock` | `components/ui/LoadingSkeleton.tsx` | server | Page-shaped admin loading placeholder |

`ButtonLink`/`buttonClasses`: disabled styles + trailing-icon hover nudge. `SkillMark` monogram tones all ≥ 4.5:1 with white text (`sunset-700` replaces `sunset-600`). `ExpeditionSidebar` compacts on short viewports (≤ 620px tall).

Hook: `useActiveSection()` (`hooks/useActiveSection.ts`) → `{ section, index }` from the pathname; nested routes map to their parent.

`SectionTitle` gained `subtitle` (line between title and note) and `titleClassName` (size override).

## Planned

| Component | Folder | Phase |
|---|---|---|

Update this table as components are built.
