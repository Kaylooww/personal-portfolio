# AGENTS.md — Instructions for AI coding agents (Codex, Cursor, ChatGPT, others)

> **IMPORTANT — before performing substantial work:**
>
> 1. Read `CHECKPOINTS.md`
> 2. Read `.context/README.md`
> 3. Read `.context/CURRENT_STATE.md`
> 4. Read the `.context/` file relevant to your task.
>
> **Never advance to another development phase without explicit user approval.**
> Silence is not approval.

## Project in one paragraph

A PEAK-inspired, expedition-themed personal portfolio for **Kyle Angelo C. Castro**
(BSIT Student • Developer • UI/UX Enthusiast). Seven checkpoints — Airport → About →
Skills → Projects → Journey → Milestones → **Summit** — plus a Supabase-backed admin so
all content is managed without code changes. Next.js (App Router) + TypeScript + Tailwind v4
+ Supabase, deployed on Vercel.

## Standing rules

- Do not unnecessarily rewrite working architecture.
- Do not hardcode dynamic portfolio data (projects, skills, journey, milestones, profile, links, settings). Mock data is allowed only in the phases that say so, and must live in one replaceable place.
- Keep documentation updated: `.context/CURRENT_STATE.md` after every phase, `.context/CHANGELOG.md` after meaningful changes.
- Run `npm run lint && npm run typecheck && npm run build` after meaningful changes.
- Preserve the PEAK-inspired design language: paper, wood, maps, flags, ropes, checkpoints. No generic SaaS/glassmorphism/purple gradients.
- The final section is always **SUMMIT** (`/summit`, "Summit", "THE SUMMIT"). "PEAK" refers only to the game that inspired the visuals. Never create `/peak` or a "Peak" nav item — even though the reference images show one.
- Prefer Server Components; use `"use client"` only where interactivity requires it.
- Strict TypeScript. No `any`.
- The Supabase service-role key is server-only. Never import it into client code.
- Reference designs live in `.context/references/`. Rebuild them as real UI — never ship the screenshots as the page.

## Commands

```bash
npm run dev         # local dev server
npm run lint        # ESLint (flat config)
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm run check       # all three
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
