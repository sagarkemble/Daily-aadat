-- Add icon name on templates; backfill existing rows with a default.
alter table public.templates
  add column icon text not null default 'face-slightly-smiling';
