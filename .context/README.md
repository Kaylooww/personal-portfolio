# .context — How AI assistants should use this folder

This folder is the project's long-term memory. It exists so that Claude, ChatGPT, Cursor,
Codex, or any future agent can pick up the work without re-deriving decisions.

## Reading order

1. `../CHECKPOINTS.md` — which phase we are in and whether you may proceed.
2. `CURRENT_STATE.md` — what exists, what is broken, what is next.
3. The file for your task:

| Task | Read |
|---|---|
| Anything visual | `DESIGN_SYSTEM.md`, `REFERENCES.md`, `references/*.png` |
| Architecture, data fetching, caching, server/client split | `ARCHITECTURE.md` |
| Tables, RLS, migrations | `DATABASE.md`, `CONTENT_MODEL.md` |
| Adding/changing pages | `ROUTES.md` |
| Building or reusing UI | `COMPONENTS.md` |
| Admin, auth, publishing | `ADMIN.md` |
| General conduct | `DEVELOPMENT_RULES.md` |

## Writing rules

- `CURRENT_STATE.md` — rewrite at the end of every phase (it is a snapshot, not a log).
- `CHANGELOG.md` — append after meaningful changes (it is a log).
- Other files — update when the thing they describe changes. If code and docs disagree, fix the docs in the same change.
- Keep files factual and short. Mark anything planned-but-not-built as **(planned — Phase N)**.

## References

`references/01-airport.png` … `07-summit.png` are the owner's seven design references.
They are **design targets**, not assets: they contain baked-in text (including a "PEAK" nav item
that must be rendered as "Summit") and must never be used as page backgrounds.
