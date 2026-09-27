-- ─────────────────────────────────────────────────────────────
-- Expedition Portfolio — schema
-- Tables, enums, constraints, indexes and updated_at triggers.
-- Mirrors src/types/content.ts and src/types/database.ts.
-- ─────────────────────────────────────────────────────────────

-- ── Enums ────────────────────────────────────────────────────
create type public.content_state as enum ('draft', 'published', 'archived');
create type public.project_status as enum ('completed', 'in_progress', 'planned', 'idea', 'archived');
create type public.social_platform as enum ('github', 'linkedin', 'email', 'website', 'facebook', 'other');
create type public.about_card_kind as enum ('education', 'interests', 'focus', 'location', 'goals');
create type public.milestone_accent as enum ('navy', 'red', 'gold', 'blue', 'green', 'purple');

-- ── Helpers ──────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Reusable checks, written inline per table:
--   slug:  ^[a-z0-9]+(?:-[a-z0-9]+)*$
--   url:   ^https?://   (social links also allow mailto:)

-- ── Singletons ───────────────────────────────────────────────
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  display_first text not null,
  display_last text not null,
  headline_roles text[] not null default '{}',
  tagline text not null default '',
  intro text not null default '',
  bio text not null default '',
  photo_url text check (photo_url ~ '^https?://'),
  location text,
  resume_url text check (resume_url ~ '^https?://'),
  email text check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Exactly one profile row.
create unique index profiles_singleton on public.profiles ((true));

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null,
  site_description text not null default '',
  og_image_url text check (og_image_url ~ '^https?://'),
  departures jsonb not null default '[]'::jsonb check (jsonb_typeof(departures) = 'array'),
  departures_note text,
  summit_note text,
  summit_message text,
  resume_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
create unique index site_settings_singleton on public.site_settings ((true));

-- ── About ────────────────────────────────────────────────────
create table public.about_cards (
  id uuid primary key default gen_random_uuid(),
  kind public.about_card_kind not null,
  title text not null check (char_length(title) between 1 and 80),
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index about_cards_public_idx on public.about_cards (is_visible, display_order);

-- ── Skills ───────────────────────────────────────────────────
create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  icon text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category_id uuid references public.skill_categories (id) on delete set null,
  description text,
  icon text,
  logo_url text check (logo_url ~ '^https?://'),
  proficiency smallint check (proficiency between 0 and 100),
  featured boolean not null default false,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index skills_category_order_idx on public.skills (category_id, display_order);

-- ── Projects ─────────────────────────────────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null check (char_length(short_description) between 1 and 300),
  description text,
  problem text,
  solution text,
  features text[] not null default '{}',
  process text,
  thumbnail_url text check (thumbnail_url ~ '^https?://'),
  role text,
  status public.project_status not null default 'planned',
  content_state public.content_state not null default 'draft',
  github_url text check (github_url ~ '^https?://'),
  demo_url text check (demo_url ~ '^https?://'),
  documentation_url text check (documentation_url ~ '^https?://'),
  featured boolean not null default false,
  started_on date,
  finished_on date,
  published_at timestamptz,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_dates_ordered check (finished_on is null or started_on is null or finished_on >= started_on)
);
create index projects_public_idx on public.projects (content_state, is_visible, display_order);
create index projects_featured_idx on public.projects (featured) where content_state = 'published';

create table public.project_technologies (
  project_id uuid not null references public.projects (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  display_order integer not null default 0,
  primary key (project_id, skill_id)
);
create index project_technologies_skill_idx on public.project_technologies (skill_id);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  url text not null check (url ~ '^https?://'),
  alt text not null default '',
  caption text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index project_images_project_order_idx on public.project_images (project_id, display_order);

-- Stamp published_at the first time a project goes public.
create or replace function public.stamp_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.content_state = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

-- ── Journey ──────────────────────────────────────────────────
create table public.journey_entries (
  id uuid primary key default gen_random_uuid(),
  period_label text not null check (char_length(period_label) between 1 and 20),
  date date,
  title text not null check (char_length(title) between 1 and 80),
  subtitle text,
  description text,
  icon text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index journey_entries_public_idx on public.journey_entries (is_visible, display_order);

-- ── Milestones ───────────────────────────────────────────────
create table public.milestone_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  badge_icon text,
  accent public.milestone_accent,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  category_id uuid references public.milestone_categories (id) on delete set null,
  issuer text,
  organization text,
  date date,
  description text,
  badge_icon text,
  image_url text check (image_url ~ '^https?://'),
  certificate_url text check (certificate_url ~ '^https?://'),
  external_url text check (external_url ~ '^https?://'),
  featured boolean not null default false,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index milestones_category_order_idx on public.milestones (category_id, display_order);

-- ── Social links ─────────────────────────────────────────────
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform public.social_platform not null,
  label text not null check (char_length(label) between 1 and 40),
  url text not null check (url ~ '^(https?://|mailto:)'),
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Triggers ─────────────────────────────────────────────────
create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.about_cards for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.skill_categories for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.skills for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.journey_entries for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.milestone_categories for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.milestones for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.social_links for each row execute function public.set_updated_at();

create trigger stamp_published_at before insert or update of content_state on public.projects
  for each row execute function public.stamp_published_at();
