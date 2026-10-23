-- Notes, day-wide (slot null), optional slot times, drop day status.

-- Catalog / playlist / pile notes
alter table public.activities
  add column note text;

alter table public.template_items
  add column note text;

alter table public.todos
  add column note text;

-- Day-wide: slot null. Drop leftover unslotted.
update public.day_items
set slot = null
where kind = 'activity'
  and slot = 'unslotted';

update public.day_items
set slot = 'morning'
where kind = 'todo'
  and slot = 'unslotted';

alter table public.day_items
  drop constraint if exists day_items_slot_check;

alter table public.day_items
  alter column slot drop not null;

alter table public.day_items
  add constraint day_items_slot_check
  check (
    slot is null
    or slot in (
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night'
    )
  );

alter table public.template_items
  drop constraint if exists template_items_slot_check;

alter table public.template_items
  alter column slot drop not null;

alter table public.template_items
  add constraint template_items_slot_check
  check (
    slot is null
    or slot in (
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night'
    )
  );

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

-- No empty / planned / ended machine
alter table public.day_plans
  drop constraint if exists day_plans_status_check;

alter table public.day_plans
  drop column if exists status;

alter table public.day_plans
  drop column if exists ended_at;

-- Slot times: labels on a named slot, copied at apply
create table public.template_slot_times (
  template_id uuid not null references public.templates (id) on delete cascade,
  slot text not null check (
    slot in (
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night'
    )
  ),
  start_time time,
  end_time time,
  primary key (template_id, slot),
  check ((start_time is null) = (end_time is null))
);

create table public.day_plan_slot_times (
  day_plan_id uuid not null references public.day_plans (id) on delete cascade,
  slot text not null check (
    slot in (
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night'
    )
  ),
  start_time time,
  end_time time,
  primary key (day_plan_id, slot),
  check ((start_time is null) = (end_time is null))
);

alter table public.template_slot_times enable row level security;
alter table public.day_plan_slot_times enable row level security;

create policy "Users can select own template slot times"
on public.template_slot_times
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

create policy "Users can insert own template slot times"
on public.template_slot_times
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

create policy "Users can update own template slot times"
on public.template_slot_times
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

create policy "Users can delete own template slot times"
on public.template_slot_times
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

create policy "Users can select own day plan slot times"
on public.day_plan_slot_times
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

create policy "Users can insert own day plan slot times"
on public.day_plan_slot_times
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

create policy "Users can update own day plan slot times"
on public.day_plan_slot_times
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

create policy "Users can delete own day plan slot times"
on public.day_plan_slot_times
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
