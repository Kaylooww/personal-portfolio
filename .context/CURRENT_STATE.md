# Current State

_Last updated: 2026-09-25 — end of Phase 1_

## Current phase
**Phase 1 — Foundation: complete, awaiting owner approval.**
Next: Phase 2 — Public Navigation + Airport (do not start without approval).

## Completed work
- Project initialised (Next.js 16.3, React 19.3, TS 6 strict, Tailwind 4.3, ESLint 9, Motion).
- Folder structure per brief §45 (+ `.context/references/`, `src/styles/fonts/`).
- Design tokens, typography (Baloo 2 / Kalam / Nunito, self-hosted), surfaces, motion, responsive foundations.
- Section model (7 checkpoints ending at Summit), domain types, status constants.
- Base UI: LogoMark, PaperCard, ButtonLink, SectionTitle, Container, SkipLink, PortfolioShell.
- Every public route resolves (placeholders); `/peak` → 404.
- `/` temporarily shows a design-token specimen for review.
- Docs: CHECKPOINTS, CLAUDE, AGENTS, README, DEVELOPMENT, DEPLOYMENT (initial), all `.context/` files.
- Checks: lint ✅ typecheck ✅ build ✅. Visual check at 1440px and 375px ✅.

## Incomplete work (by design, later phases)
- Navigation (top, sidebar, mobile) — Phase 2.
- All real page designs — Phases 2–8.
- Supabase, schema, RLS, storage — Phase 9. `src/lib/supabase`, `queries`, `actions`, `auth`, `validation` are empty.
- React Hook Form, Zod, `@supabase/ssr`, `@supabase/supabase-js` not yet installed (added in the phase that uses them).
- Admin — Phases 10–13. `src/app/admin/*` folders are empty.
- sitemap/robots/OG image — Phase 16.

## Known bugs
None.

## Database state
No database yet. Planned schema documented in `DATABASE.md`.

## Architectural decisions
See `ARCHITECTURE.md` → Decisions log.

## Open questions for the owner
1. **Scene artwork.** Each page needs a clean background plate with no UI or text baked in (the references have nav bars, headings and a "PEAK" label painted in). Preferred: regenerate each of the 7 scenes as a text-free plate, desktop landscape (≥ 2560×1440) + mobile portrait (≈ 1080×1920). Without them, Phase 2+ will use layered CSS/SVG scenery as a stand-in.
2. **Mascot.** The backpacker character appears in every reference. Should it be in the artwork plates, or omitted?
3. **Real links.** GitHub, LinkedIn, email — needed by Phase 8 (can be placeholders until Phase 13 admin).

## Important notes
- The references label the last nav item "PEAK"; the site must say **Summit** everywhere.
- Reference About text says "BST Information Technology" and "closer to the peak" → use "BS Information Technology" and "closer to the summit".
- Reference project names (SkyTrack, CampNotes, Summit Social, Peak Planner) are placeholders, not Kyle's work.
