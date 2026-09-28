# CHECKPOINTS.md — Development Control File

> **Every AI coding agent must read this file before doing any work.**
> Then read `.context/README.md` and `.context/CURRENT_STATE.md`.

This portfolio is built **one phase at a time**. A phase is not finished until it has been
verified, documented, reported to the owner, and **explicitly approved**.

---

## Current checkpoint

| Field | Value |
|---|---|
| Current phase | **Phase 11 — Project Management** |
| Phase status | ✅ Complete — **awaiting owner approval** |
| Next phase | Phase 12 — Skills Management (blocked until approved) |

Update this table whenever a phase changes state.

---

## The loop (mandatory for every phase)

1. Read `CHECKPOINTS.md`, `.context/CURRENT_STATE.md`, and the context file for the task.
2. Implement **only** the current phase's tasks. Real files, real code — no pseudocode, no "TODO later" for core requirements.
3. Verify: `npm run lint`, `npm run typecheck`, `npm run build` (plus manual/visual checks relevant to the phase).
4. Update `.context/CURRENT_STATE.md` and `.context/CHANGELOG.md`, and the table above.
5. Send the checkpoint report (format below).
6. **STOP.** Wait for explicit approval.

### What counts as approval
`Continue` · `Proceed` · `Next phase` · `Approved, continue` (or an unambiguous equivalent).

**Silence is not approval.** Having tokens or time left is not approval.

### Corrections
If the owner requests changes, you stay in the **current** phase: fix → verify → update docs → report → STOP again.

---

## Phase rules

1. Never start Phase N+1 before Phase N is approved.
2. Never combine phases unless the owner explicitly says so.
3. Do not break previously approved functionality.
4. Document major architectural changes in `.context/ARCHITECTURE.md` and `CHANGELOG.md`.
5. The final destination is **SUMMIT** (`/summit`, nav label "Summit"). PEAK is only the game that inspired the look. There is no `/peak` route and no "Peak" nav item.
6. Anything that cannot be completed in a phase is recorded in `.context/CURRENT_STATE.md` under *Incomplete work*.

---

## Phase list

| # | Phase | Status |
|---|---|---|
| 1 | Foundation | ✅ Approved |
| 2 | Public Navigation + Airport | ✅ Approved |
| 3 | About | ✅ Complete (batch-approved 3–9) |
| 4 | Skills | ✅ Complete (batch-approved 3–9) |
| 5 | Projects | ✅ Complete (batch-approved 3–9) |
| 6 | Journey | ✅ Complete (batch-approved 3–9) |
| 7 | Milestones | ✅ Complete (batch-approved 3–9) |
| 8 | Summit | ✅ Complete (batch-approved 3–9) |
| 9 | Supabase + Database | ✅ Approved |
| 10 | Authentication + Admin Foundation | ✅ Approved |
| 11 | Project Management | ✅ Complete — awaiting approval |
| 12 | Skills Management | ⏸ Not started |
| 13 | Content Management | ⏸ Not started |
| 14 | Public Database Integration | ⏸ Not started |
| 15 | Polish | ⏸ Not started |
| 16 | Performance + SEO | ⏸ Not started |
| 17 | Final Testing | ⏸ Not started |
| 18 | Documentation + Deployment | ⏸ Not started |

### Phase scopes

**1 — Foundation.** Reference analysis, architecture, project init, folder structure, `.context/`, CHECKPOINTS/CLAUDE/AGENTS, strict TypeScript, Tailwind, design tokens, typography, base layout, responsive foundations. *No Airport page.*

**2 — Public Navigation + Airport.** TopNavigation, ExpeditionSidebar, MobileNavigation, Airport page, passport/profile card with photo placeholder, departure board, START THE CLIMB (→ /about), VIEW PROJECTS (→ /projects), subtle Admin button (→ /admin/login), responsive layout, compare with `.context/references/01-airport.png`.

**3 — About.** Intro, Education, Interests, Development Focus, Location, Current Goals cards; responsive; compare with `02-about.png`.

**4 — Skills.** Equipment & Skills page, categories, skill cards, equipment UI, database-ready components (mock data allowed); compare with `03-skills.png`.

**5 — Projects.** Expeditions page, ProjectCard, StatusBadge, search + filters, responsive grid, project detail design, database-ready (mock data allowed); compare with `04-projects.png`.

**6 — Journey.** Mountain-route timeline (desktop), vertical timeline (mobile), database-ready; compare with `05-journey.png`.

**7 — Milestones.** Category UI, badges, achievement cards, filters, database-ready; compare with `06-milestones.png`.

**8 — Summit.** `/summit`, cinematic sunset environment, THE SUMMIT, final message, Contact / View Projects / GitHub / LinkedIn; verify all public pages together; compare with `07-summit.png`.

**9 — Supabase + Database.** Clients (browser/server), schema, migrations, relations, indexes, storage, seed, RLS, docs.

**10 — Auth + Admin Foundation.** Login, Supabase Auth, route protection (server-side), admin layout/sidebar/header, dashboard stats, logout, unauthorized handling.

**11 — Project Management.** Full CRUD, draft/published/archived, thumbnails, screenshots, technologies, URLs, search, filters, reordering, visibility, featured.

**12 — Skills Management.** Skill + category CRUD, icons/logos, assignment, reordering, visibility, featured, search.

**13 — Content Management.** Profile + photo, About, Journey CRUD, Milestone + category CRUD, social links, site settings, media, resume.

**14 — Public Database Integration.** Replace all mock data with queries; verify draft hidden / published shown / archived hidden; Admin → Public flow.

**15 — Polish.** Motion, microinteractions, loading/empty/error states, image fallbacks, modals, buttons, a11y, device refinement.

**16 — Performance + SEO.** Images, lazy loading, dynamic imports, caching, metadata, OG, favicon, sitemap, robots, canonical.

**17 — Final Testing.** lint/typecheck/build clean; full manual test matrix.

**18 — Documentation + Deployment.** Finalize all docs, Supabase + Vercel deployment guide, mark project complete. STOP.

---

## Checkpoint report format

```
Phase N — <Name> is complete.

Completed:
- ...

Files created/modified:
- ...

Please review:
- ...

Checks:
- Lint: Passed/Failed
- Typecheck: Passed/Failed
- Build: Passed/Failed

Notes:
- ...

I will wait for your approval before beginning Phase N+1 — <Name>.
```

Then **STOP**.
