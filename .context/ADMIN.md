# Admin

> **Status:** auth, protection, shell and dashboard built in **Phase 10**; **Projects editor built in Phase 11**; **Skills built in Phase 12**; **all remaining sections built in Phase 13** — the admin is feature-complete.

## Authentication
- Supabase Auth, email + password. **No public registration** — the admin user is created manually in the Supabase dashboard; `ADMIN_EMAIL` names it.
- Entry: a small, low-contrast "Admin" link at the bottom-right of the Airport page → `/admin/login`. Its subtlety is cosmetic, not security.
- Login errors are generic ("Email or password is incorrect.") — never reveal which part was wrong. A valid account that isn't `ADMIN_EMAIL` gets the same message and no session. Exception: if the project's Email provider is off, the form says so (it's a setting, not a credential leak).
- The Supabase **Email provider must stay enabled**; only "Allow new users to sign up" is turned off.
- `?next=` return paths are sanitised by `safeAdminPath()` (`src/lib/auth/paths.ts`): only `/admin…`, no `//`, `\`, `..` — no open redirect.

## Authorization (defence in depth)
1. `src/proxy.ts` (Next 16's renamed middleware, matcher `/admin/:path*`) refreshes the session cookie via `getClaims()` and redirects signed-out requests to `/admin/login?next=…`. `/admin/login` and `/admin/unauthorized` are public.
2. `app/admin/(protected)/layout.tsx` **and every protected page** call `requireAdmin()` (`src/lib/auth/admin.ts`): `getUser()` against the Auth server (cached per request) + `ADMIN_EMAIL` match. Signed out → login; signed in but not admin → `/admin/unauthorized`.
3. Every Server Action re-verifies with `requireAdmin()` before writing (from Phase 11).
4. RLS on every table and the storage bucket enforces `is_admin()` for writes.
The service-role key is never used for normal admin writes — the admin's own session + RLS is.

## Layout
Simplified dashboard ("Base Camp"): cream canvas, paper panels, navy sidebar text, blue actions. No scenic backgrounds, `noindex`.
Below `lg` the sidebar becomes a horizontally scrolling tab row. Every section has its editor; no placeholder pages remain.
Files: `app/admin/layout.tsx` (canvas + robots), `app/admin/(protected)/*`, `app/admin/login`, `app/admin/unauthorized`; components in `components/admin/`; nav in `lib/constants/admin-nav.ts`; stats in `lib/queries/admin-dashboard.ts` (admin's own session, so RLS applies).
Sidebar: Dashboard · Profile · About · Skills · Projects · Journey · Milestones · Media · Settings · Logout.
Dashboard stats: Total Projects, Total Skills, Total Milestones, Journey Entries, Published Projects, Draft Projects. Quick actions: + Add Project, + Add Skill, + Add Milestone.

## Projects (built Phase 11)
- `/admin/projects` — every project in any state, display order. Search (title/summary/slug) + state + status filters live in the URL (`?q=&state=&status=`). Per row: move up/down (unfiltered list only), featured ★, visible 👁, Publish/Unpublish, Archive/Restore, Edit, Delete (confirm).
- `/admin/projects/new`, `/admin/projects/[id]/edit` — `ProjectForm` (React Hook Form + `projectFormSchema`): title → auto slug (until edited), summary (≤300), status, role, thumbnail upload, overview/problem/solution/features (one per line)/process, tech stack picker (order = pick order, adjustable), GitHub/demo/docs URLs (`https://` only), start/finish dates (finish ≥ start), featured, visible. Buttons depend on state: Save draft / Publish, or Save as draft / Update published, or Save (keep archived) / Publish.
- Edit page also has **Screenshots** (multi-upload, alt text + caption, reorder, delete) and a **Danger zone** delete.
- Screenshot upload errors are reported per file; a success message appears only for saved screenshots and reports the actual count for batches (Phase 17 regression fix).
- Server Actions: `src/lib/actions/projects.ts` (`saveProject`, `setProjectContentState`, `setProjectFlag`, `moveProject`, `deleteProject`, `addProjectImage`, `updateProjectImage`, `moveProjectImage`, `deleteProjectImage`, `discardUpload`). Reordering renumbers the whole list 1..n. Deleting a project or screenshot removes its stored files; replacing a thumbnail deletes the old file.
- Uploads go browser → Supabase Storage directly (`uploadImage()` in `components/forms/ImageUploader.tsx`) with the admin's session; only the resulting URL is sent to the Server Action. Paths: `projects/<id>/…` (or `projects/new-<uuid>/…` before the first save), sanitised names, unique prefixes.
- Edits revalidate `/`, `/projects`, `/projects/[slug]` and the admin, so the public site updates on the next request (verified in Phase 14).

## Skills (built Phase 12)
- `/admin/skills` — skills grouped exactly like the public gear board (category order → skill order), plus an **Uncategorised** group (never public until assigned). Search (name/slug/description) + category filter in the URL. Per row: move up/down **within its category** (unfiltered only), featured ★, visible 👁, Edit, Delete (confirm; warns how many projects list it).
- `/admin/skills/new`, `/admin/skills/[id]/edit` — `SkillForm`: name → auto slug, category (or uncategorised), description (tooltip), optional proficiency 0–100, logo upload (`skills/`, square), fallback icon (`IconPicker`), featured, visible; live `SkillMark` preview; danger-zone delete.
- `/admin/skills/categories` — `CategoryManager`: add, inline edit (name, slug, panel icon, visible), reorder, show/hide, delete (skills stay, become uncategorised — `ON DELETE SET NULL`).
- Actions: `src/lib/actions/skills.ts` (`saveSkill`, `setSkillFlag`, `moveSkill`, `deleteSkill`, `saveSkillCategory`, `setSkillCategoryVisibility`, `moveSkillCategory`, `deleteSkillCategory`). Deleting a skill cascades its project-technology links and removes its logo file; replacing/removing a logo deletes the old file.
- New skills appear immediately in the project editor's tech-stack picker.

## Content sections (built Phase 13)
- `/admin/profile` — singleton form: full name, two display lines, roles (one per line), tagline, intro, second paragraph, location, public email, passport photo (`profile/`), résumé PDF (`resume/`). Replacing/removing a photo or résumé deletes the old file.
- `/admin/about` — About notice-board cards (`InlineListManager`): type, title, 1–12 lines each with an optional icon (goals render as a checklist), reorder, show/hide, inline edit, delete.
- `/admin/journey` — checkpoints (period, title, subtitle, note, optional date, icon), oldest first; reorder, show/hide, inline edit, delete.
- `/admin/milestones` — grouped by category (+ Uncategorised), URL search/category filter, automatic date ordering with featured entries first, show/hide, delete; `/new` + `/[id]/edit` (category, date, issuer, organization, description, certificate/details links, image `milestones/`, badge icon override, featured, visible; danger zone). `/admin/milestones/categories` — name, auto slug, description, badge colour + icon (live badge preview), visible, reorder, delete (milestones stay, uncategorised).
- `/admin/settings` — site title/description, share image (`site/`), departure board rows (destination, status, icon; ≤6, reorder), board note, Summit note + closing message, "Offer résumé download" toggle; **social links** manager below (platform, label, URL; email stored as `mailto:`; visible, reorder, delete).
- `/admin/media` — every file in the bucket with size and where it's used (`findMediaReferences()`), folder filters incl. **Unused**, copy link, open, delete **only unused** files (re-checked server-side in `deleteMediaFile`).
- Actions: `src/lib/actions/content.ts` (profile, settings, about/journey/social via `setListItemVisibility` / `moveListItem` / `deleteListItem` + per-entity save), `src/lib/actions/milestones.ts`, `src/lib/actions/media.ts` (`deleteMediaFile`, `discardUpload`). Schemas: `src/lib/validation/content.ts`. Reads: `src/lib/queries/admin-content.ts`.

## Public milestone details and featured order

If migration `20260930000004_milestone_documents_dates.sql` has not been applied,
the milestone editor shows a notice and allows saves with the original fields.
Date-display and PDF controls appear automatically after the migration is applied
and the editor is refreshed. Existing rows continue to show month/year until changed.

- Set **Date** and **Show date as**: exact date, month and year, or year only.
  New entries default to exact date; existing entries keep month/year until changed.
  The full date still controls automatic sorting.
- Upload an image or a **PDF (optional)** under Proof & links. PDFs accept up to
  10 MB and take precedence over the image. Remove the PDF and save to show the
  image again. Replacing/removing a saved PDF deletes its old uploaded file;
  deleting a milestone removes both files. Media protects PDFs still in use.
- Visitors can switch between **Gallery**, **Board**, and **List**. All group by
  category; Gallery and List groups can be collapsed. Gallery shows image/PDF
  previews. Click an entry in any view for full details, PDF page controls and
  original-file links. Certificate/details links appear when set.
- Journey cards and the admin list show the exact date when supplied, otherwise
  the year/period label. Journey's manual order is unchanged.
- Featured projects and milestones appear before non-featured entries. Featured
  skills lead their category. Projects and skills keep manual order within each group.
- Milestones sort by date, newest first, within each category's featured group in both public
  and admin lists. Undated entries follow dated entries within their group. Save a
  date to update placement automatically; milestone categories retain Move Up/Down.

## Shared admin building blocks
`AdminFilters` (URL search + selects), `RowIconButton`/`EyeIcon`, `useAdminAction` (transition + toast), `useFormAction` (RHF submit + field errors), `FormSaveBar`, `InlineListManager`, `DangerDeleteButton` (bound Server Action + confirm + redirect), `FormSection`, `IconPicker`, `DocumentUploader`; server-only `src/lib/admin/helpers.ts` (`fieldErrorsFrom`, `removeStoredFiles`, `renumber`, `swapInOrder`, `nextDisplayOrder`, `moveRow`, `moveRowInCategory`, `setVisibility`, `deleteById`) and `media-references.ts` — kept out of `"use server"` files so they aren't exposed as endpoints; `src/lib/actions/media.ts` `discardUpload` (projects/ and skills/).

## CRUD pattern (all entities)
List (search + filter + reorder) → form page or dialog (React Hook Form + Zod, same schema re-validated in the Server Action) → toast on success ("Project published") → `revalidatePath` so the public site updates on the next request.
Destructive actions use `ConfirmDialog`: *Delete "Project Name"? This action cannot be undone.* [Cancel] [Delete Project].

## Publishing workflow
Save Draft → `content_state = 'draft'` (never public).
Publish → `content_state = 'published'`, `published_at = now()` if empty → visible publicly on next request.
Archive → hidden publicly, restorable. Delete → permanent, with confirmation.

## Uploads
Validated client-side (`src/lib/storage/media.ts`: PNG/JPEG/WebP/AVIF ≤ 5 MB; PDF ≤ 10 MB for resume/certificates) and again by the bucket (type allow-list, 10 MB limit). **No SVG** (can carry script). Sanitised filenames with unique prefixes, stored under entity folders.
