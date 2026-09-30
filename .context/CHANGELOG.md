# Changelog

All meaningful implementation changes, newest first.

## 2026-09-30 — Milestone badge alignment and contrast

- Removed the 32px gallery override that squeezed a 24px icon into a clipped
  enamel center. Gallery badges now use the small badge's 44px size, while Board
  and List use 40px. Gold enamel is darker so its white icon stands out.
- Browser checks confirmed centered, contained icons of at least 20px in all three
  views at 320, 375, 768 and 1440px. Screenshots were inspected; no overflow,
  WCAG A/AA violations or browser exceptions were found.

## 2026-09-30 — Milestone save compatibility fix

- Confirmed the live Supabase project does not yet have `date_display` or `pdf_url`.
  Those missing columns caused both create and edit to show the generic save error.
- The editor now detects schema readiness. Until migration 000004 is applied, it
  saves original milestone fields without the new columns, shows a clear notice and
  hides date-display/PDF controls. Once applied, the new controls appear on refresh.
- The save action rejects unsupported date/PDF values with migration guidance if
  the schema changes while an editor tab is open. Legacy deletion and Media
  reference checks also work with the original milestone table.
- Milestone form failures now appear once in the save bar instead of repeating in a
  toast. Updated the delete confirmation to mention PDFs.
- A temporary QA milestone was created, edited and removed through the admin.
  Live date save and the Media admin page passed; no QA rows remain.

## 2026-09-30 — Milestone views, PDFs and date labels

- Added per-milestone exact-date, month/year and year-only labels. New forms default
  to exact dates; the migration preserves month/year labels for existing entries.
  Stored dates continue to control featured/date ordering within categories.
- Added Gallery, Board and List views grouped by category, with collapsible Gallery
  and List groups and horizontal Board columns. Each entry still opens full details.
- Added milestone PDF uploads (10 MB), previews that take priority over images,
  dialog page controls and original-file links. PDF.js loads lazily; npm predev and
  prebuild prepare locally hosted, versioned worker/font/WASM assets.
- Saved PDF replacement/removal and milestone deletion clean up stored files;
  Media reference checks now protect milestone PDFs. Added domain/schema validation
  and the additive migration `20260930000004_milestone_documents_dates.sql`.
- Journey cards and admin rows show the exact date when present, with period-label
  fallback when absent. Updated admin guidance and deployment/setup documentation.
- Lint, typecheck, production build and PGlite checks passed. Public Edge smoke
  passed 77 layouts, 22 WCAG A/AA audits, six milestone dialogs and view switching.
  Temporary local fixtures passed PDF rendering/precedence, two-page navigation,
  failure fallback, all date labels, Journey fallback and 12 view/width accessibility
  checks. Gallery/Board/List screenshots were inspected; no browser exceptions.
- Live migration and new admin write flows remain pending owner SQL Editor execution.
  No live portfolio content or Storage files were changed. Temporary fixture route
  removed before the final production build.

## 2026-09-30 — Automatic milestone date ordering

- Public and admin milestone queries now order by featured first, then newest date, with undated entries last within each featured group. Existing `display_order` and `id` provide stable ties.
- Removed milestone Move Up/Down controls and their unused Server Action. Category ordering remains manual. Updated the admin page and date-field hint to explain automatic placement after saving; existing save/feature actions already revalidate both views.
- Verified lint, typecheck and production build. Read-only Edge checks confirmed all six public milestones and every admin category follow date order, public filters retain it, move arrows are absent, and the new field hint is present. Admin layouts and WCAG A/AA audits passed at 320/1440px. No portfolio content or media changed.

## 2026-09-30 — Milestone details and featured ordering

### Changed
- Public milestone logs render the admin-uploaded image as a preview. Clicking a card opens a native dialog with the full image, description, issuer/organization/date, certificate/details links and an option to open the original image. Logs without images still open normally; image failures use `SafeImage` fallbacks.
- Dialog supports keyboard opening, Escape, close button, backdrop dismissal, background scroll locking and focus return. Closing preserves the selected category. Proof links remain independent of the card's open action.
- Public projects and milestones order featured items first, then manual display order. Skills follow that order within each category. The project index uses matching ordering so expedition numbers agree across list/detail pages. Admin reorder controls continue using manual order.
- Browser smoke checks now exercise each milestone dialog and scope mobile-map assertions to its own dialog.

### Verified
- Lint, typecheck and production build passed (build workers required the existing sandbox escalation).
- Public browser smoke passed: 9 pages, 63 layouts, 18 WCAG A/AA audits, navigation/filter/404/auth checks and all 6 milestone dialogs.
- Focused read-only checks passed for all 6 milestone details at 320/375/768/1440px, image loading, complete descriptions, keyboard/focus, preview clicks, close/backdrop dismissal, category preservation, featured ordering and modal accessibility. Desktop/mobile screenshots inspected; no browser exceptions.
- No database records or uploaded files changed. The owner is editing live content; the test build contained two published projects, with subsequent additions left untouched.

## 2026-09-30 — Phase 18: Documentation + Deployment

### Completed
- Replaced the foundation-era README and setup outlines with current feature, local development, Supabase and Vercel deployment guides. Documented environment values, publishing, hosted verification, backups, rollback and troubleshooting, with official platform references.
- Clarified modern publishable/secret keys under the existing environment names, optional service key, fixed upload bucket, fresh-only seed execution and SQL Editor versus CLI migration history. Existing live content was preserved.
- Declared Node 24.x in `package.json`, the lockfile and `.nvmrc`, matching the tested runtime. The installed Supabase SDK requires Node 22 or newer; the old Node 20 setup guidance was obsolete.
- Updated the context index, architecture, content/database/design notes and final state. All planned development phases are implemented; Phase 17 approved and Phase 18 complete awaiting final owner approval. Vercel publication, final domain and owner review remain explicit launch tasks.

### Verified
- Lint and typecheck passed. Production build passed on Node 24.19.0; the sandbox attempt compiled but could not spawn a worker (`EPERM`), so the build was rerun with the required process permission.
- Checked 37 local links across 19 documents, matching package/lockfile Node engines and direct dependency entries, and `git diff --check`.
- Phase 17 browser/database results remain the application verification baseline. No hosting deployment, live database mutation or additional browser coverage is claimed for this documentation phase.

## 2026-09-29 — Phase 17: Final Testing

### Added
- `scripts/browser-smoke.mjs` and `npm run test:browser`: read-only production browser checks for public routes, seven viewport widths, axe WCAG A/AA, navigation/keyboard, filters/empty states, 404s, login guards, return-path validation and invalid credentials. Added Playwright and axe-core as development dependencies.
- `npm run test:seo` for the existing SEO smoke script; `.context/TESTING.md` records the matrix, commands, results and coverage limits.

### Fixed
- Gallery uploader no longer announces success when every file is rejected. Mixed batches report only successfully saved screenshots. Verified invalid-only and mixed batches on the final build.
- Removed the obsolete Phase 16 reference from the share-image uploader hint.

### Content
- Saved and enabled the owner's GitHub (`https://github.com/Kaylooww`) and LinkedIn (`https://www.linkedin.com/in/kyle-angelo-castro-59a74b430/`) through the admin; verified the destinations on Summit.
- Confirmed Supabase Email is enabled and public sign-ups are disabled, resolving the earlier configuration blocker.

### Verified
- Final lint, typecheck, build, PGlite database tests, SEO smoke and public browser suite passed. Public/admin audits: 104 layouts, 48 WCAG A/AA audits, zero violations or browser exceptions.
- Live admin workflows: project publishing/privacy/sitemap, CRUD and visibility across skills/categories/About/Journey/milestones, image/gallery uploads and failures, media usage protection, profile/settings revalidation, custom OG precedence, résumé upload/enable/download/hide/removal, URL search and featured flag.
- Admin session return path/logout; valid non-admin credentials rejected by the login form; non-admin session blocked from admin pages and writes. Temporary Auth account removed.
- Final cleanup matched all 12 content tables (excluding update timestamps), found zero Storage objects and one original Auth user. Owner social links retained.
- Owner password sign-in confirmation remains pending. Safari/Firefox/physical devices and deployed crawler/field-performance checks are not claimed; details are in `TESTING.md`.

## 2026-09-29 — Phase 16: Performance + SEO

### Added
- Shared public metadata helpers driven by profile/settings: per-page titles, descriptions, canonical URLs and matching Open Graph/Twitter cards. Project thumbnails take precedence over the site OG upload, then the generated fallback.
- `/share-image`: static 1200×630 expedition PNG generated with `ImageResponse`, database title/roles/tagline, mountain/flag art and hourly revalidation.
- `/sitemap.xml`: seven checkpoints plus only published, visible project slugs; hourly revalidation and invalidation on project mutations. `/robots.txt`: admin exclusion and absolute sitemap URL.
- `scripts/seo-smoke.mjs`: read-only checks against a running production server for metadata, canonical query handling, sitemap, robots, cache headers, admin/404 exclusions, favicons and share-image dimensions.

### Changed
- React `cache()` deduplicates project reads within a render. A lightweight `id, slug` query replaces full project/gallery reads for static params, detail numbering and sitemap.
- Mobile map contents load via `next/dynamic` on first open; dialog shell, close control and native focus handling stay immediately available.
- Responsive sizes refined for the portrait, project detail image and gallery. Replaced deprecated `priority` with `preload`; other images retain lazy loading, AVIF/WebP and fixed aspect ratios.
- Moved the existing ICO from `public/` into `app/` so Next advertises it alongside the SVG icon. Centralized canonical-origin validation and documented production URL configuration in `.env.example`.

### Verified
- `npm run check`: lint, typecheck and production build passed. Public pages, sitemap and share image remain static with hourly revalidation.
- SEO smoke check passed for all 8 live public pages; query parameters excluded from canonicals; admin/404 noindex, both favicons and 1200×630 share image verified. Cached routes returned `HIT`.
- Headless Edge: map chunk (1,513 bytes) requested only after opening; seven links, background inertness, Escape, focus return, navigation and reopen passed. No detail-page horizontal overflow at 320/375/768/1024/1440px; all 3 seed drafts return 404 + noindex; no browser errors.
- Generated share image visually inspected. Live database content unchanged. Deployed crawler checks and real-world performance measurement remain deployment work; no Lighthouse/Core Web Vitals score claimed.

## 2026-09-29 — Phase 15: Polish

### Added
- Motion (CSS): page-level `reveal-stagger` rise-in, Journey trail march, departure-arrow nudge, dialog open/close transitions (map sheet slides in), toast rise-in, button trailing-icon nudge, project card lift + thumbnail zoom. All disabled under reduced motion.
- `SafeImage` (broken-image fallbacks) used by passport photo, project thumbnails/gallery, skill logos (→ monogram), and all admin previews.
- `TrailMessage`; public `(portfolio)/error.tsx`; admin `error.tsx` + `loading.tsx` (`LoadingSkeleton`); `global-error.tsx`; catch-all `(portfolio)/[...rest]`.
- Button disabled styles.

### Changed
- One 404 page, rendered inside the public shell for every public 404 (fixes doubled navigation on unpublished-project 404s and missing navigation on unknown URLs).
- Contrast: skill monogram orange → `sunset-700`; Airport "This way to the climb" marker → solid `blue-600`.
- Sidebar compacts on short screens; mobile map nav labelled "All checkpoints" (unique landmark name).

### Removed
- Root `app/loading.tsx` (it made 404s return HTTP 200) and the unused `motion` dependency.

### Verified
- axe-core WCAG 2.1 A/AA: 0 violations on all public pages (desktop + 375px), the 404, login, and 14 admin pages.
- Keyboard: skip link → main, visible focus rings, mobile map opens with Enter, traps focus, closes with Esc, returns focus.
- Reduced motion: content visible immediately; trail not animated.
- HTTP 404 for unknown URLs and unpublished projects, each with exactly one navigation/main/h1.
- No horizontal overflow at 320/375/430/768/1024; screenshots at 430, 768, 1024, 1920, landscape phone and 1280×540.

## 2026-09-29 — Phase 14: Public Database Integration

### Changed
- Every public query (`profile`, `site-settings`, `about`, `skills`, `projects`, `journey`, `milestones`, `social-links`) now reads Supabase through a shared cookie-less anon client (`src/lib/queries/public-db.ts`), with explicit published/visible filters on top of RLS. Singletons use React `cache()`; missing singletons fall back safely.
- Project queries join technologies (hidden skills dropped) and screenshots in one request.
- `(portfolio)/layout.tsx`: `revalidate = 3600` safety net; pages remain static (ISR) and admin saves revalidate them on demand.
- Summit shows a **Résumé** button when downloads are enabled and a PDF is uploaded (`getResumeUrl()`).
- Admin dashboard note now says edits go live immediately.
- Copy: singular "1 expedition" / "1 milestone"; milestone category bullets never start a line.

### Removed
- `src/lib/mock/*` and `src/lib/utils/order.ts`.

### Verified (production build, live Supabase)
- Public pages render DB content; drafts, hidden and archived items absent — including from the raw HTML / streamed payload.
- Admin → public: project draft (not public, detail 404) → publish (listed, detail renders on demand) → hide (gone, 404) → show → archive (gone, 404); profile tagline → Airport; skill hide/show → Skills; social link shown → Summit; milestone hidden → Milestones.
- All touched tables restored identically; every public page matched its pre-test HTML after revalidation. No horizontal overflow at 320px.

## 2026-09-29 — Phase 13: Content Management

### Added
- `/admin/profile` (name lines, roles, tagline, intro/bio, location, email, photo, résumé PDF), `/admin/about` (cards with repeatable lines + icons), `/admin/journey` (checkpoints), `/admin/milestones` (+ new/edit/categories), `/admin/settings` (SEO text, share image, departure board, Summit text, résumé toggle, social links), `/admin/media` (storage browser with usage, delete unused).
- Actions `src/lib/actions/content.ts`, `src/lib/actions/milestones.ts`, `deleteMediaFile`; schemas `src/lib/validation/content.ts`; reads `src/lib/queries/admin-content.ts`; `src/lib/admin/media-references.ts`.
- Helpers `nextDisplayOrder`, `moveRow`, `moveRowInCategory`, `setVisibility`, `deleteById`; components `InlineListManager`, `useFormAction`, `FormSaveBar`, `DocumentUploader`, content/milestone editors, `MediaBrowser`.
- `validateDocumentFile`, `MEDIA_ROOTS`, `site` media folder; `discardUpload` covers every folder and checks all references.
- Dashboard "+ Add milestone" → `/admin/milestones/new`.

### Changed
- Skill actions use the new generic ordering helpers.

### Removed
- `AdminComingSoon` placeholder and `AdminNavItem.phase`.

### Verified (live Supabase, admin session)
- 61-check browser run across profile (validation, photo/PDF upload, save, photo removal deletes file), About (add with lines/icons, reorder, hide + RLS, inline edit, delete), Journey (validation, add, reorder, delete), Settings (summit text, new departure, résumé toggle), social links (https validation, email → mailto:, RLS, delete), milestone categories + milestones (auto slug, accent/icon, image upload, grouping, in-category reorder, feature, hide + RLS, image removal deletes file, delete, category delete → uncategorised), Media (in-use file locked, unused filter, delete unused). Two script expectations were wrong (uppercase button text; jsonb key order); behaviour was correct.
- All seven touched tables and the storage bucket verified identical to before the run.

## 2026-09-29 — Phase 12: Skills Management

### Added
- `/admin/skills` (grouped by category like the public board, Uncategorised group, URL search + category filter, in-category reorder, featured/visible, delete with project-usage warning), `/admin/skills/new`, `/admin/skills/[id]/edit` (logo upload, fallback icon, proficiency, live preview, danger zone), `/admin/skills/categories` (add, inline edit, reorder, show/hide, delete → skills become uncategorised).
- `src/lib/actions/skills.ts` (8 actions), `src/lib/validation/skill.ts`, `src/lib/queries/admin-skills.ts`.
- Shared: `AdminFilters`, `RowIconButton`/`EyeIcon`, `useAdminAction`, `DangerDeleteButton`, `FormSection`, `IconPicker`; server-only `src/lib/admin/helpers.ts`; `src/lib/actions/media.ts` (`discardUpload` for projects/ and skills/).
- Dashboard "+ Add skill" → `/admin/skills/new`.

### Changed
- Project actions/components refactored onto the shared helpers (`ProjectFilters` → `AdminFilters`, `DeleteProjectButton` → `DangerDeleteButton`, shared `FormSection`/`EyeIcon`); behaviour unchanged.

### Verified (live Supabase, admin session)
- 47-step browser run: grouping, search, category filter; category create (auto slug, icon), reorder, hide (RLS), show, inline edit; skill validation (required, proficiency range, duplicate slug), logo upload, create in category, in-category reorder (other skills' order untouched), unfeature, hide (RLS), appears in project tech picker, logo removal deletes file, delete with project-usage warning cascades the tech link, category delete leaves skill uncategorised. (One expectation in the script was wrong: "java" correctly matches 3 skills incl. JavaScript.)
- Categories, skills and project technologies verified byte-identical to before the run; no files left in storage.

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
