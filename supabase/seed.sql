-- ─────────────────────────────────────────────────────────────
-- Expedition Portfolio — starter content
--
-- Mirrors the Phase 2–8 mock data (src/lib/mock/*) so the site looks the same
-- once it reads from Supabase (Phase 14). Idempotent enough to run on an empty
-- database; `supabase db reset` runs it automatically after the migrations.
--
-- Placeholder policy:
--   • Sample projects are seeded as DRAFTS (never public until edited).
--   • Sample milestones are NOT seeded; only real ones are.
--   • Social links are seeded HIDDEN with placeholder URLs — set the real
--     URLs and make them visible in the admin (or here) before launch.
--
-- ADMIN ACCESS — run once with your admin email (same as ADMIN_EMAIL):
--   insert into private.admin_users (email) values (lower('you@example.com'));
-- ─────────────────────────────────────────────────────────────

-- ── Profile & settings ───────────────────────────────────────
insert into public.profiles (full_name, display_first, display_last, headline_roles, tagline, intro, bio, location)
values (
  'Kyle Angelo C. Castro',
  'Kyle Angelo',
  'C. Castro',
  array['BSIT Student', 'Developer', 'UI/UX Enthusiast'],
  E'Building ideas,\none climb at a time.',
  'BSIT student and aspiring developer who loves turning ideas into creative, meaningful digital experiences.',
  'I enjoy building, exploring, and learning new things — always one step closer to the summit.',
  'Philippines'
);

insert into public.site_settings (site_title, site_description, departures, departures_note, summit_note, summit_message)
values (
  'Kyle Angelo C. Castro | Developer Portfolio',
  'Portfolio of Kyle Angelo C. Castro, a BSIT student, developer, and UI/UX enthusiast building meaningful digital experiences.',
  '[
    {"destination": "My Portfolio", "status": "ready", "icon": "laptop"},
    {"destination": "Shore", "status": "up_next", "icon": "palm"},
    {"destination": "Bigger Things", "status": "planned", "icon": "mountain"}
  ]'::jsonb,
  E'Same ideas.\nHigher places.',
  E'Every project was\nanother step upward.',
  'Thanks for climbing with me. This is where one expedition ends and the next begins — if you have an idea, a project or an opportunity, I''d love to hear about it.'
);

-- ── About ────────────────────────────────────────────────────
insert into public.about_cards (kind, title, items, display_order) values
  ('education', 'Education', '[{"label": "BS Information Technology Student", "icon": "graduation"}, {"label": "Philippines", "icon": "pin"}]', 1),
  ('interests', 'Interests', '[{"label": "Games & Interactive Media", "icon": "gamepad"}, {"label": "Travel & Nature", "icon": "mountain"}, {"label": "Photography", "icon": "camera"}, {"label": "Music", "icon": "music"}]', 2),
  ('focus', 'Development Focus', '[{"label": "Frontend Development", "icon": "monitor"}, {"label": "UI/UX Design", "icon": "pen"}, {"label": "Web Development", "icon": "globe"}, {"label": "Creative Projects", "icon": "box"}]', 3),
  ('location', 'Location', '[{"label": "Philippines", "icon": "palm"}]', 4),
  ('goals', 'Current Goals', '[{"label": "Complete my degree", "icon": null}, {"label": "Build meaningful projects", "icon": null}, {"label": "Grow as a developer", "icon": null}, {"label": "Explore more of the world", "icon": null}]', 5);

-- ── Skills ───────────────────────────────────────────────────
insert into public.skill_categories (name, slug, icon, display_order) values
  ('Programming', 'programming', 'code', 1),
  ('Frontend', 'frontend', 'monitor', 2),
  ('Backend', 'backend', 'server', 3),
  ('Database', 'database', 'database', 4),
  ('Tools', 'tools', 'tools', 5),
  ('UI/UX', 'ui-ux', 'palette', 6);

insert into public.skills (name, slug, category_id, featured, display_order)
select s.name, s.slug, c.id, s.featured, s.display_order
from (values
  ('JavaScript', 'javascript', 'programming', true, 1),
  ('Java', 'java', 'programming', false, 2),
  ('C', 'c', 'programming', false, 3),
  ('HTML', 'html', 'frontend', false, 4),
  ('CSS', 'css', 'frontend', false, 5),
  ('React', 'react', 'frontend', true, 6),
  ('Java', 'java-backend', 'backend', false, 7),
  ('C', 'c-backend', 'backend', false, 8),
  ('PostgreSQL', 'postgresql', 'database', false, 9),
  ('Git', 'git', 'tools', false, 10),
  ('Figma', 'figma', 'ui-ux', true, 11)
) as s(name, slug, category_slug, featured, display_order)
join public.skill_categories c on c.slug = s.category_slug;

-- ── Projects ─────────────────────────────────────────────────
insert into public.projects
  (title, slug, short_description, description, problem, solution, features, process, role, status, content_state, featured, started_on, display_order)
values (
  'Expedition Portfolio',
  'expedition-portfolio',
  'This portfolio — a game-inspired climb from the airport to the summit, with an admin dashboard to manage every checkpoint.',
  'A personal portfolio designed as an expedition. Each section is a checkpoint on the route, with hand-built scenery, paper cards, wooden signs and a trail map for navigation.',
  'Most student portfolios look like the same template. I wanted one that shows personality and can grow without code changes.',
  'A themed Next.js site backed by Supabase, where projects, skills, journey entries and milestones are all managed from a protected admin.',
  array[
    'Seven themed checkpoints, from Airport to Summit',
    'Responsive navigation: top bar, route sidebar and mobile map',
    'Search and status filters for projects',
    'Admin dashboard for all content (in progress)'
  ],
  'Built phase by phase: foundation, navigation, each checkpoint, then the database and admin.',
  'Designer & Developer',
  'in_progress',
  'published',
  true,
  '2026-09-01',
  1
);

-- Samples: DRAFT so they never appear publicly until replaced.
insert into public.projects (title, slug, short_description, role, status, content_state, display_order) values
  ('Sample Completed Project', 'sample-completed-project', 'Placeholder card showing a finished expedition. Replace it from the admin dashboard.', 'Full Stack Developer', 'completed', 'draft', 2),
  ('Sample Planned Project', 'sample-planned-project', 'Placeholder card for an expedition that is mapped out but not yet started.', 'Frontend Developer', 'planned', 'draft', 3),
  ('Sample Idea', 'sample-idea', 'Placeholder card for an idea still being sketched in the journal.', 'Product Designer', 'idea', 'draft', 4);

insert into public.project_technologies (project_id, skill_id, display_order)
select p.id, s.id, t.display_order
from (values
  ('expedition-portfolio', 'react', 1),
  ('expedition-portfolio', 'javascript', 2),
  ('expedition-portfolio', 'css', 3),
  ('expedition-portfolio', 'postgresql', 4),
  ('expedition-portfolio', 'figma', 5),
  ('sample-completed-project', 'html', 1),
  ('sample-completed-project', 'css', 2),
  ('sample-completed-project', 'javascript', 3),
  ('sample-planned-project', 'react', 1),
  ('sample-planned-project', 'git', 2),
  ('sample-idea', 'figma', 1)
) as t(project_slug, skill_slug, display_order)
join public.projects p on p.slug = t.project_slug
join public.skills s on s.slug = t.skill_slug;

-- ── Journey (verify each entry before launch) ────────────────
insert into public.journey_entries (period_label, title, subtitle, description, icon, display_order) values
  ('2020', 'Senior High School', 'STEM Program', 'Built a strong foundation in problem-solving and technology.', 'graduation', 1),
  ('2021', 'University', 'BSIT Student', 'Started my journey in tech and discovered my passion for building.', 'laptop', 2),
  ('2022', 'Open Source', 'Contributor', 'Contributed to projects and learned the power of collaboration.', 'code', 3),
  ('2023', 'Student Organization', 'Developer & Member', 'Worked with a team to build real solutions and create impact.', 'users', 4),
  ('2024', 'Personal Projects', 'UI/UX Enthusiast', 'Turned ideas into real products and improved my skills day by day.', 'gear', 5),
  ('2025', 'Bigger Things', 'In Progress', 'Continuing to learn, build, and climb toward a greater version of myself.', 'mountain', 6);

-- ── Milestones ───────────────────────────────────────────────
insert into public.milestone_categories (name, slug, description, badge_icon, accent, display_order) values
  ('Certifications', 'certifications', 'Professional certifications & qualifications.', 'certificate', 'navy', 1),
  ('Competitions', 'competitions', 'Hackathons, contests & challenges.', 'flag', 'red', 2),
  ('Awards', 'awards', 'Recognition, honors & scholarships.', 'star', 'gold', 3),
  ('Major Projects', 'major-projects', 'Significant builds and contributions.', 'mountain', 'blue', 4),
  ('Academic Achievements', 'academics', 'Education, research & academic excellence.', 'book', 'green', 5),
  ('Important Accomplishments', 'accomplishments', 'Milestones, leadership & impact.', 'trophy', 'purple', 6);

insert into public.milestones (title, category_id, organization, date, description, display_order)
select 'Expedition Portfolio', c.id, 'Personal project', '2026-09-01',
       'Designing and building this portfolio as a themed, content-managed expedition.', 1
from public.milestone_categories c where c.slug = 'major-projects';

-- ── Social links (hidden placeholders — replace before launch) ──
insert into public.social_links (platform, label, url, display_order, is_visible) values
  ('email', 'Email', 'mailto:hello@example.com', 1, false),
  ('github', 'GitHub', 'https://github.com/', 2, false),
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/', 3, false);
