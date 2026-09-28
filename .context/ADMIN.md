# Admin

> **Status:** auth, protection, shell and dashboard built in **Phase 10**; **Projects editor built in Phase 11**. Skills (12), everything else (13).

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
Below `lg` the sidebar becomes a horizontally scrolling tab row. Sections not built yet show a protected "Trail under construction" placeholder naming the phase that delivers them.
Files: `app/admin/layout.tsx` (canvas + robots), `app/admin/(protected)/*`, `app/admin/login`, `app/admin/unauthorized`; components in `components/admin/`; nav in `lib/constants/admin-nav.ts`; stats in `lib/queries/admin-dashboard.ts` (admin's own session, so RLS applies).
Sidebar: Dashboard · Profile · About · Skills · Projects · Journey · Milestones · Media · Settings · Logout.
Dashboard stats: Total Projects, Total Skills, Total Milestones, Journey Entries, Published Projects, Draft Projects. Quick actions: + Add Project, + Add Skill, + Add Milestone.

## Projects (built Phase 11)
- `/admin/projects` — every project in any state, display order. Search (title/summary/slug) + state + status filters live in the URL (`?q=&state=&status=`). Per row: move up/down (unfiltered list only), featured ★, visible 👁, Publish/Unpublish, Archive/Restore, Edit, Delete (confirm).
- `/admin/projects/new`, `/admin/projects/[id]/edit` — `ProjectForm` (React Hook Form + `projectFormSchema`): title → auto slug (until edited), summary (≤300), status, role, thumbnail upload, overview/problem/solution/features (one per line)/process, tech stack picker (order = pick order, adjustable), GitHub/demo/docs URLs (`https://` only), start/finish dates (finish ≥ start), featured, visible. Buttons depend on state: Save draft / Publish, or Save as draft / Update published, or Save (keep archived) / Publish.
- Edit page also has **Screenshots** (multi-upload, alt text + caption, reorder, delete) and a **Danger zone** delete.
- Server Actions: `src/lib/actions/projects.ts` (`saveProject`, `setProjectContentState`, `setProjectFlag`, `moveProject`, `deleteProject`, `addProjectImage`, `updateProjectImage`, `moveProjectImage`, `deleteProjectImage`, `discardUpload`). Reordering renumbers the whole list 1..n. Deleting a project or screenshot removes its stored files; replacing a thumbnail deletes the old file.
- Uploads go browser → Supabase Storage directly (`uploadImage()` in `components/forms/ImageUploader.tsx`) with the admin's session; only the resulting URL is sent to the Server Action. Paths: `projects/<id>/…` (or `projects/new-<uuid>/…` before the first save), sanitised names, unique prefixes.
- Edits already revalidate `/`, `/projects`, `/projects/[slug]` and the admin — the public site switches from mocks to the database in Phase 14.

## CRUD pattern (all entities)
List (search + filter + reorder) → form page or dialog (React Hook Form + Zod, same schema re-validated in the Server Action) → toast on success ("Project published") → `revalidateTag` so the public site updates.
Destructive actions use `ConfirmDialog`: *Delete "Project Name"? This action cannot be undone.* [Cancel] [Delete Project].

## Publishing workflow
Save Draft → `content_state = 'draft'` (never public).
Publish → `content_state = 'published'`, `published_at = now()` if empty → visible publicly on next request.
Archive → hidden publicly, restorable. Delete → permanent, with confirmation.

## Uploads
Validated client-side (`src/lib/storage/media.ts`: PNG/JPEG/WebP/AVIF ≤ 5 MB; PDF ≤ 10 MB for resume/certificates) and again by the bucket (type allow-list, 10 MB limit). **No SVG** (can carry script). Sanitised filenames with unique prefixes, stored under entity folders.
