create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  name text not null,
  icon text not null,
  suggested_type text not null check (suggested_type in ('check', 'timed', 'count')),
  suggested_target int,
  suggested_unit text,
  note text,
  source text not null check (source in ('predefined', 'custom')),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (source = 'predefined' and user_id is null)
    or (source = 'custom' and user_id is not null)
  )
);

create index activities_user_id_idx
  on public.activities (user_id);

create unique index activities_custom_name_unarchived_idx
  on public.activities (user_id, lower(name))
  where archived_at is null and user_id is not null;

create unique index activities_predefined_name_unarchived_idx
  on public.activities (lower(name))
  where archived_at is null and user_id is null;

create trigger activities_set_updated_at
  before update on public.activities
  for each row
  execute function public.set_updated_at();

alter table public.activities enable row level security;

create policy "Authenticated can select predefined or own activities"
on public.activities
for select
to authenticated
using (
  user_id is null
  or user_id = (select auth.uid())
);

create policy "Users can insert own custom activities"
on public.activities
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and source = 'custom'
);

create policy "Users can update own custom activities"
on public.activities
for update
to authenticated
using (
  user_id = (select auth.uid())
  and source = 'custom'
)
with check (
  user_id = (select auth.uid())
  and source = 'custom'
);