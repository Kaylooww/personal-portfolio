-- Preserve existing month/year labels; new entries can choose their precision.
alter table public.milestones
  add column date_display text not null default 'month'
    check (date_display in ('day', 'month', 'year')),
  add column pdf_url text
    check (pdf_url is null or pdf_url ~ '^https?://');

notify pgrst, 'reload schema';
