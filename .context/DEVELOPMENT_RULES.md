# Development Rules

1. Do not create monolithic components.
2. Keep components reusable.
3. Prefer Server Components unless interactivity requires Client Components.
4. Do not hardcode portfolio content that belongs in the database.
5. Preserve the PEAK-inspired visual identity.
6. The final destination is called SUMMIT.
7. Preserve responsive behavior.
8. Use strict TypeScript.
9. Validate forms.
10. Protect admin actions.
11. Run lint/typecheck/build after major work.
12. Update CURRENT_STATE.md after every phase.
13. Update CHANGELOG.md after meaningful changes.
14. Follow CHECKPOINTS.md.
15. Never start the next phase without user approval.

## House conventions
- Colours, radii, shadows and type sizes come from tokens. No raw hex in components (SVG fills that must match a token use `var(--color-…)`).
- `cn()` (`src/lib/utils/cn.ts`) for conditional classes.
- Imports use the `@/` alias. Type-only imports use `import type`.
- Comments explain *why*, not *what*.
- Decorative SVG/art gets `aria-hidden`; meaningful images get real `alt` text.
- Every interactive element has a visible focus state (global `:focus-visible` ring — don't remove it).
- Animations respect `prefers-reduced-motion`.
- Never commit secrets. `.env.local` is ignored; `.env.example` documents every variable.
- Don't add a UI kit that makes the site look generic. Build custom components from the tokens.
