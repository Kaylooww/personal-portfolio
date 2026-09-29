# Architecture

## Overview

```
Browser ──► Vercel (Next.js App Router)
              ├── (portfolio) route group  → public pages, Server Components, cached reads
              ├── admin/*                  → protected pages, Server Actions for writes
              └── share-image              → generated social image route handler
                     │
                     ▼
               Supabase ── PostgreSQL (RLS) · Auth · Storage (public media bucket)
```

## Frontend
- **App Router** with two route groups: `(portfolio)` for the public expedition, `admin/` for the dashboard. They have separate layouts so the admin never loads scenic assets and the public site never loads admin code.
- **Server Components by default.** Client Components only for: navigation active state and mobile menu, search/filter inputs, forms, uploaders, reorder controls, dialogs, image fallbacks (`SafeImage`). Keep client islands small and leaf-level.
- **Styling:** Tailwind v4, tokens in `src/styles/globals.css` (`@theme`). No `tailwind.config.*` file — v4 is CSS-first. Default Tailwind palette is intentionally reset; only expedition tokens exist.
- **Fonts:** self-hosted via `next/font/local` (`src/styles/fonts.ts`) — no runtime request to Google, works offline and in CI.
- **Path alias:** `@/*` → `src/*`.

## Backend (clients built Phase 9; public pages read Supabase since Phase 14)
- `src/lib/supabase/env.ts` — reads/validates `NEXT_PUBLIC_SUPABASE_*`; `isSupabaseConfigured()`; `STORAGE_BUCKET`.
- `src/lib/supabase/client.ts` — browser client (`"use client"`, anon key). Only for client islands that need it (admin login).
- `src/lib/supabase/server.ts` — request-scoped server client bound to cookies (anon key + user session). Admin pages and Server Actions.
- `src/lib/supabase/public.ts` — cookie-less anon client for public reads, so public pages stay static/cacheable. RLS limits it to published, visible rows.
- `src/lib/supabase/admin.ts` — service-role client, `import "server-only"`, only when RLS must be bypassed. Never imported by client code.
- All clients are typed with `Database` (`src/types/database.ts`).
- The service client has no current application callers; its secret is optional for deployment. Normal admin writes and storage operations use the user's session + RLS.
- `src/lib/queries/*` — typed read functions per entity (`server-only`), reading Supabase via the shared cookie-less `publicDb()` (Phase 14). Public rules: `content_state = 'published'` and `is_visible`, filtered in the query and enforced by RLS. Singletons and project reads are wrapped in React `cache()` to share results within a server render.
- `src/lib/actions/*` — Server Actions for admin writes (Phase 11+). Each action: verify session → validate with Zod → write → `revalidatePath`.

## Authentication (built Phase 10)
- Supabase Auth, email + password, **no public sign-up**. The single admin user is created in the Supabase dashboard.
- Next.js 16 renamed `middleware.ts` → **`proxy.ts`**. The proxy refreshes the Supabase session and redirects unauthenticated `/admin/*` requests (except `/admin/login`) to login.
- The proxy is a convenience, not the security boundary. Every admin layout/page re-checks the session server-side, every Server Action re-checks, and **RLS** is the final guard. The admin email is checked against `ADMIN_EMAIL` and an `is_admin()` SQL helper.

## Storage (bucket + policies built Phase 9; uploads Phase 11/13)
- One public bucket, `portfolio-media`, with folders `profile/`, `projects/<id>/`, `skills/`, `milestones/`, `resume/`, `site/`. The migration and shared `MEDIA_BUCKET` constant fix its name; changing `SUPABASE_STORAGE_BUCKET` alone does not change uploads.
- Public read; writes restricted to the admin via storage RLS policies.
- Images are rendered through `next/image` (AVIF/WebP, responsive `sizes`); `*.supabase.co` is allowed in `next.config.ts`.

## Data fetching & caching
- Public pages read in Server Components and are statically generated (ISR). Admin Server Actions call `revalidatePath` for the affected pages (content edits revalidate the whole public layout), so changes appear on the next request without a redeploy; an hourly `revalidate` catches edits made directly in Supabase.
- No client-side fetching for public content. Search/filter on Projects operates on server-provided data (or URL search params) to keep JS minimal.
- Project metadata and page content share a memoized project query. `getPublishedProjectIndex()` selects only `id, slug` for static params, expedition numbering and sitemap discovery.
- Mobile map links are a conditional `next/dynamic` import, requested on first open. The dialog shell and close button remain available while loading; native modal focus and Escape behavior are preserved.
- All images use native lazy loading by default; the Airport portrait and project-detail hero use Next 16 `preload`. Responsive `sizes` account for the desktop sidebar, detail facts column and content width cap. AVIF/WebP and self-hosted fonts remain enabled.

## SEO (Phase 16)
- `src/lib/seo/metadata.ts` builds complete metadata for each public page: database profile identity, site settings, per-page titles/descriptions, canonical, Open Graph and Twitter. Root metadata only provides the base URL; admin and error pages inherit no public canonical/share card.
- Image precedence: project thumbnail → Settings share image (`og_image_url`) → generated `/share-image` PNG (1200×630). The fallback uses database title, roles and tagline with expedition colors and mountain/flag art.
- `/share-image` is an explicit static route handler, avoiding file-based OG metadata overriding the owner's uploaded image. It and `/sitemap.xml` use hourly ISR; global content saves invalidate the root layout and project mutations explicitly invalidate the sitemap.
- Sitemap entries come from the navigation source of truth and the filtered public project index. No fabricated modification dates. `/robots.txt` disallows `/admin`; admin metadata remains `noindex, nofollow`; unknown and unpublished pages return HTTP 404 + `noindex`.
- `getSiteUrl()` validates/normalizes `NEXT_PUBLIC_SITE_URL` to an HTTP(S) origin; fallback is `VERCEL_PROJECT_PRODUCTION_URL`, then localhost. Deployment must set the final HTTPS origin. `app/favicon.ico` and `app/icon.svg` use Next's automatic metadata conventions.
- Repeatable read-only production check: start the built app, then run `node scripts/seo-smoke.mjs http://localhost:3000` (or the running server's origin). It checks every sitemap page plus discovery files, private/404 metadata, cache headers and share-image dimensions.

## Error handling
- 404: one `app/not-found.tsx`, always rendered **inside** the public shell — unknown public URLs hit `(portfolio)/[...rest]` (calls `notFound()`), unpublished projects call `notFound()`. Returns HTTP 404.
- Errors: `(portfolio)/error.tsx` (keeps navigation), `admin/(protected)/error.tsx` (keeps admin shell), `app/error.tsx` (fallback), `app/global-error.tsx` (root layout crash).
- Loading: no public loading UI (pages are static; a root `loading.tsx` also forced HTTP 200 on 404s by streaming first — removed in Phase 15). `admin/(protected)/loading.tsx` shows `LoadingSkeleton` inside the admin shell.
- Images: `SafeImage` swaps a broken remote image for a themed fallback (silhouette, plate, monogram, "can't load").
- Never surface raw Supabase/Postgres errors to users; map to friendly messages and log server-side.

## Decisions log
| Date | Decision | Why |
|---|---|---|
| 2026-09-25 | Next.js 16.3 + React 19.3 + TS 6 + Tailwind 4.3 | Current stable at project start |
| 2026-09-25 | Self-hosted fonts via `next/font/local` | Performance, privacy, builds without network |
| 2026-09-25 | Reset Tailwind default palette | Prevents off-brand colours creeping in |
| 2026-09-25 | Public route placeholders for all 7 checkpoints | Every route resolves while phases are built |
| 2026-09-25 | Admin routes have no pages until Phase 10 | Avoid unprotected admin pages existing even as stubs |
| 2026-09-25 | Route protection via `proxy.ts` + server checks + RLS | Next 16 convention; defence in depth |
| 2026-09-27 | Public reads go through `src/lib/queries/*` (`server-only`) even while backed by `src/lib/mock/*` | Phase 14 swaps the query bodies only; pages don't change |
| 2026-09-27 | `cn()` uses `extendTailwindMerge` with our custom text/radius/shadow scales | Otherwise `text-hero` + a size override both survive and the wrong one can win |
| 2026-09-27 | Scenes are SVG stand-ins registered in `SceneBackground` | No text-free art plates yet; swapping to `next/image` plates later touches one component |
| 2026-09-27 | Mobile map uses native `<dialog>` + `showModal()` | Built-in focus trap, Esc and inert background with no extra JS |
| 2026-09-27 | Projects/Milestones filtering is client-side over server-provided lists | Tiny datasets; keeps pages static |
| 2026-09-27 | Journey route layout is computed (rows of 3, snaking) rather than hand-placed | Works for any number of admin-managed entries without overlap |
| 2026-09-27 | `Database` type is hand-written but derived from `content.ts` | One source of truth for shapes; CLI type generation needs a live project |
| 2026-09-27 | Admin allow-list lives in `private.admin_users`, checked by `security definer` `private.is_admin()` | Not reachable through the API; RLS policies can still use it |
| 2026-09-27 | SQL verified with PGlite (`npm run db:test`) | No Docker/Supabase needed to test migrations + RLS |
| 2026-09-27 | Separate cookie-less `public.ts` Supabase client for public reads | Reading cookies would force every public page to render dynamically |
| 2026-09-27 | Proxy uses `getClaims()`; pages/actions use `getUser()` via cached `getAdminSession()` | Fast optimistic check at the edge; authoritative check where data is touched |
| 2026-09-27 | `requireAdmin()` in the protected layout **and** each page | Layouts don't re-run on every client navigation |
| 2026-09-27 | Non-admin accounts are signed straight back out on login | No session ever exists for a non-admin through the form |
| 2026-09-27 | Admin section placeholders exist behind `requireAdmin()` | Sidebar links resolve; safe now that protection exists |
| 2026-09-27 | Uploads go browser → Storage with the admin session; actions receive URLs only | Avoids the Server Action body limit; storage RLS still restricts writes to the admin |
| 2026-09-27 | One zod schema per form, used by React Hook Form and re-run in the Server Action | Client UX and server safety can't drift |
| 2026-09-27 | Admin list filters live in URL search params, rendered on the server | Shareable/back-button friendly; no client data fetching |
| 2026-09-27 | Reordering = move up/down + renumber 1..n | Simple, accessible, robust to gaps; drag-and-drop not needed yet |
| 2026-09-27 | Actions return `ActionResult` and map Postgres errors (`23505` → field error) | Friendly messages; raw DB errors never reach the UI |
| 2026-09-29 | Shared action helpers live in server-only `src/lib/admin/helpers.ts`, not in `"use server"` files | Every export of a `"use server"` module becomes a callable endpoint |
| 2026-09-29 | Skills reorder within their category, then the whole list is renumbered | Matches how the public board groups skills; keeps `display_order` gap-free |
| 2026-09-29 | Deleting a category keeps its skills (uncategorised, hidden publicly) | Avoids accidental data loss; admin reassigns them |
| 2026-09-29 | One `InlineListManager` for About / Journey / social links / milestone categories | Same interaction everywhere; entity-specific forms plug in |
| 2026-09-29 | Content actions revalidate `/` with the `layout` scope | Profile/settings/links appear on several pages |
| 2026-09-29 | Media deletes allowed only for files no row references (`findMediaReferences`) | Prevents broken images; checked again on the server |
| 2026-09-29 | Use `useWatch` (not `watch()`) in RHF forms | React Compiler can't memoize `watch()` safely (lint `incompatible-library`) |
| 2026-09-29 | Public pages stay static (ISR): admin actions call `revalidatePath`; `(portfolio)/layout.tsx` sets `revalidate = 3600` as a safety net | Fast static pages, edits visible on the next request, direct DB edits picked up within an hour |
| 2026-09-29 | Unpublished project slugs render on demand and resolve to 404 | New projects work without a rebuild (`dynamicParams`); drafts never leak (verified in raw HTML) |
| 2026-09-29 | Removed root `loading.tsx`; loading UI only in the admin | Public pages are static; the streaming boundary made 404s return HTTP 200 |
| 2026-09-29 | Catch-all `(portfolio)/[...rest]` + a single shell-less `not-found.tsx` | Every public 404 keeps exactly one navigation and returns 404 |
| 2026-09-29 | All motion in CSS; `motion` package removed | Nothing needed JS-driven animation; smaller dependency surface |
| 2026-09-29 | Public pages own their complete metadata; root only sets `metadataBase` | Live settings/profile drive SEO without putting public canonical/share tags on admin or 404 pages |
| 2026-09-29 | Explicit `/share-image` route with hourly ISR | Keeps the admin's uploaded OG image authoritative; avoids file-based metadata precedence |
| 2026-09-29 | Memoized project reads + `id, slug` index | Metadata/page share one read; numbering and sitemap avoid full project/gallery joins |
| 2026-09-29 | Lazy import only the mobile map contents on first open | Defers unused UI code while retaining the native dialog shell and focus behavior |
| 2026-09-30 | Node 24.x in package engines and `.nvmrc` | Matches the tested runtime and Vercel configuration; installed Supabase SDK requires Node 22+ |
