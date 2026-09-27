# Kyle Angelo C. Castro — Portfolio

**BSIT Student • Developer • UI/UX Enthusiast**
*Building ideas, one climb at a time.*

A PEAK-inspired, expedition-themed portfolio. Visitors climb through seven checkpoints —
**Airport → About → Skills → Projects → Journey → Milestones → Summit** — and every piece of
content is managed from a protected admin dashboard, so new projects, skills, journey entries
and milestones never require code changes.

> PEAK is the game that inspired the visual language. **Summit** is the portfolio's final destination.

## Status
Built phase by phase — see [`CHECKPOINTS.md`](./CHECKPOINTS.md) and [`.context/CURRENT_STATE.md`](./.context/CURRENT_STATE.md).
Currently: **Phase 1 — Foundation** complete.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion · Supabase (PostgreSQL, Auth, Storage) · React Hook Form + Zod · Vercel.

## Quick start
```bash
npm install
cp .env.example .env.local   # values needed from Phase 9 onward
npm run dev                  # http://localhost:3000
```

## Scripts
| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check` | lint + typecheck + build |

## Structure
```
.context/        Project memory for humans & AI agents (+ design references)
public/          Static assets (backgrounds, icons, logos, placeholders)
src/app/         Routes: (portfolio)/ public · admin/ dashboard · api/
src/components/  UI by domain: layout, navigation, portfolio, projects, skills, journey, milestones, admin, forms, ui
src/lib/         supabase, auth, validation, queries, actions, utils, constants
src/styles/      globals.css (design tokens), fonts
src/types/       Domain types
supabase/        Migrations, seed, notes
```

More: [`DEVELOPMENT.md`](./DEVELOPMENT.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md) · [`.context/`](./.context/README.md).
Full setup, Supabase and admin documentation is finalised in Phase 18.
