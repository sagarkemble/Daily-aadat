create table public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index templates_user_id_idx
  on public.templates (user_id);

create trigger templates_set_updated_at
  before update on public.templates
  for each row
  execute function public.set_updated_at();

alter table public.templates enable row level security;

create policy "Users can select own templates"
on public.templates
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can insert own templates"
on public.templates
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Users can update own templates"
on public.templates
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Users can delete own templates"
on public.templates
for delete
to authenticated
using (user_id = (select auth.uid()));