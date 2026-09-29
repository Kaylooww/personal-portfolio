# Content Model

TypeScript types: `src/types/content.ts` (mirror of the implemented schema in `DATABASE.md`).

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
Manual lists use `display_order` (ascending), edited with Move Up/Move Down.
Public projects show `featured = true` first, then `display_order`
within each group. Skills follow the same rule within their existing categories;
category order is unchanged. Project numbering follows the same featured-first
index as the public list. Project/skill admin lists retain manual order for their reorder controls.

Milestones sort automatically in public and admin views: featured first, date
descending (newest first, null dates last within each featured group), then legacy
`display_order` and `id` for stable ties. Saving or changing the date updates the
position through the existing route revalidation. Milestone move arrows are removed;
category ordering remains manual.

## Public reads (Phase 14)
All public pages read Supabase through `src/lib/queries/*` with the cookie-less anon client (`publicDb()` in `queries/public-db.ts`). Each query filters explicitly **and** RLS enforces the same rules:

| Query | Rule |
|---|---|
| `getProfile()`, `getSiteSettings()` | singleton; safe fallbacks if the row is missing |
| `getResumeUrl()` | only when `site_settings.resume_enabled` **and** a résumé is uploaded |
| `getAboutCards()`, `getJourneyEntries()`, `getSocialLinks()` | `is_visible`, display order |
| `getSkillCategoriesWithSkills()` | visible categories × visible, categorised skills; empty categories dropped |
| `getPublishedProjects()`, `getPublishedProjectBySlug()` | `content_state = 'published'` **and** `is_visible`; hidden skills dropped from tech stacks |
| `getMilestoneCategories()`, `getMilestones()` | visible categories; visible milestones in visible (or no) category |

The mock modules (`src/lib/mock/*`) were deleted in Phase 14. Starter content lives in `supabase/seed.sql`.

## Media
Stored in the Supabase Storage bucket; the database stores the public URL. Missing images fall back to themed placeholders (profile silhouette, expedition placeholder, default badge) — a broken `<img>` is never rendered.
Milestone logs show uploaded image previews. Clicking a log opens its full image,
description, issuer/organization/date and available proof links in a modal; the
original image can also be opened in a new tab.
