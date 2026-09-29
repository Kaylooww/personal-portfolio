# Current State

_Last updated: 2026-09-29 — end of Phase 15_

## Current phase
**Phase 15 — Polish: complete, awaiting owner approval.**
Next: Phase 16 — Performance + SEO (do not start without approval).

## Completed work
- **Phases 1–9** (approved): foundation; navigation + all seven public checkpoints (mock data); Supabase clients, schema, RLS, storage, seed, `npm run db:test`. Committed as `851f0a1` (Phase 1), `432b935` (Phases 2–9) and `ff5e420` (Phases 10–11).
- **Supabase is live:** `.env.local` holds a valid project URL, publishable key, secret key, `ADMIN_EMAIL`, bucket. Migrations + seed are applied; RLS behaves as designed (anon sees 1 project, admin 4); `portfolio-media` bucket exists; the admin user exists and is in `private.admin_users`.
- **Phase 10:**
  - `src/proxy.ts` session refresh + signed-out redirect for `/admin/*`.
  - `requireAdmin()` / `getAdminSession()` (`getUser()` + `ADMIN_EMAIL`), in the protected layout and every protected page.
  - `/admin/login` (Server Action sign-in, generic errors, `?next=` sanitised), `/admin/unauthorized`, logout.
  - Admin shell "Base Camp": sidebar (tab row on mobile), header, dashboard with 6 live stats + quick actions; placeholder pages for the other 8 sections.
- Checks: lint ✅ typecheck ✅ build ✅ db:test ✅; browser auth flows ✅ against the live project (temporary test user deleted afterwards).
- **Phase 11 — Project Management:** full project CRUD in the admin (list with URL search/filters, reorder, featured, visibility, publish/unpublish/archive/restore, delete with confirm; create/edit form with validation, auto slug, thumbnail upload, tech picker, links, dates; screenshots manager). Verified with a 41-step browser run against the live database; test data cleaned up, real projects renumbered 1–4.
- **Phase 12 — Skills Management:** skills admin grouped like the public board (search, category filter, in-category reorder, featured/visible, delete with usage warning), skill editor (logo, fallback icon, proficiency), category manager (inline edit, reorder, visibility, delete → uncategorised). Shared admin building blocks extracted (`AdminFilters`, `DangerDeleteButton`, `useAdminAction`, `IconPicker`, server-only helpers). Verified with a 47-step browser run; data restored identically.
- **Phase 13 — Content Management:** Profile (photo, résumé), About cards, Journey, Milestones + categories, Settings (SEO, departure board, Summit text, résumé toggle, social links) and Media browser. **The admin is feature-complete.** Verified with a 61-check browser run; all touched tables and storage restored identically.
- **Phase 14 — Public Database Integration:** all public pages read Supabase (mocks deleted); static pages with on-demand revalidation from admin saves + hourly safety net; résumé button on the Summit when enabled. Admin → public flow verified end to end; no draft/hidden data in public HTML.
- **Phase 15 — Polish:** CSS motion (page reveal, trail march, dialog transitions, micro-interactions; all off under reduced motion), broken-image fallbacks everywhere, error/loading/404 states (single 404 inside the shell, real HTTP 404), contrast fixes, short-screen sidebar. axe: 0 WCAG A/AA violations across public + admin pages; keyboard flow verified.

## Incomplete work
- **Password sign-in is blocked by a Supabase setting:** the project's Email provider is disabled ("Email logins are disabled"). Owner must enable it (keep "Allow new users to sign up" off). The login form now shows this clearly. Everything else was verified with injected sessions.
- **Live content is still the seed:** only "Expedition Portfolio" is published; sample projects are drafts; social links are hidden placeholders; journey entries came from the reference. Replace/verify in the admin.
- Share image (`og_image_url`) is stored but not yet used — Phase 16 (metadata/OG).
- Uncategorised skills stay hidden on the public board (kept as designed; owner can ask for a catch-all panel).
- Placeholder content to replace: social links, sample projects/milestones, journey entries (verify), profile photo.
- Scene art is SVG stand-in; mascot omitted.

## Known bugs
None known in code. (Email provider setting above is a project configuration issue.)

## Database state
Live Supabase project: 3 migrations + seed applied; the public site reads it. Users: 1 (the admin).

## Architectural decisions
See `ARCHITECTURE.md` → Decisions log (Phase 10: auth checks; Phase 11: direct-to-Storage uploads, shared zod schemas, URL-driven admin filters, renumbering reorder, `ActionResult`; Phase 12: server-only action helpers, in-category skill ordering, category delete keeps skills; Phase 13: shared InlineListManager, site-wide revalidation, usage-checked media deletes, useWatch; Phase 14: cookie-less public client + ISR with on-demand revalidation; Phase 15: CSS-only motion, no public loading UI, catch-all 404 inside the shell).

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
