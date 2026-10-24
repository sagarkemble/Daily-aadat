-- Day-wide is a named slot, not null.

update public.day_items
set slot = 'day_wide'
where slot is null;

update public.template_items
set slot = 'day_wide'
where slot is null;

alter table public.day_items
  drop constraint if exists day_items_slot_check;

alter table public.day_items
  alter column slot set not null;

alter table public.day_items
  add constraint day_items_slot_check
  check (
    slot in (
      'day_wide',
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
  alter column slot set not null;

alter table public.template_items
  add constraint template_items_slot_check
  check (
    slot in (
      'day_wide',
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
        'day_wide',
        'early_morning',
        'morning',
        'afternoon',
        'evening',
        'night'
      )
    )
  );

alter table public.template_slot_times
  drop constraint if exists template_slot_times_slot_check;

alter table public.template_slot_times
  add constraint template_slot_times_slot_check
  check (
    slot in (
      'day_wide',
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night'
    )
  );

alter table public.day_plan_slot_times
  drop constraint if exists day_plan_slot_times_slot_check;

alter table public.day_plan_slot_times
  add constraint day_plan_slot_times_slot_check
  check (
    slot in (
      'day_wide',
      'early_morning',
      'morning',
      'afternoon',
      'evening',
      'night'
    )
  );
