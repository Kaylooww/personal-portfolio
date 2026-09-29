# Project

## Purpose
Personal portfolio for **Kyle Angelo C. Castro** — BSIT Student • Developer • UI/UX Enthusiast.
It must read as one connected expedition through his growth, not a generic developer template,
and it must let him add projects, skills, journey entries and milestones forever without touching code.

## Goals
- Distinctive PEAK-inspired visual identity that closely follows the seven references.
- Fully content-managed via a protected admin (Supabase).
- Target: Lighthouse 90+ in Performance, Accessibility, Best Practices, SEO (not yet measured on a deployed site).
- Maintainable by humans and AI agents (this folder + CHECKPOINTS.md).

## Visual concept
Inspired by the game **PEAK** — climbing, expeditions, islands, camps, ropes, flags, checkpoints.
Materials: paper cards, wood signs, expedition gear, maps. Navy ink, trail blue, sunset orange, moss green.
Headlines are heavy and rounded; supporting lines are handwritten journal notes.

> PEAK = the inspiration. **SUMMIT = the portfolio's final destination.** Never swap them.

## The expedition (section order)

| # | Checkpoint | Route | Meaning | Scene |
|---|---|---|---|---|
| 1 | Airport | `/` | The journey begins | Sunny island terminal, departure board |
| 2 | About | `/about` | Who I am | Beach camp, wooden notice board |
| 3 | Skills | `/skills` | Equipment acquired | Jungle cliffs, gear board |
| 4 | Projects | `/projects` | Expeditions | Canyon camp, rope bridge |
| 5 | Journey | `/journey` | Progress and checkpoints | Volcanic ridge, glowing trail |
| 6 | Milestones | `/milestones` | Achievements earned | Banner citadel, stone path |
| 7 | Summit | `/summit` | Where the next climb begins | Sunset summit above clouds |

Single source of truth in code: `src/lib/constants/sections.ts`.

## Technology stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript 6 (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Animation | CSS only (keyframes, transitions, `@starting-style`) — the Motion library was removed in Phase 15 as unused |
| Backend / DB / Auth / Storage | Supabase (PostgreSQL, Auth, Storage) — Phase 9+ |
| Forms / validation | React Hook Form + Zod — Phase 10+ |
| Deployment | Vercel |
| Package manager | npm |
