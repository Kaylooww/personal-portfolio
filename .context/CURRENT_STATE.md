# Current State

_Last updated: 2026-09-30 — automatic milestone date ordering_

## Status

**Phase 18 — Documentation + Deployment: complete, awaiting final
owner review.** Phase 17 was approved by the owner's request to proceed.
All 18 planned development phases are implemented; there is no next planned phase.
The application and deployment guide are complete. **Vercel publication and the
final HTTPS domain have not been verified.**

## Implemented

- Seven expedition checkpoints (Airport → Summit), project details, search/filters,
  responsive navigation, keyboard support, reduced motion and themed fallback states.
- Complete admin: profile/photo/résumé, About, skills/categories, projects/gallery,
  Journey, milestones/categories, social links, site settings and media management.
- Supabase database, Auth, public Storage bucket, table/storage RLS, server-side
  authorization, Zod validation and authenticated Server Actions.
- Supabase-backed public pages with hourly ISR and invalidation after admin saves;
  drafts, archived and hidden projects excluded; new slugs work without rebuilding.
- Per-page canonical/OG/Twitter metadata, generated 1200×630 share image, favicons,
  sitemap and robots. Uploaded share image and project thumbnails take precedence.
- Responsive image sizes, preloaded hero images, lazy gallery images, deferred
  mobile map contents and memoized project reads.
- Screenshot uploader reports success only for saved files, including mixed batches.
- Milestone log entries show uploaded images and open a detail modal with full
  description, image, source/date and proof links. Supports keyboard opening,
  Escape, close/backdrop dismissal and focus return; retains the category filter.
- Featured projects/milestones lead public lists; featured skills lead each category.
  Projects/skills retain manual order within featured/non-featured groups. Project
  numbering follows the public list order. Milestones now sort automatically by
  newest date within each featured group, with undated entries last, in both public
  and admin lists. Milestone move arrows are removed; categories keep manual order.
- Repeatable database, SEO and public browser checks; detailed admin test evidence
  and limitations in [TESTING.md](TESTING.md).
- Final [README](../README.md), [Development](../DEVELOPMENT.md),
  [Deployment](../DEPLOYMENT.md) and [Supabase setup](../supabase/README.md).
  Node 24.x declared in package/lockfile and `.nvmrc`; environment/key/bucket behavior documented.

## Verification

Phase 17: lint, typecheck, production build, database tests, SEO smoke and browser
smoke passed. Public/admin tests covered 104 layouts and 48 automated WCAG A/AA
audits with zero violations. Publishing, media, résumé, custom OG, auth guards and
non-admin rejection were exercised against live Supabase. See [TESTING.md](TESTING.md).

Phase 18: lint and typecheck passed; production build passed after retrying outside
the sandbox (its worker launch was initially blocked with `spawn EPERM`). Verified
37 local links across 19 documents, package/lockfile Node declarations and direct
dependency entries, plus `git diff --check`. Browser/database evidence above remains
from Phase 17; Phase 18 changed documentation and runtime declarations. No live
content changes, migrations or hosting publication were performed in Phase 18.

Owner-requested corrections: lint, typecheck and build passed. Public browser smoke
passed 63 layouts and 18 accessibility audits across nine pages, plus all six
milestone dialogs. Focused read-only checks verified image/detail behavior across
four widths, modal accessibility, category retention, dismissal/focus and featured
ordering in projects, milestones and each skills category. Desktop/mobile views
were visually inspected. No content or media was modified.

Automatic date ordering follow-up: lint/typecheck/build passed. Read-only browser
checks verified all six public milestones, category filters and admin groups against
featured/date order; the date hint and removal of manual milestone arrows were
confirmed. Admin layout/accessibility checks passed at 320/1440px. Content and
media were left unchanged.

## Database and owner links

The existing Supabase project has three migrations and seed applied, one original
Auth administrator, and the `portfolio-media` public bucket. Phase 17 cleanup
verified all 12 content tables restored (except timestamps), zero Storage files,
and no remaining QA account. Email provider is enabled; public sign-ups are disabled.

The following links were saved through admin, remain visible on Summit, and live
in Supabase:

- GitHub: https://github.com/Kaylooww
- LinkedIn: https://www.linkedin.com/in/kyle-angelo-castro-59a74b430/

Normal admin writes use session + RLS. The server-only maintenance client has no
current app callers; its secret key is optional for deployment.

## Incomplete work / launch handoff

- Publish to Vercel, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin (currently
  localhost), and execute the hosted checklist in [DEPLOYMENT.md](../DEPLOYMENT.md).
- Owner confirmation of successful password sign-in remains pending. Generated
  admin sessions and real non-admin password rejection were tested; no owner
  password was requested or reset.
- Review final content before launch. The owner is actively updating Supabase,
  including projects and milestone images; earlier seed-content counts are historical.
  Verify journey entries, contact email, photo and résumé in the admin.
- Confirm whether Java/C should remain in both Programming and Backend.
  Uncategorised skills intentionally stay hidden from the public board.
- Scene artwork remains SVG stand-ins; the optional mascot is omitted.
- Safari, Firefox, physical mobile and screen-reader review remain outstanding.
  Hosted cache behavior, actual social crawlers and field performance are unverified.
  No Lighthouse/Core Web Vitals score is claimed.

## Known bugs

None known after the Phase 17 gallery-feedback fix. Coverage limits and owner
content tasks above remain explicit release checks.

## Working agreements

Read [CHECKPOINTS.md](../CHECKPOINTS.md) before future work; obtain scope for changes
beyond the completed phase plan. Keep dynamic content in Supabase. The final
destination is always **Summit**. Architecture and decisions are in
[ARCHITECTURE.md](ARCHITECTURE.md); implementation history is in [CHANGELOG.md](CHANGELOG.md).
