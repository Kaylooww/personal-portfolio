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

## Backend (planned — Phase 9+)
- `src/lib/supabase/client.ts` — browser client (anon key).
- `src/lib/supabase/server.ts` — server client bound to request cookies (anon key + user session).
- `src/lib/supabase/admin.ts` — service-role client, `import "server-only"`, used only when RLS must be bypassed (e.g. seeding). Never imported by client code.
- `src/lib/queries/*` — typed read functions per entity (public reads filter `content_state = 'published'` and `is_visible = true`; RLS enforces the same).
- `src/lib/actions/*` — Server Actions for admin writes. Each action: verify session → validate with Zod → write → `revalidateTag`/`revalidatePath`.

## Authentication (planned — Phase 10)
- Supabase Auth, email + password, **no public sign-up**. The single admin user is created in the Supabase dashboard.
- Next.js 16 renamed `middleware.ts` → **`proxy.ts`**. The proxy refreshes the Supabase session and redirects unauthenticated `/admin/*` requests (except `/admin/login`) to login.
- The proxy is a convenience, not the security boundary. Every admin layout/page re-checks the session server-side, every Server Action re-checks, and **RLS** is the final guard. The admin email is checked against `ADMIN_EMAIL` and an `is_admin()` SQL helper.

## Storage (planned — Phase 9/13)
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
