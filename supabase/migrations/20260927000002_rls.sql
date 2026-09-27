-- ─────────────────────────────────────────────────────────────
-- Expedition Portfolio — Row Level Security
--
-- Public (anon + signed-in non-admins): read only what the site shows.
-- Admin (email listed in private.admin_users): full read/write.
-- The app also checks the session server-side; RLS is the final guard.
-- ─────────────────────────────────────────────────────────────

create schema if not exists private;

-- Allow-list of admin emails. Not exposed through the API (private schema, no grants).
create table private.admin_users (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- security definer: callers can't read admin_users directly, but policies can ask.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_users a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- ── Enable RLS everywhere ────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.about_cards enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_images enable row level security;
alter table public.journey_entries enable row level security;
alter table public.milestone_categories enable row level security;
alter table public.milestones enable row level security;
alter table public.social_links enable row level security;

-- ── Public read policies ─────────────────────────────────────
create policy "Public can read the profile" on public.profiles
  for select to anon, authenticated using (true);

create policy "Public can read site settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "Public can read visible about cards" on public.about_cards
  for select to anon, authenticated using (is_visible);

create policy "Public can read visible skill categories" on public.skill_categories
  for select to anon, authenticated using (is_visible);

create policy "Public can read visible skills in visible categories" on public.skills
  for select to anon, authenticated using (
    is_visible
    and (
      category_id is null
      or exists (select 1 from public.skill_categories c where c.id = category_id and c.is_visible)
    )
  );

create policy "Public can read published projects" on public.projects
  for select to anon, authenticated using (content_state = 'published' and is_visible);

create policy "Public can read technologies of published projects" on public.project_technologies
  for select to anon, authenticated using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.content_state = 'published' and p.is_visible
    )
  );

create policy "Public can read images of published projects" on public.project_images
  for select to anon, authenticated using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.content_state = 'published' and p.is_visible
    )
  );

create policy "Public can read visible journey entries" on public.journey_entries
  for select to anon, authenticated using (is_visible);

create policy "Public can read visible milestone categories" on public.milestone_categories
  for select to anon, authenticated using (is_visible);

create policy "Public can read visible milestones in visible categories" on public.milestones
  for select to anon, authenticated using (
    is_visible
    and (
      category_id is null
      or exists (select 1 from public.milestone_categories c where c.id = category_id and c.is_visible)
    )
  );

create policy "Public can read visible social links" on public.social_links
  for select to anon, authenticated using (is_visible);

-- ── Admin: full access (policies are OR-ed with the read rules above) ──
create policy "Admin manages profile" on public.profiles
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages site settings" on public.site_settings
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages about cards" on public.about_cards
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages skill categories" on public.skill_categories
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages skills" on public.skills
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages projects" on public.projects
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages project technologies" on public.project_technologies
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages project images" on public.project_images
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages journey entries" on public.journey_entries
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages milestone categories" on public.milestone_categories
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages milestones" on public.milestones
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin manages social links" on public.social_links
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
