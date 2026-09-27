# Design System

Tokens live in `src/styles/globals.css` (`@theme`). This file explains them. Keep both in sync.
A live specimen renders at `/` during Phase 1 only.

## Colour

Tailwind's default palette is **reset** — only these tokens exist (`bg-navy-900`, `text-blue-500`, …).

| Token | Hex | Use |
|---|---|---|
| `navy-950` | #061536 | Deepest ink, text on light accents |
| `navy-900` | #0B1E4A | Headlines, body text |
| `navy-800` | #14285A | Secondary headline ink, handwritten notes |
| `navy-700` | #1E2E50 | Departure board, dark panels, body copy |
| `navy-500` | #45557C | Muted text, Planned status |
| `navy-300` | #8A97B5 | Disabled, dividers on dark |
| `blue-700` | #0D4FAE | Button bottom edge, pressed |
| `blue-600` | #125FCB | Blue text on light (AA), eyebrows |
| `blue-500` | #1570E6 | Primary action, active trail, sparks, swooshes |
| `blue-300` | #7FB2F5 | Accents on navy |
| `blue-100` | #DCEBFF | Active nav pill, soft highlight, In-progress bg |
| `blue-50` | #EEF5FF | Hover washes |
| `cream` | #F7F1E6 | Page canvas |
| `paper` | #FFF9ED | Cards, passport, nav bar |
| `paper-edge` | #EADFC8 | Card borders |
| `paper-shade` | #F1E6D0 | Inset areas on paper |
| `wood-900/700/500/300` | #3E2819 / #6B4933 / #946A48 / #C9A27C | Signs, boards, plank frames |
| `sunset-700/600/500/100` | #9A4D07 / #D9761A / #F59A3A / #FDEBD6 | Warm accent, Idea status, trail glow |
| `moss-700/600/500/100` | #1A6B3F / #23824F / #2EA36A / #DCF2E5 | READY, Completed |
| `stone-700/500/100` | #5F574C / #8A8174 / #ECE7DE | Archived |
| `flag-red` | #B8322E | Competition badge, banners |
| `gold-500/700` | #C9962E / #8A6414 | Award badge enamel only |
| `plum-600` | #5B3F8F | Accomplishment badge enamel only (never gradients/surfaces) |
| `danger-600/100` | #B42318 / #FDE4E1 | Errors, destructive actions |

Status tokens (`status-completed`, `status-progress`, `status-planned`, `status-idea`, `status-archived`, each with `-bg`) map onto the above. Status text uses the `-700` shade so every pill passes AA (≥ 4.5:1) on its tinted background: Completed 5.6, In progress 4.9, Planned 6.0, Idea 5.2, Archived 5.8.

**Contrast:** body text uses navy on paper/cream (≫ 7:1). Blue text on light surfaces uses `blue-600` (≥ 4.5:1). White on `blue-500` is used only for bold uppercase button text.

## Typography

| Role | Family | Token | Notes |
|---|---|---|---|
| Display | **Baloo 2** (variable 400–800) | `font-display`, utility `font-display-heavy` (800) | Always uppercase for section titles; `text-hero` / `text-title` / `text-heading` |
| Handwritten | **Kalam** 400/700 | `font-hand`, utility `font-handwritten` | Subtitles, journal notes, sign lettering; slight `-rotate-1` |
| Body / UI | **Nunito** (variable 200–1000) | `font-body` (default) | Nav labels, eyebrows (`eyebrow` utility), body |

Fluid scale (320 → 1440px): `text-hero` 44→96px (lh .92), `text-title` 36→72px (lh .95), `text-heading` 24→36px, `text-hand-lg` 22→32px. Body 16px, line length ≤ 70ch.

## Radius (hierarchy, not one value)
`rounded-tag` 8px (badges, tape) · `rounded-control` 14px (buttons, inputs) · `rounded-card` 18px (paper cards) · `rounded-panel` 24px (boards, signs) · `rounded-pill` (nav bar, status pills).

## Shadows
`shadow-paper` (resting card) · `shadow-paper-lift` (hover) · `shadow-nav` (floating nav) · `shadow-button` / `shadow-button-pressed` (3D blue button with darker bottom edge) · `shadow-sign` (wood) · `shadow-glow-blue` (active checkpoint). Warm navy-tinted, never flat grey.

## Surfaces (utilities)
`surface-paper` · `surface-wood` · `surface-board` (departure board) · `scrim-left` / `scrim-bottom` (legibility over scenery).

## Spacing & layout
Tailwind 4px scale. Layout variables: `--nav-height` 4rem, `--sidebar-width` 12.5rem, `--page-gutter` clamp(1rem→2.5rem), `--content-max` 88rem. Z-index tokens `--z-scenery` 0 → `--z-toast` 60.

## Navigation (built Phase 2)
- Top nav: `surface-paper` pill, `shadow-nav`, centered, fixed; active = `bg-blue-100` pill + 3px `blue-500` underline; label "Summit" (never "Peak").
- Sidebar: dashed `navy-300` route line, solid `blue-500` for completed segment; inactive badge `navy-700` 36px; active `blue-500` 44px + `shadow-glow-blue`.
- Mobile (< lg): floating paper bar — logo, `NN / Label` of the current checkpoint, a 7-dot progress indicator, and a navy **Map** button that opens a right-side `<dialog>` sheet listing all 7 checkpoints on a trail (label + handwritten meaning). Esc, the ✕ button, the backdrop, or choosing a link closes it; the page behind is scroll-locked.
- Active state everywhere comes from `useActiveSection()`; nested routes (e.g. `/projects/x`) light up their parent.

## Motion
Durations `--duration-quick` 150ms · `-base` 250ms · `-slow` 400ms. Easing `--ease-trail` (default), `--ease-snap` (small bounces on badges). Keyframes: `flag-wave`, `cloud-drift`.
Rules: one orchestrated reveal per page at most; hover lift ≤ 2px; no long intros; everything respects `prefers-reduced-motion` (global CSS guard + `motion-reduce:` variants + Motion's `useReducedMotion`).

## Responsive
Breakpoints: `xs` 375 · `sm` 640 · `md` 768 · `lg` 1024 (sidebar appears) · `xl` 1280 · `2xl` 1536 · `3xl` 1920. Design targets 320/375/430/768/1024/1440/1920+. Adapt layouts (stack boards into cards, vertical journey) — never scale the desktop down.

## Iconography
Line icons, 2px stroke, rounded caps, drawn inline as SVG components (no icon font). Brand logos for skills come from the database (Phase 12) with a generic gear fallback.

## Don'ts
Purple SaaS gradients · glassmorphism · random glowing blobs · black developer template · Bootstrap-looking grids · text directly on busy art without a scrim.
