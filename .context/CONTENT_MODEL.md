# Content Model

TypeScript types: `src/types/content.ts` (mirror of the planned schema in `DATABASE.md`).

| Content | Stored in | Public visibility rule | Edited at |
|---|---|---|---|
| Profile (name, roles, tagline, bio, photo, resume) | `profiles` (single row) | always | `/admin/profile` |
| About cards (Education, Interests, Focus, Location, Goals) | `about_cards` | `is_visible` | `/admin/about` |
| Skill categories | `skill_categories` | `is_visible` | `/admin/skills` |
| Skills | `skills` | `is_visible` (and category visible) | `/admin/skills` |
| Projects | `projects` | `content_state = 'published'` **and** `is_visible` | `/admin/projects` |
| Project technologies | `project_technologies` → `skills` | via project | project form |
| Project screenshots | `project_images` + Storage | via project | project form |
| Journey entries | `journey_entries` | `is_visible` | `/admin/journey` |
| Milestone categories | `milestone_categories` | `is_visible` | `/admin/milestones` |
| Milestones | `milestones` | `is_visible` | `/admin/milestones` |
| Social links | `social_links` | `is_visible`; empty links are never rendered | `/admin/settings` |
| Site settings (SEO, departure board, resume toggle) | `site_settings` (single row) | always | `/admin/settings` |

## Two different "status" ideas on projects
- `status` (**ProjectStatus**) — where the expedition is: Completed, In Progress, Planned, Idea, Archived. Shown as a badge.
- `content_state` (**ContentState**) — editorial: Draft, Published, Archived. Controls whether the project is public.

A project can be *Published* with status *Planned* (a public plan), or *Draft* with status *Completed* (finished but not yet written up).

## Ordering
Every orderable list uses `display_order` (ascending). Admin reorders with Move Up/Move Down (drag-and-drop if stable).

## Placeholder content
Until Phase 14, public pages use mock data from a single module per entity under `src/lib/mock/` (created in the phase that needs it), read **only** through `src/lib/queries/*`. Phase 14 deletes these modules and rewrites the query bodies.

Existing mocks → query functions:

| Mock | Query | Notes |
|---|---|---|
| `mock/profile.ts` | `getProfile()` | |
| `mock/site-settings.ts` | `getSiteSettings()` | departures, `departures_note`, `summit_note`, `summit_message` |
| `mock/about.ts` | `getAboutCards()` | |
| `mock/skills.ts` | `getSkillCategoriesWithSkills()`, `getSkillsById()` | empty categories dropped |
| `mock/projects.ts` | `getPublishedProjects()`, `getPublishedProjectBySlug()` | includes 1 draft + 1 archived to prove filtering |
| `mock/journey.ts` | `getJourneyEntries()` | reference text — owner to verify |
| `mock/milestones.ts` | `getMilestoneCategories()`, `getMilestones()` | includes 1 hidden to prove filtering |
| `mock/social-links.ts` | `getSocialLinks()` | **placeholder URLs** — replace before launch |

## Media
Stored in the Supabase Storage bucket; the database stores the public URL. Missing images fall back to themed placeholders (profile silhouette, expedition placeholder, default badge) — a broken `<img>` is never rendered.
