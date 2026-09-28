# Changelog

All meaningful implementation changes, newest first.

## 2026-09-27 — Phase 11: Project Management

### Added
- `react-hook-form`, `@hookform/resolvers`.
- Project admin: `/admin/projects` (list, URL search/filters, reorder, featured, visibility, publish/unpublish, archive/restore, delete with confirm), `/admin/projects/new`, `/admin/projects/[id]/edit` (full editor, screenshots, danger zone).
- `src/lib/actions/projects.ts` — 10 Server Actions (requireAdmin → zod → admin session write → revalidate); storage cleanup on delete/replace.
- `src/lib/actions/result.ts` (`ActionResult`, DB error mapping), `src/lib/validation/project.ts` (`projectFormSchema`, `slugify`, row ↔ form converters), `src/lib/storage/media.ts` (file rules, safe paths, URL → storage path), `src/lib/queries/admin-projects.ts`.
- UI: `Toast`, `ConfirmDialog`, `TextAreaField`, `SelectField`, `CheckboxField`, `ImageUploader`, `ContentStatePill`, project list/row/filter/form/picker/images/delete components; `UiIcon` `trash`.
- Dashboard "+ Add project" → `/admin/projects/new`.

### Changed
- `AdminSidebar` keeps the active tab in view on small screens.

### Verified (live Supabase, admin session)
- 41-step browser run: list/filters/search/empty state; validation (required, slug format, URL, file type); auto slug; thumbnail upload; draft save + DB fields, feature lines, tech order; RLS hides drafts; screenshots upload/alt/reorder/delete (+ file removal); publish (RLS shows it); duplicate slug field error; feature/hide (RLS hides)/move/archive; delete with confirm → row, cascades, and all stored files removed.
- Test project removed; real projects renumbered 1–4 in their original order; no test files left in storage.

## 2026-09-27 — Phase 10: Authentication + Admin Foundation

### Added
- `zod` (direct dependency).
- `src/proxy.ts` — refreshes Supabase session cookies (`getClaims()`), redirects signed-out `/admin/*` to `/admin/login?next=…`.
- `src/lib/auth/admin.ts` — `isAdminEmail`, cached `getAdminSession()` (`getUser()`), `requireAdmin()`; `src/lib/auth/paths.ts` — `safeAdminPath()` (no open redirects), public admin paths.
- `src/lib/actions/auth.ts` — `signIn` / `signOut` Server Actions; generic errors; non-admin accounts signed back out; clear message when the Email provider is disabled.
- `src/lib/validation/auth.ts` — zod sign-in schema.
- Admin routes: `/admin/login`, `/admin/unauthorized`, `(protected)` group with dashboard and placeholder pages for Profile, About, Skills, Projects, Journey, Milestones, Media, Settings. Admin layout is `noindex`.
- Dashboard: 6 live stat cards (projects total/published/draft, skills, milestones, journey), quick actions, note that the public site still uses mocks.
- Components: `AdminSidebar`, `AdminHeader`, `AdminPageHeader`, `StatCard`, `AdminComingSoon`, `LoginForm`, `SignOutButton`, `TextField`; `UiIcon` `log-out`; `lib/constants/admin-nav.ts`.

### Verified (against the live Supabase project)
- Real admin email is in `private.admin_users` (admin session sees 4 projects, all social links).
- Browser flows: signed-out redirects with `next`, validation + generic errors, session → section/dashboard, `/admin/login` bounces a signed-in admin, logout, non-admin session → unauthorized on every route, open-redirect attempts neutralised.
- Temporary test user created for the run and deleted afterwards.

## 2026-09-27 — Phase 9: Supabase + Database

### Added
- `@supabase/ssr`, `@supabase/supabase-js`; dev: `@electric-sql/pglite`.
- `src/lib/supabase/`: `env.ts` (validation, `STORAGE_BUCKET`), `client.ts` (browser), `server.ts` (cookies), `public.ts` (cookie-less anon for static public reads), `admin.ts` (service role, `server-only`).
- `src/types/database.ts` — `Database` generic derived from `content.ts`, with FK relationships; type-probed against real query shapes.
- `supabase/migrations/20260927000001_schema.sql` (enums, 12 tables, checks, indexes, `updated_at` + `published_at` triggers, singleton indexes), `..._rls.sql` (`private.admin_users`, `private.is_admin()`, policies on every table), `..._storage.sql` (`portfolio-media` bucket, admin-only writes, no SVG).
- `supabase/seed.sql` — mirrors the mocks; sample projects as drafts, social links hidden.
- `scripts/db-test.mjs` + `npm run db:test` — 28 checks (migrations, seed, RLS for anon/non-admin/admin, constraints, triggers).
- Docs: `supabase/README.md`, `.context/DATABASE.md` (as built), DEPLOYMENT/README/CLAUDE commands.

## 2026-09-27 — Phase 8: Summit

### Added
- `/summit`: `SunsetScene` (planted waving flag), THE SUMMIT hero, `summit_note` + `summit_message` from site settings, `SummitActions` (Contact, View Projects, GitHub, LinkedIn; missing links hidden).
- `social_links` mock + `getSocialLinks()`; `SiteSettings.summit_note` / `summit_message`.
- `SceneBackground` now requires a scene for every checkpoint.

### Removed
- `CheckpointPlaceholder` (every checkpoint is built).

### Verified
- All public pages together: one `h1` each, no "Peak", no overflow at 320/375/768, internal links resolve, drafts/archived/hidden content never rendered, `/peak` 404.

## 2026-09-27 — Phase 7: Milestones

### Added
- `/milestones`: `CitadelScene`, category line from data, `MilestoneExplorer` (category badge cards toggle the log filter), `MilestoneCategoryCard`, `MilestoneCard`, `MilestoneBadge` (enamel hex), empty states, signpost, "Final ascent" sign.
- Tokens `gold-500/700`, `plum-600` (badge enamel only).
- `mock/milestones.ts` + `getMilestoneCategories()` / `getMilestones()`.

### Fixed
- Mobile overflow from unbreakable category separators.

## 2026-09-27 — Phase 6: Journey

### Added
- `/journey`: `RidgeScene`, `JourneyRoute` (computed snaking route, glowing dotted SVG trail, posts + pennants, summit flag), `JourneyTimeline` (mobile), `JourneyCheckpoint`.
- `mock/journey.ts` + `getJourneyEntries()`.

## 2026-09-27 — Phase 5: Projects

### Added
- `/projects`: `CanyonScene`, `ProjectExplorer` (search + status filter, live count, clear filters), `ProjectCard` (flag tab, thumbnail, status, stack, role, actions), `StatusBadge`, `ProjectThumbnail` (themed fallback), `TechStack`, `ProjectLinks`, `SignPost`.
- `/projects/[slug]`: `ProjectDetail`, `generateStaticParams`, `generateMetadata`; unpublished → `notFound()`.
- `mock/projects.ts` (1 real, 3 labelled samples, 1 draft, 1 archived) + `getPublishedProjects()` / `getPublishedProjectBySlug()`; `formatMonthYear`, `padNumber`.
- `UiIcon`: arrow-left, external, github, linkedin, mail, search.

## 2026-09-27 — Phase 4: Skills

### Added
- `/skills`: `JungleScene`, `GearBoard`, `SkillCategoryPanel`, `SkillCard`, `SkillMark` (logo or monogram), `EmptyState`, "Higher skills, brighter ideas" sign.
- `mock/skills.ts` + `getSkillCategoriesWithSkills()` / `getSkillsById()`; `SkillCategoryWithSkills` type.

## 2026-09-27 — Phase 3: About

### Added
- `/about`: `ShoreScene`, `CheckpointPage` frame, `AboutIntroCard`, `NoticeBoard`, `InfoBoardCard` (goals as checklist).
- `ContentIcon` registry (stored icon keys), `Spark` (extracted from `SectionTitle`), `visibleInOrder()`.
- `mock/about.ts` + `getAboutCards()`; profile intro/bio/location.
- `NextStopSign` `note` prop.

## 2026-09-27 — Phase 2: Public Navigation + Airport

### Added
- Navigation: `TopNavigation` (floating paper pill, lg+), `ExpeditionSidebar` (route map with dashed/solid trail, lg+), `MobileNavigation` (paper bar + 7-dot progress + native `<dialog>` expedition map), `CheckpointIcon`, `useActiveSection()` hook. Mounted in `PortfolioShell`.
- Airport page (`/`): `SceneBackground` + `TerminalScene` (SVG stand-in), `PassportCard`, `AirportIntro`, `DepartureBoard` (semantic table), `GateSign`, `NextStopSign`, subtle Admin link.
- UI: `UiIcon`, `WoodSign`.
- Data seam: `src/lib/queries/profile.ts` + `site-settings.ts` (`server-only`) backed by `src/lib/mock/profile.ts` + `site-settings.ts`. Added `server-only` dependency.
- `sections.ts`: `place` field (in-world name for "Next stop" signs), `getSectionForPath()`, `getNextSection()`.
- `DEPARTURE_STATUS_LABEL`; `DepartureRow.icon`, `SiteSettings.departures_note`.
- Global scroll lock while a `<dialog>` is open.

### Changed
- `SectionTitle`: new `subtitle` and `titleClassName` props; redrawn spark strokes.
- `cn()` now uses `extendTailwindMerge` so custom `text-*`, `rounded-*`, `shadow-*` tokens merge correctly.

### Removed
- `FoundationPreview` (Phase 1 token specimen).

## 2026-09-25 — Phase 1: Foundation

### Added
- Next.js 16.3 (App Router, Turbopack) project with React 19.3, TypeScript 6 (strict + `noUncheckedIndexedAccess`), Tailwind CSS 4.3, ESLint 9 flat config (`eslint-config-next`), Motion, clsx, tailwind-merge.
- npm scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `check`.
- Design tokens in `src/styles/globals.css`: colour (default palette reset), status colours (AA-checked), fluid type scale, radii, shadows, motion, breakpoints, layout variables, surface utilities (`surface-paper`, `surface-wood`, `surface-board`, scrims), reduced-motion guard, focus ring.
- Self-hosted fonts via `next/font/local`: Baloo 2 (display), Kalam (handwritten), Nunito (body).
- Section model `src/lib/constants/sections.ts` (Airport → Summit), site constants, status constants.
- Domain types for every content entity (`src/types/content.ts`).
- Base components: `LogoMark`, `PaperCard`, `ButtonLink`/`buttonClasses`, `SectionTitle`, `Container`, `SkipLink`, `PortfolioShell`, `CheckpointPlaceholder`, `FoundationPreview`.
- Root layout with metadata + viewport; `(portfolio)` route group layout; placeholder pages for all public routes; `loading`, `error`, `not-found`; `icon.svg` + `favicon.ico`.
- Full folder structure (empty folders kept with `.gitkeep`).
- Documentation: `CHECKPOINTS.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, `DEPLOYMENT.md` (initial), `.env.example`, `.gitignore`, `supabase/README.md`, and the whole `.context/` folder including `REFERENCES.md` and the seven reference images.

### Decisions
- Route protection will use Next 16 `proxy.ts` + server-side checks + RLS.
- No admin pages until Phase 10 (avoid unprotected stubs).
