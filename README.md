# Kyle Castro — Expedition Portfolio

A PEAK-inspired portfolio for **Kyle Angelo C. Castro**, built as seven checkpoints:
Airport → About → Skills → Projects → Journey → Milestones → **Summit**.
Paper cards, wood signs, maps and mountain scenes connect the pages. A protected
Supabase admin manages content without code changes.

**Development phases 1–18 are implemented.** Local production checks passed;
Vercel publication and the final HTTPS domain remain launch tasks. See
[current state](.context/CURRENT_STATE.md) for owner content and review items.

## Features

- Seven public pages plus project details, search, filters and responsive navigation.
- Editors for projects, skills, profile, About, Journey, milestones, social links,
  settings, images and résumé PDF.
- Draft/published/archived projects, visibility, ordering and protected media deletion.
- Supabase password authentication, server authorization and database/storage RLS.
- Static public pages with hourly regeneration and refresh after admin saves.
- Per-page SEO, social cards, generated share image, sitemap, robots and favicons.
- Keyboard navigation, reduced motion and themed image/error/empty states.

## Stack

Next.js 16 App Router · React 19 · TypeScript 6 · Tailwind CSS 4 ·
Supabase PostgreSQL/Auth/Storage · React Hook Form + Zod · npm · Vercel.

## Local setup

Use **Node.js 24.x** (recorded in `.nvmrc` and `package.json`). From the repo root:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Copy the environment file only on first setup; keep an existing `.env.local`.
Fill in the Supabase URL, publishable key and admin email. Follow the
[Supabase setup](supabase/README.md) for a fresh database; the owner's existing
project is already provisioned. Public pages and builds need a reachable database.

```powershell
npm run dev
```

Open `http://localhost:3000`; sign in at `/admin/login` using the provisioned
admin account. See [Development](DEVELOPMENT.md) for environment details and checks.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build; reads public Supabase content |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Strict TypeScript checks |
| `npm run check` | Lint, typecheck, then build |
| `npm run db:test` | In-memory PostgreSQL schema/RLS tests; no live database |
| `npm run test:seo -- http://localhost:3100` | SEO checks against a running production server |
| `npm run test:browser -- http://localhost:3100` | Public UI, accessibility and signed-out auth checks |

Browser checks require installed Edge (`BROWSER_CHANNEL=msedge`) or Playwright
Chromium. Setup and the verification record are in [Testing](.context/TESTING.md).

## Project map

```text
src/app/(portfolio)/  Public checkpoints and project details
src/app/admin/        Login, protected editors and dashboard
src/app/share-image/  Generated social image route
src/components/      Public UI, navigation, admin and form components
src/lib/             Supabase clients, queries, actions, validation, SEO
src/styles/          Design tokens and self-hosted font definitions
src/types/           Domain and database types
supabase/            Migrations and starter content
scripts/             Database, SEO and browser checks
public/              Static assets
.context/            Architecture, design, content and test records
```

## Documentation

- [Development](DEVELOPMENT.md): local workflow, environment and troubleshooting.
- [Deployment](DEPLOYMENT.md): Supabase + Vercel setup, launch checks and maintenance.
- [Admin guide](.context/ADMIN.md): content editing and publishing.
- [Database](.context/DATABASE.md) and [Supabase setup](supabase/README.md).
- [Context index](.context/README.md) and [phase checkpoints](CHECKPOINTS.md).

Use the admin to replace starter copy, add media and publish real projects. The
screenshots in `.context/references/` are design references; the site renders real
components and SVG scene artwork.
