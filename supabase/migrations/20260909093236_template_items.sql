create table public.template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete restrict,
  type text not null check (type in ('check', 'timed', 'count')),
  target int,
  unit text,
  slot text not null check (
    slot in ('early_morning', 'morning', 'afternoon', 'evening', 'night')
  ),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, slot, activity_id)
);

create index template_items_template_id_idx
  on public.template_items (template_id);

create index template_items_activity_id_idx
  on public.template_items (activity_id);

create trigger template_items_set_updated_at
  before update on public.template_items
  for each row
  execute function public.set_updated_at();

alter table public.template_items enable row level security;

create policy "Users can select own template items"
on public.template_items
for select
to authenticated
using (
  exists (
    select 1
    from public.templates t
    where t.id = template_id
      and t.user_id = (select auth.uid())
  )
);

create policy "Users can insert own template items"
on public.template_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.templates t
    where t.id = template_id
      and t.user_id = (select auth.uid())
  )
);

create policy "Users can update own template items"
on public.template_items
for update
to authenticated
using (
  exists (
    select 1
    from public.templates t
    where t.id = template_id
      and t.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.templates t
    where t.id = template_id
      and t.user_id = (select auth.uid())
  )
);

create policy "Users can delete own template items"
on public.template_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.templates t
    where t.id = template_id
      and t.user_id = (select auth.uid())
  )
);