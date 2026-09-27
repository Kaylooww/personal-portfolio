-- ─────────────────────────────────────────────────────────────
-- Expedition Portfolio — media storage
--
-- One public bucket. Folders: profile/, projects/<id>/, skills/, milestones/,
-- resume/. Anyone can read; only the admin can upload, replace or delete.
-- The bucket id must match SUPABASE_STORAGE_BUCKET (default portfolio-media).
-- SVG is intentionally not allowed (it can carry script); use PNG/WebP/AVIF.
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read portfolio media" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

create policy "Admin can upload portfolio media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select private.is_admin()));

create policy "Admin can update portfolio media" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and (select private.is_admin()))
  with check (bucket_id = 'portfolio-media' and (select private.is_admin()));

create policy "Admin can delete portfolio media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select private.is_admin()));
