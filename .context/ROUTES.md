# Routes

## Public — `src/app/(portfolio)/`
| Route | Page | Status |
|---|---|---|
| `/` | Airport / landing | Phase 1: design-token preview · Phase 2: Airport |
| `/about` | About | placeholder → Phase 3 |
| `/skills` | Equipment & Skills | placeholder → Phase 4 |
| `/projects` | Expeditions | placeholder → Phase 5 |
| `/projects/[slug]` | Project detail | placeholder → Phase 5 |
| `/journey` | My Journey | placeholder → Phase 6 |
| `/milestones` | Milestones | placeholder → Phase 7 |
| `/summit` | The Summit (final destination) | placeholder → Phase 8 |

**There is no `/peak`.** It resolves to the 404 page.

## Admin — `src/app/admin/` (planned — Phase 10+)
| Route | Purpose |
|---|---|
| `/admin/login` | Email + password sign-in (public) |
| `/admin` | Dashboard (stats, quick actions) |
| `/admin/profile` | Profile + photo + resume |
| `/admin/about` | About cards |
| `/admin/skills` | Skills + categories |
| `/admin/projects` | Project list, search, filters |
| `/admin/projects/new` | Create project |
| `/admin/projects/[id]/edit` | Edit project |
| `/admin/journey` | Journey entries |
| `/admin/milestones` | Milestones + categories |
| `/admin/media` | Storage browser |
| `/admin/settings` | Site settings, social links |

All `/admin/*` except `/admin/login` require an authenticated admin (proxy + server check + RLS).
No admin pages exist before Phase 10 — the folders are empty on purpose.

## System
`app/not-found.tsx` (404) · `app/error.tsx` · `app/loading.tsx` · `app/icon.svg` · `public/favicon.ico`.
Planned (Phase 16): `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.*`.

## Navigation source of truth
`src/lib/constants/sections.ts` → `PORTFOLIO_SECTIONS` (label, href, icon, scene). Top nav, sidebar and mobile map all read from it.
