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
| `/admin/profile` | Profile + photo + resume |
| `/admin/about` | About cards |
| `/admin/skills` | Skills + categories |
| `/admin/projects` | Project list, search, filters, reorder, quick state/flag actions ✅ |
| `/admin/projects/new` | Create project ✅ |
| `/admin/projects/[id]/edit` | Edit project + screenshots + delete ✅ |
| `/admin/journey` | Journey entries |
| `/admin/milestones` | Milestones + categories |
| `/admin/media` | Storage browser |
| `/admin/settings` | Site settings, social links |

All `/admin/*` except `/admin/login` and `/admin/unauthorized` require the admin (proxy + `requireAdmin()` in layout and page + RLS). Protected pages live in the `(protected)` route group. Section pages other than the dashboard are placeholders until their phase.

## System
`app/not-found.tsx` (404) · `app/error.tsx` · `app/loading.tsx` · `app/icon.svg` · `public/favicon.ico`.
Planned (Phase 16): `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.*`.

## Navigation source of truth
`src/lib/constants/sections.ts` → `PORTFOLIO_SECTIONS` (label, href, icon, scene). Top nav, sidebar and mobile map all read from it.
