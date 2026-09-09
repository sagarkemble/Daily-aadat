create table public.day_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  plan_date date not null,
  status text not null default 'empty'
    check (status in ('empty', 'planned', 'in_progress', 'ended')),
  template_id uuid references public.templates (id) on delete set null,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_date)
);

create index day_plans_user_id_idx
  on public.day_plans (user_id);

create index day_plans_template_id_idx
  on public.day_plans (template_id);

create trigger day_plans_set_updated_at
  before update on public.day_plans
  for each row
  execute function public.set_updated_at();

alter table public.day_plans enable row level security;

create policy "Users can select own day plans"
on public.day_plans
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can insert own day plans"
on public.day_plans
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Users can update own day plans"
on public.day_plans
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Users can delete own day plans"
on public.day_plans
for delete
to authenticated
using (user_id = (select auth.uid()));