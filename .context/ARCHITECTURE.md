# Architecture

## Overview

```
Browser ──► Vercel (Next.js App Router)
              ├── (portfolio) route group  → public pages, Server Components, cached reads
              ├── admin/*                  → protected pages, Server Actions for writes
              └── api/*                    → only where a route handler is genuinely needed
                     │
                     ▼
               Supabase ── PostgreSQL (RLS) · Auth · Storage (public media bucket)
```

## Frontend
- **App Router** with two route groups: `(portfolio)` for the public expedition, `admin/` for the dashboard. They have separate layouts so the admin never loads scenic assets and the public site never loads admin code.
- **Server Components by default.** Client Components only for: navigation active state and mobile menu, search/filter inputs, forms, uploaders, drag-reorder, dialogs, motion wrappers. Keep client islands small and leaf-level.
- **Styling:** Tailwind v4, tokens in `src/styles/globals.css` (`@theme`). No `tailwind.config.*` file — v4 is CSS-first. Default Tailwind palette is intentionally reset; only expedition tokens exist.
- **Fonts:** self-hosted via `next/font/local` (`src/styles/fonts.ts`) — no runtime request to Google, works offline and in CI.
- **Path alias:** `@/*` → `src/*`.

## Backend (clients built Phase 9; wired to pages in Phase 14)
- `src/lib/supabase/env.ts` — reads/validates `NEXT_PUBLIC_SUPABASE_*`; `isSupabaseConfigured()`; `STORAGE_BUCKET`.
- `src/lib/supabase/client.ts` — browser client (`"use client"`, anon key). Only for client islands that need it (admin login).
- `src/lib/supabase/server.ts` — request-scoped server client bound to cookies (anon key + user session). Admin pages and Server Actions.
- `src/lib/supabase/public.ts` — cookie-less anon client for public reads, so public pages stay static/cacheable. RLS limits it to published, visible rows.
- `src/lib/supabase/admin.ts` — service-role client, `import "server-only"`, only when RLS must be bypassed. Never imported by client code.
- All clients are typed with `Database` (`src/types/database.ts`).
- `src/lib/queries/*` — typed read functions per entity (`server-only`). **Currently backed by `src/lib/mock/*`**; Phase 14 swaps the bodies to Supabase. Public rules: `content_state = 'published'` and `is_visible` — the mocks apply the same filters; RLS enforces them in the database.
- `src/lib/actions/*` — Server Actions for admin writes (Phase 11+). Each action: verify session → validate with Zod → write → `revalidateTag`/`revalidatePath`.

## Authentication (built Phase 10)
- Supabase Auth, email + password, **no public sign-up**. The single admin user is created in the Supabase dashboard.
- Next.js 16 renamed `middleware.ts` → **`proxy.ts`**. The proxy refreshes the Supabase session and redirects unauthenticated `/admin/*` requests (except `/admin/login`) to login.
- The proxy is a convenience, not the security boundary. Every admin layout/page re-checks the session server-side, every Server Action re-checks, and **RLS** is the final guard. The admin email is checked against `ADMIN_EMAIL` and an `is_admin()` SQL helper.

## Storage (bucket + policies built Phase 9; uploads Phase 11/13)
- One public bucket (`SUPABASE_STORAGE_BUCKET`, default `portfolio-media`) with folders `profile/`, `projects/<id>/`, `milestones/`, `icons/`, `resume/`.
- Public read; writes restricted to the admin via storage RLS policies.
- Images are rendered through `next/image` (AVIF/WebP, responsive `sizes`); `*.supabase.co` is allowed in `next.config.ts`.

## Data fetching & caching
- Public pages read in Server Components and are statically generated where possible; admin writes call `revalidateTag` for the affected entity so published changes appear without a redeploy.
- No client-side fetching for public content. Search/filter on Projects operates on server-provided data (or URL search params) to keep JS minimal.

## Error handling
- `app/error.tsx` (route errors), `app/not-found.tsx` (404, also catches `/peak`), `app/loading.tsx`. Admin-specific error/unauthorized pages arrive in Phase 10.
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
