# Database

> **Status: built in Phase 9** (`supabase/migrations/`), verified with `npm run db:test`.
> Applied to the live project; the public site reads it since Phase 14.

PostgreSQL via Supabase. Normalised tables — no "whole portfolio in one JSON column".
Small, fixed-shape lists (an About card's items, a project's feature bullets, the departure board) use `jsonb`/`text[]` columns on their parent row because they have no identity of their own.

Type mirrors: `src/types/content.ts` (domain) → `src/types/database.ts` (Supabase `Database` generic, derived from the domain types).

## Conventions
- `id uuid primary key default gen_random_uuid()`
- `created_at` / `updated_at timestamptz not null default now()`; `set_updated_at` trigger on every table with `updated_at`
- Orderable content: `display_order integer not null default 0`, `is_visible boolean not null default true`
- Slugs: `text not null unique`, checked `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- URL columns checked `^https?://` (social links also allow `mailto:`) — blocks `javascript:` links
- Singletons (`profiles`, `site_settings`) enforced with a unique index on `((true))`
- Enums: `content_state`, `project_status`, `social_platform`, `about_card_kind`, `milestone_accent`

## Tables

| Table | Key columns | Relations |
|---|---|---|
| `profiles` | full_name, display_first, display_last, headline_roles text[], tagline, intro, bio, photo_url, location, resume_url, email | singleton |
| `site_settings` | site_title, site_description, og_image_url, departures jsonb (`[{destination, status, icon}]`), departures_note, summit_note, summit_message, resume_enabled | singleton (no `created_at`) |
| `about_cards` | kind, title, items jsonb (`[{label, icon}]`), display_order, is_visible | — |
| `skill_categories` | name, slug, icon, display_order, is_visible | 1‑N skills |
| `skills` | name, slug, category_id, description, icon, logo_url, proficiency (0–100, nullable), featured, display_order, is_visible | FK → skill_categories (set null) |
| `projects` | title, slug, short_description (≤300), description, problem, solution, features text[], process, thumbnail_url, role, status, content_state, github_url, demo_url, documentation_url, featured, started_on, finished_on (≥ started_on), published_at (auto-stamped on first publish), display_order, is_visible | 1‑N project_images, N‑N skills |
| `project_technologies` | project_id, skill_id, display_order | PK (project_id, skill_id); FKs cascade |
| `project_images` | project_id, url, alt, caption, display_order | FK → projects (cascade) |
| `journey_entries` | period_label, date, title, subtitle, description, icon, display_order, is_visible | — |
| `milestone_categories` | name, slug, description, badge_icon, accent, display_order, is_visible | 1‑N milestones |
| `milestones` | title, category_id, issuer, organization, date, description, badge_icon, image_url, certificate_url, external_url, featured, display_order, is_visible | FK → milestone_categories (set null) |
| `social_links` | platform, label, url, display_order, is_visible | — |
| `private.admin_users` | email (lower-case) | allow-list for `is_admin()`; not exposed via the API |

Icon columns store keys from `ContentIcon` (`src/components/ui/ContentIcon.tsx`); unknown keys fall back gracefully.

## Indexes
- `projects (content_state, is_visible, display_order)` — public list; `projects (featured) where content_state = 'published'`
- Unique slugs on `projects`, `skills`, `skill_categories`, `milestone_categories`
- `skills (category_id, display_order)`, `milestones (category_id, display_order)`, `project_images (project_id, display_order)`, `project_technologies (skill_id)`, `about_cards`/`journey_entries (is_visible, display_order)`

## Row Level Security
Enabled on **every** table (`migrations/*_rls.sql`).

| Who | Read | Write |
|---|---|---|
| `anon`, `authenticated` non-admin | singletons always; other tables only `is_visible`; skills/milestones also need a visible (or null) category; projects only `content_state = 'published' and is_visible`; project technologies/images only for such projects | none |
| Admin (`private.is_admin()`) | everything | insert / update / delete |

`private.is_admin()` — `security definer`, `search_path = ''`, true when `auth.jwt() ->> 'email'` (lower-cased) is in `private.admin_users`. Policies call it as `(select private.is_admin())` so it's evaluated once per statement.

## Storage
Bucket `portfolio-media` (public read, 10 MB limit, PNG/JPEG/WebP/AVIF/PDF — **no SVG**, which can carry script). Insert/update/delete only for the admin. Folders by convention: `profile/`, `projects/<id>/`, `skills/`, `milestones/`, `resume/`.

## Migrations, seed & tests
- `supabase/migrations/<timestamp>_<name>.sql` — never edit an applied migration; add a new one.
- `supabase/seed.sql` — starter content mirroring the mocks. Sample projects are seeded as **drafts**; sample milestones are **not** seeded; social links are seeded **hidden** with placeholder URLs.
- `npm run db:test` — applies everything to PGlite and asserts the RLS matrix, singleton/slug/URL/date constraints and triggers.
- Setup steps for a real project: `supabase/README.md`.
