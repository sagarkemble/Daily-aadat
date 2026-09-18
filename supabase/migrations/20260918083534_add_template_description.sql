-- Optional description on templates; existing rows get empty string.
alter table public.templates
  add column description text not null default '';
