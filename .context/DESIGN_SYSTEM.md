# Design System

Tokens live in `src/styles/globals.css` (`@theme`). This file explains them. Keep both in sync.
The Phase 1 specimen was replaced by the Airport page; tokens remain in `src/styles/globals.css`.

## Colour

Tailwind's default palette is **reset**. Fixed expedition colors below remain for
artwork, badges and buttons; UI surfaces and text use the theme tokens that follow.

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

**Contrast:** the light theme uses navy on paper/cream (≫ 7:1). The dark theme uses
warm pale text on navy surfaces. Link text uses the semantic `link` token in both
themes; white on fixed `blue-500` remains for bold uppercase button text.

### Light and dark themes (2026-10-08)

| UI token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | #F7F1E6 | #0A121D | Page canvas |
| `surface` | #FFF9ED | #172635 | Cards, navigation, dialogs |
| `surface-inset` | #F1E6D0 | #203344 | Inset panels and controls |
| `surface-edge` | #EADFC8 | #3C5261 | Borders |
| `field` | #FFFFFF | #101F2D | Form fields |
| `ink` | #0B1E4A | #F6EDDC | Main text |
| `ink-strong` | #14285A | #F1E5CD | Headings and handwritten notes |
| `ink-muted` | #1E2E50 | #D2DEEA | Secondary text |
| `ink-subtle` | #45557C | #AFC2D5 | Supporting labels |
| `link` | #125FCB | #9ACAFF | Links and small blue text |
| `active` | #DCEBFF | #223F5B | Active navigation |

`@theme inline` maps these utilities to `--ui-*` values in `:root` and
`html[data-theme="dark"]`. Prefer `bg-surface` / `text-ink` for UI; fixed
`text-paper` still belongs on fixed dark boards and blue buttons. Shadows, grain,
wood-sign text, errors and legibility scrims also adapt to the selected theme.

The sun/moon switch is a 44px labelled button in desktop/mobile navigation and
the admin header. First visit follows the device preference; selecting a theme
saves `portfolio-theme` in local storage and synchronizes other tabs. It is applied
before paint. The stored preference takes priority over later system changes.

All seven SVG environments preserve their geography at night: terminal lights,
moonlit shore and water, shaded jungle, canyon, ridge, citadel and summit clouds.
`scenes/scenes.css` defines their palettes; `NightSky` adds moon and stars. Day suns
are hidden at night. Projects and Journey use filled cloth pennants with a mountain
crest, stitched edges and a folded tail.

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
- Top nav: `surface-paper` pill, `shadow-nav`, centered, fixed; active = `bg-active` pill + 3px `blue-500` underline; label "Summit" (never "Peak"). Includes the theme switch.
- Sidebar: dashed `navy-300` route line, solid `blue-500` for completed segment; inactive badge `navy-700` 36px; active `blue-500` 44px + `shadow-glow-blue`.
- Mobile (< lg): floating paper bar — logo, `NN / Label` of the current checkpoint, a 7-dot progress indicator, and a navy **Map** button that opens a right-side `<dialog>` sheet listing all 7 checkpoints on a trail (label + handwritten meaning). Esc, the ✕ button, the backdrop, or choosing a link closes it; the page behind is scroll-locked.
- Active state everywhere comes from `useActiveSection()`; nested routes (e.g. `/projects/x`) light up their parent.
- Next-stop signs use the actual destination label (About, Skills, Projects,
  Journey, Milestones, Summit). Airport's Admin entry is a 14px circle using `ink`
  in the passport card's lower-left, inside a 44px keyboard/touch target.

## Motion
Durations `--duration-quick` 150ms · `-base` 250ms · `-slow` 400ms. Easing `--ease-trail` (default), `--ease-snap` (small bounces on badges). Keyframes: `flag-wave`, `cloud-drift`.
Rules: one orchestrated content reveal per page at most; hover lift ≤ 2px; everything
respects `prefers-reduced-motion` (global CSS guard + `motion-reduce:` variants).

Built (Phase 15, all CSS):
- `reveal-stagger` utility — direct children rise in (`--animate-rise`, 12px, 400ms) with 80ms steps; applied to each page's top-level container (`CheckpointPage`, Airport grid). This is the page's one orchestrated reveal.
- `animate-trail-march` — Journey route dots walk up the trail; `animate-nudge` — departure board "boarding next" arrow.
- Dialogs: `dialog` fades/scales in, `dialog.sheet` (mobile map) slides from the right, backdrops fade — via `@starting-style` + `allow-discrete`.
- Toasts rise in; buttons' trailing icons nudge on hover (`group/btn`); project cards lift and thumbnails zoom 3%.
- Verified: with reduced motion emulated, nothing starts transparent and the trail doesn't animate.

Journey additionally starts at the bottom and scrolls upward on entry (140ms pause,
1–1.6 seconds of eased movement). Mobile entries climb from oldest at the bottom
to newest at the top. Any input cancels the animation immediately; reduced motion,
history restoration and anchor navigation skip it. This uses a small
`requestAnimationFrame` loop in `JourneyArrival`, with no animation dependency.

## Responsive
Breakpoints: `xs` 375 · `sm` 640 · `md` 768 · `lg` 1024 (sidebar appears) · `xl` 1280 · `2xl` 1536 · `3xl` 1920. Design targets 320/375/430/768/1024/1440/1920+. Adapt layouts (stack boards into cards, vertical journey) — never scale the desktop down.

## Iconography
Line icons, 2px stroke, rounded caps, drawn inline as SVG components (no icon font). Brand logos for skills come from the database (Phase 12) with a generic gear fallback.

## Don'ts
Purple SaaS gradients · glassmorphism · random glowing blobs · black developer template · Bootstrap-looking grids · text directly on busy art without a scrim.
