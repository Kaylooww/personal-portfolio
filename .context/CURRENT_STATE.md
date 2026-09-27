# Current State

_Last updated: 2026-09-27 — end of Phase 9_

## Current phase
**Phase 9 — Supabase + Database: complete, awaiting owner approval.**
The owner approved Phases 3–9 as one batch; each was built, verified and logged separately.
Next: Phase 10 — Authentication + Admin Foundation (do not start without approval).

## Completed work
- **Phase 1 — Foundation** and **Phase 2 — Navigation + Airport** (approved).
- **Phase 3 — About** (`/about`): shore scene, passport + "Hello! I'm" intro card, wood notice board with Education / Interests / Development Focus / Location / Current Goals (checklist).
- **Phase 4 — Skills** (`/skills`): jungle scene, plank gear board with 6 category panels, skill tiles (logo or monogram fallback), empty state.
- **Phase 5 — Projects** (`/projects`, `/projects/[slug]`): canyon scene, search + status filters (client), flag-tab cards with status, stack, role, Details/GitHub/Live demo; full detail page (overview, problem, solution, features, process, gallery, facts). Drafts/archived → 404. Detail pages statically generated.
- **Phase 6 — Journey** (`/journey`): dusk ridge scene, computed snaking mountain route with glowing dotted trail + pennants (lg+), vertical timeline (mobile).
- **Phase 7 — Milestones** (`/milestones`): citadel scene, 6 category badge cards that filter the milestone log, enamel hex badges, empty states.
- **Phase 8 — Summit** (`/summit`): sunset scene with planted flag, THE SUMMIT, note + closing message, Contact / View Projects / GitHub / LinkedIn (missing links hidden). All pages verified together.
- **Phase 9 — Supabase + Database:** `@supabase/ssr` + `@supabase/supabase-js`; typed browser / server / public / service-role clients; `Database` type; 3 migrations (schema, RLS, storage); `seed.sql`; `npm run db:test` (PGlite) — 28/28 checks pass.
- Checks: lint ✅ typecheck ✅ build ✅ db:test ✅. All 8 public URLs: one `h1` each, no "Peak" text, no horizontal overflow at 320/375/768, all internal links resolve, `/peak` → 404.

## Incomplete work
- **Supabase not connected.** `.env.local` has no Supabase URL/keys yet, so migrations have not been applied to a live project. Steps: `supabase/README.md`. Pages keep using mocks until Phase 14 by design.
- **`/admin/login` → 404** until Phase 10.
- **Placeholder content to replace:** social links (`hello@example.com`, github.com, linkedin.com roots), sample projects/milestones, journey entries (taken from the reference — verify accuracy), profile photo.
- **Scene art is stand-in SVG** for all 7 checkpoints; mascot omitted.
- Not-found project slugs return HTTP 200 with the 404 UI (root `loading.tsx` streams before `notFound()`); address in Phase 16 (SEO).
- Loading skeletons, motion polish — Phase 15. Sitemap/robots/OG — Phase 16.

## Known bugs
None known.

## Database state
Schema, RLS and storage migrations written and tested in PGlite; not yet applied to Supabase. Seed matches the mocks (samples as drafts, social links hidden).

## Architectural decisions
See `ARCHITECTURE.md` → Decisions log (Phases 3–9 added: client-side filtering, computed journey layout, derived `Database` type, `private.is_admin()`, PGlite tests, cookie-less public client).

## Open questions for the owner
1. **Supabase project** — create it and share access by filling `.env.local` (URL, anon key, service-role key, `ADMIN_EMAIL`). Needed for Phase 10.
2. **Real links** — GitHub, LinkedIn, contact email (placeholders are live on `/summit` in dev).
3. **Journey entries** — confirm the six entries from the reference are accurate (e.g. "Open Source Contributor").
4. **Skills** — the reference lists Java and C under both Programming and Backend; keep, or change?
5. **Scene artwork & mascot** — painted, text-free plates per checkpoint, or keep the SVG stand-ins?
6. **Profile photo.**

## Important notes
- The site says **Summit** everywhere; "PEAK" is only the inspiration.
- Reference project names (SkyTrack, CampNotes, Summit Social, Peak Planner) are not used.
- Reference About text "BST" → "BS"; "closer to the peak" → "closer to the summit".
