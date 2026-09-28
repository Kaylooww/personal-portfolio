# Current State

_Last updated: 2026-09-27 — end of Phase 11_

## Current phase
**Phase 11 — Project Management: complete, awaiting owner approval.**
Next: Phase 12 — Skills Management (do not start without approval).

## Completed work
- **Phases 1–9** (approved): foundation; navigation + all seven public checkpoints (mock data); Supabase clients, schema, RLS, storage, seed, `npm run db:test`. Committed as `851f0a1` (Phase 1) and `432b935` (Phases 2–9).
- **Supabase is live:** `.env.local` holds a valid project URL, publishable key, secret key, `ADMIN_EMAIL`, bucket. Migrations + seed are applied; RLS behaves as designed (anon sees 1 project, admin 4); `portfolio-media` bucket exists; the admin user exists and is in `private.admin_users`.
- **Phase 10:**
  - `src/proxy.ts` session refresh + signed-out redirect for `/admin/*`.
  - `requireAdmin()` / `getAdminSession()` (`getUser()` + `ADMIN_EMAIL`), in the protected layout and every protected page.
  - `/admin/login` (Server Action sign-in, generic errors, `?next=` sanitised), `/admin/unauthorized`, logout.
  - Admin shell "Base Camp": sidebar (tab row on mobile), header, dashboard with 6 live stats + quick actions; placeholder pages for the other 8 sections.
- Checks: lint ✅ typecheck ✅ build ✅ db:test ✅; browser auth flows ✅ against the live project (temporary test user deleted afterwards).
- **Phase 11 — Project Management:** full project CRUD in the admin (list with URL search/filters, reorder, featured, visibility, publish/unpublish/archive/restore, delete with confirm; create/edit form with validation, auto slug, thumbnail upload, tech picker, links, dates; screenshots manager). Verified with a 41-step browser run against the live database; test data cleaned up, real projects renumbered 1–4.

## Incomplete work
- **Password sign-in is blocked by a Supabase setting:** the project's Email provider is disabled ("Email logins are disabled"). Owner must enable it (keep "Allow new users to sign up" off). The login form now shows this clearly. Everything else was verified with injected sessions.
- Admin section editors still to build: Skills (12), Profile/About/Journey/Milestones/Media/Settings (13). "+ Add skill" / "+ Add milestone" quick actions open placeholders.
- Public pages still read `src/lib/mock/*` until Phase 14 (dashboard says so).
- Placeholder content to replace: social links, sample projects/milestones, journey entries (verify), profile photo.
- Scene art is SVG stand-in; mascot omitted.
- Unpublished project slugs return HTTP 200 with the 404 UI — Phase 16.

## Known bugs
None known in code. (Email provider setting above is a project configuration issue.)

## Database state
Live Supabase project: 3 migrations + seed applied. Users: 1 (the admin).

## Architectural decisions
See `ARCHITECTURE.md` → Decisions log (Phase 10: auth checks; Phase 11: direct-to-Storage uploads, shared zod schemas, URL-driven admin filters, renumbering reorder, `ActionResult`).

## Open questions for the owner
1. **Enable the Email provider** in Supabase (Authentication → Sign In / Providers → Email), keeping sign-ups off — then try signing in at `/admin/login`.
2. **Real links** — GitHub, LinkedIn, contact email.
3. **Journey entries** — confirm accuracy.
4. **Skills** — keep Java/C under both Programming and Backend?
5. **Scene artwork & mascot.**
6. **Profile photo.**

## Important notes
- The site says **Summit** everywhere; "PEAK" is only the inspiration.
- Reference project names (SkyTrack, CampNotes, Summit Social, Peak Planner) are not used.
- The secret (service-role) key is used only in `src/lib/supabase/admin.ts` (`server-only`); admin reads/writes use the admin's own session + RLS.
