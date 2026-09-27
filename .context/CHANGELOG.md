# Changelog

All meaningful implementation changes, newest first.

## 2026-09-25 — Phase 1: Foundation

### Added
- Next.js 16.3 (App Router, Turbopack) project with React 19.3, TypeScript 6 (strict + `noUncheckedIndexedAccess`), Tailwind CSS 4.3, ESLint 9 flat config (`eslint-config-next`), Motion, clsx, tailwind-merge.
- npm scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `check`.
- Design tokens in `src/styles/globals.css`: colour (default palette reset), status colours (AA-checked), fluid type scale, radii, shadows, motion, breakpoints, layout variables, surface utilities (`surface-paper`, `surface-wood`, `surface-board`, scrims), reduced-motion guard, focus ring.
- Self-hosted fonts via `next/font/local`: Baloo 2 (display), Kalam (handwritten), Nunito (body).
- Section model `src/lib/constants/sections.ts` (Airport → Summit), site constants, status constants.
- Domain types for every content entity (`src/types/content.ts`).
- Base components: `LogoMark`, `PaperCard`, `ButtonLink`/`buttonClasses`, `SectionTitle`, `Container`, `SkipLink`, `PortfolioShell`, `CheckpointPlaceholder`, `FoundationPreview`.
- Root layout with metadata + viewport; `(portfolio)` route group layout; placeholder pages for all public routes; `loading`, `error`, `not-found`; `icon.svg` + `favicon.ico`.
- Full folder structure (empty folders kept with `.gitkeep`).
- Documentation: `CHECKPOINTS.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, `DEPLOYMENT.md` (initial), `.env.example`, `.gitignore`, `supabase/README.md`, and the whole `.context/` folder including `REFERENCES.md` and the seven reference images.

### Decisions
- Route protection will use Next 16 `proxy.ts` + server-side checks + RLS.
- No admin pages until Phase 10 (avoid unprotected stubs).
