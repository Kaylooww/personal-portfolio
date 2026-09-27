# Database

> **Status: planned — built in Phase 9.** This is the target design; update it to match the actual migrations when they land.

PostgreSQL via Supabase. Normalised tables — no "whole portfolio in one JSON column".
Small, fixed-shape lists (e.g. an About card's items, a project's feature bullets) use `jsonb`/`text[]` columns on their parent row because they have no identity of their own.

## Conventions
- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()` + `set_updated_at` trigger
- Orderable content: `display_order integer not null default 0`, `is_visible boolean not null default true`
- Slugs: `text not null unique`, checked `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Enums as Postgres types: `content_state ('draft','published','archived')`, `project_status ('completed','in_progress','planned','idea','archived')`, `social_platform`

## Tables

| Table | Key columns | Relations |
|---|---|---|
| `profiles` | full_name, display_first, display_last, headline_roles text[], tagline, intro, bio, photo_url, location, resume_url, email | singleton (one row) |
| `about_cards` | kind (education/interests/focus/location/goals), title, items jsonb, display_order, is_visible | — |
| `skill_categories` | name, slug, icon, display_order, is_visible | 1‑N skills |
| `skills` | name, slug, category_id, description, icon, logo_url, proficiency (0–100, nullable), featured, display_order, is_visible | FK → skill_categories (on delete set null) |
| `projects` | title, slug, short_description, description, problem, solution, features text[], process, thumbnail_url, role, status, content_state, github_url, demo_url, documentation_url, featured, started_on, finished_on, published_at, display_order, is_visible | 1‑N project_images, N‑N skills |
| `project_technologies` | project_id, skill_id, display_order | PK (project_id, skill_id); FKs cascade |
| `project_images` | project_id, url, alt, caption, display_order | FK → projects (cascade) |
| `journey_entries` | period_label, date, title, subtitle, description, icon, display_order, is_visible | — |
| `milestone_categories` | name, slug, description, badge_icon, accent, display_order, is_visible | 1‑N milestones |
| `milestones` | title, category_id, issuer, organization, date, description, badge_icon, image_url, certificate_url, external_url, featured, display_order, is_visible | FK → milestone_categories (set null) |
| `social_links` | platform, label, url, display_order, is_visible | — |
| `site_settings` | site_title, site_description, og_image_url, departures jsonb, resume_enabled | singleton |

## Indexes
- `projects (content_state, is_visible, display_order)` — public list
- `projects (featured) where content_state = 'published'`
- `projects (slug)` unique; `skills (slug)` unique; `skill_categories (slug)` unique; `milestone_categories (slug)` unique
- `skills (category_id, display_order)`, `milestones (category_id, display_order)`, `project_images (project_id, display_order)`, `project_technologies (skill_id)`
- Trigram/`ilike` search on `projects.title` if project count warrants it (Phase 11 decision)

## Row Level Security
Enabled on **every** table.

| Role | Read | Write |
|---|---|---|
| `anon`, `authenticated` (non-admin) | Only visible rows; projects only when `content_state = 'published'`; singletons always | none |
| Admin (`is_admin()`) | everything | insert / update / delete |

`is_admin()` — `security definer` SQL function returning true when `auth.jwt() ->> 'email'` matches the row in a private `admin_users` table (seeded from `ADMIN_EMAIL`). Storage policies mirror this: public read on the media bucket, admin-only write/delete.

## Migrations & seed
- `supabase/migrations/<timestamp>_<name>.sql`, applied with the Supabase CLI.
- `supabase/seed.sql` — starter content from the brief. Reference project names (SkyTrack, CampNotes, Summit Social, Peak Planner) are seeded **only** as clearly-labelled drafts, or not at all, so they are never presented as Kyle's real work.
