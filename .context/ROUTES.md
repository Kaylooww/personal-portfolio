# Routes

## Public — `src/app/(portfolio)/`
| Route | Page | Status |
|---|---|---|
| `/` | Airport / landing | ✅ built (Phase 2) |
| `/about` | About | ✅ built (Phase 3) |
| `/skills` | Equipment & Skills | ✅ built (Phase 4) |
| `/projects` | Expeditions | ✅ built (Phase 5) |
| `/projects/[slug]` | Project detail (published only; drafts/archived → 404) | ✅ built (Phase 5), SSG via `generateStaticParams` |
| `/journey` | My Journey | ✅ built (Phase 6) |
| `/milestones` | Milestones | ✅ built (Phase 7) |
| `/summit` | The Summit (final destination) | ✅ built (Phase 8) |

**There is no `/peak`.** It resolves to the 404 page.

## Admin — `src/app/admin/` (Phase 10: auth, shell, dashboard; editors Phase 11–13)
| Route | Purpose |
|---|---|
| `/admin/login` | Email + password sign-in (public) ✅ |
| `/admin/unauthorized` | Signed in but not the admin (public) ✅ |
| `/admin` | Dashboard (stats, quick actions) ✅ |
| `/admin/profile` | Profile + photo + résumé ✅ |
| `/admin/about` | About cards ✅ |
| `/admin/skills` | Skills grouped by category, search, filter, reorder, flags ✅ |
| `/admin/skills/new`, `/admin/skills/[id]/edit` | Create / edit skill ✅ |
| `/admin/skills/categories` | Category CRUD, reorder, visibility ✅ |
| `/admin/projects` | Project list, search, filters, reorder, quick state/flag actions ✅ |
| `/admin/projects/new` | Create project ✅ |
| `/admin/projects/[id]/edit` | Edit project + screenshots + delete ✅ |
| `/admin/journey` | Journey entries ✅ |
| `/admin/milestones` (+ `/new`, `/[id]/edit`, `/categories`) | Milestones + categories ✅ |
| `/admin/media` | Storage browser, usage, delete unused ✅ |
| `/admin/settings` | Site settings, departure board, Summit text, résumé toggle, social links ✅ |

All `/admin/*` except `/admin/login` and `/admin/unauthorized` require the admin (proxy + `requireAdmin()` in layout and page + RLS). Protected pages live in the `(protected)` route group. Every section has its editor (Phase 13); the placeholder component was removed.

## System
`app/not-found.tsx` (the single 404, rendered inside the public shell) · `(portfolio)/[...rest]` (unknown public URLs → 404) · `(portfolio)/error.tsx` · `admin/(protected)/error.tsx` + `loading.tsx` · `app/error.tsx` · `app/global-error.tsx` · `app/icon.svg` · `app/favicon.ico`.

Built (Phase 16): `/sitemap.xml` (`app/sitemap.ts`, seven checkpoints + published/visible projects), `/robots.txt` (`app/robots.ts`, excludes admin), `/share-image` (`app/share-image/route.ts`, generated 1200×630 PNG). Sitemap and share image have hourly ISR. The explicit share-image URL lets the admin's uploaded OG image take precedence over the fallback.

Public data comes from Supabase (Phase 14). Pages are static with on-demand revalidation; `/projects/[slug]` renders new published slugs on demand and returns the 404 page for drafts, hidden and archived projects.

## Navigation source of truth
`src/lib/constants/sections.ts` → `PORTFOLIO_SECTIONS` (label, href, icon, scene). Top nav, sidebar and mobile map all read from it.
