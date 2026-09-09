create table public.day_items (
  id uuid primary key default gen_random_uuid(),
  day_plan_id uuid not null references public.day_plans (id) on delete cascade,
  kind text not null check (kind in ('activity', 'todo')),
  activity_id uuid references public.activities (id) on delete restrict,
  title text,
  name_snapshot text,
  icon_snapshot text,
  type text check (type in ('check', 'timed', 'count')),
  target int,
  unit text,
  slot text not null check (
    slot in (
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night',
      'unslotted'
    )
  ),
  sort_order int not null default 0,
  state text not null default 'pending'
    check (state in ('pending', 'done', 'skipped', 'running')),
  started_at timestamptz,
  stopped_at timestamptz,
  duration_ms bigint,
  count_value int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (
      kind = 'activity'
      and activity_id is not null
      and name_snapshot is not null
      and icon_snapshot is not null
      and type is not null
      and title is null
    )
    or
    (
      kind = 'todo'
      and title is not null
      and activity_id is null
      and name_snapshot is null
      and icon_snapshot is null
      and type is null
      and state in ('pending', 'done', 'skipped')
    )
  ),
  check (state <> 'running' or type = 'timed')
);

create unique index day_items_one_activity_per_slot_idx
  on public.day_items (day_plan_id, slot, activity_id)
  where kind = 'activity';

create index day_items_day_plan_id_idx
  on public.day_items (day_plan_id);

create index day_items_activity_id_idx
  on public.day_items (activity_id);

create trigger day_items_set_updated_at
  before update on public.day_items
  for each row
  execute function public.set_updated_at();

alter table public.day_items enable row level security;

create policy "Users can select own day items"
on public.day_items
for select
to authenticated
using (
  exists (
    select 1
    from public.day_plans p
    where p.id = day_plan_id
      and p.user_id = (select auth.uid())
  )
);

create policy "Users can insert own day items"
on public.day_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.day_plans p
    where p.id = day_plan_id
      and p.user_id = (select auth.uid())
  )
);

create policy "Users can update own day items"
on public.day_items
for update
to authenticated
using (
  exists (
    select 1
    from public.day_plans p
    where p.id = day_plan_id
      and p.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.day_plans p
    where p.id = day_plan_id
      and p.user_id = (select auth.uid())
  )
);

create policy "Users can delete own day items"
on public.day_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.day_plans p
    where p.id = day_plan_id
      and p.user_id = (select auth.uid())
  )
);