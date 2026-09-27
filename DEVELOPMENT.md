# Development

## Requirements
Node.js ≥ 20.9 (developed on 22), npm ≥ 10.

## Workflow
1. Read `CHECKPOINTS.md` — confirm the current phase is approved to work on.
2. `npm run dev`.
3. Build only the current phase's scope.
4. `npm run check` before calling anything done.
5. Update `.context/CURRENT_STATE.md` and `.context/CHANGELOG.md`.

## Conventions
- Tokens only (see `.context/DESIGN_SYSTEM.md`). Tailwind's default palette is disabled on purpose.
- Server Components by default; small client islands.
- `@/` import alias; `import type` for types.
- New public page → add to `src/lib/constants/sections.ts` only if it's a checkpoint.
- New content entity → type in `src/types/content.ts`, table in a migration, doc in `.context/CONTENT_MODEL.md`.

## Fonts
Self-hosted in `src/styles/fonts/` and loaded by `src/styles/fonts.ts` (`next/font/local`). To swap a font, replace the `.woff2` and update the loader — do not add a `<link>` to Google Fonts.

## Reduced motion
Test with the OS "reduce motion" setting on. Everything must still work without animation.
