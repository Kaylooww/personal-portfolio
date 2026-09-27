# Admin

> **Status: planned — Phases 10–13.**

## Authentication
- Supabase Auth, email + password. **No public registration** — the admin user is created manually in the Supabase dashboard; `ADMIN_EMAIL` names it.
- Entry: a small, low-contrast "Admin" link in the top-left of the Airport page → `/admin/login`. Its subtlety is cosmetic, not security.
- Login errors are generic ("Email or password is incorrect") — never reveal which part was wrong.

## Authorization (defence in depth)
1. `src/proxy.ts` (Next 16's renamed middleware) refreshes the session cookie and redirects anonymous `/admin/*` requests to `/admin/login`.
2. `app/admin/(protected)/layout.tsx` re-verifies the user server-side (`supabase.auth.getUser()`) and checks admin email; otherwise → unauthorized page.
3. Every Server Action re-verifies before writing.
4. RLS on every table and the storage bucket enforces `is_admin()` for writes.
The service-role key is never used for normal admin writes — the admin's own session + RLS is.

## Layout
Simplified dashboard: cream canvas, paper panels, navy sidebar text, blue actions. No scenic backgrounds.
Sidebar: Dashboard · Profile · About · Skills · Projects · Journey · Milestones · Media · Settings · Logout.
Dashboard stats: Total Projects, Total Skills, Total Milestones, Journey Entries, Published Projects, Draft Projects. Quick actions: + Add Project, + Add Skill, + Add Milestone.

## CRUD pattern (all entities)
List (search + filter + reorder) → form page or dialog (React Hook Form + Zod, same schema re-validated in the Server Action) → toast on success ("Project published") → `revalidateTag` so the public site updates.
Destructive actions use `ConfirmDialog`: *Delete "Project Name"? This action cannot be undone.* [Cancel] [Delete Project].

## Publishing workflow
Save Draft → `content_state = 'draft'` (never public).
Publish → `content_state = 'published'`, `published_at = now()` if empty → visible publicly on next request.
Archive → hidden publicly, restorable. Delete → permanent, with confirmation.

## Uploads
Validated client- and server-side: type (png, jpg, webp, avif, svg for icons only; pdf for resume/certificates), size limits, sanitised filenames, optional dimension checks. Stored under entity folders in the media bucket.
