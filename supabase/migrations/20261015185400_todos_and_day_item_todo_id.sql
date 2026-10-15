-- Pile of todos (identity + done/skip). Day timeline stays on day_items.

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  icon text not null,
  state text not null default 'pending'
    check (state in ('pending', 'done', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(trim(name)) > 0)
);

create index todos_user_id_idx
  on public.todos (user_id);

create index todos_user_id_state_idx
  on public.todos (user_id, state);

create trigger todos_set_updated_at
  before update on public.todos
  for each row
  execute function public.set_updated_at();

alter table public.todos enable row level security;

create policy "Users can select own todos"
on public.todos
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can insert own todos"
on public.todos
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Users can update own todos"
on public.todos
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Users can delete own todos"
on public.todos
for delete
to authenticated
using (user_id = (select auth.uid()));

-- Placement: one day_item sticker per todo. Plan delete drops stickers, not todos.

alter table public.day_items
  add column todo_id uuid references public.todos (id) on delete cascade;

delete from public.day_items
where kind = 'todo'
  and todo_id is null;

create unique index day_items_one_todo_placement_idx
  on public.day_items (todo_id)
  where kind = 'todo';

create index day_items_todo_id_idx
  on public.day_items (todo_id);

alter table public.day_items
  drop constraint if exists day_items_kind_shape_check;

alter table public.day_items
  add constraint day_items_kind_shape_check
  check (
    (
      kind = 'activity'
      and activity_id is not null
      and todo_id is null
      and name_snapshot is not null
      and icon_snapshot is not null
      and type is not null
    )
    or
    (
      kind = 'todo'
      and todo_id is not null
      and activity_id is null
      and name_snapshot is not null
      and icon_snapshot is not null
      and type is null
      and note_snapshot is null
      and state = 'pending'
      and slot in (
        'early_morning',
        'morning',
        'afternoon',
        'evening',
        'night'
      )
    )
  );

drop policy if exists "Users can insert own day items" on public.day_items;
drop policy if exists "Users can update own day items" on public.day_items;

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
  and (
    todo_id is null
    or exists (
      select 1
      from public.todos t
      where t.id = todo_id
        and t.user_id = (select auth.uid())
    )
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
  and (
    todo_id is null
    or exists (
      select 1
      from public.todos t
      where t.id = todo_id
        and t.user_id = (select auth.uid())
    )
  )
);
