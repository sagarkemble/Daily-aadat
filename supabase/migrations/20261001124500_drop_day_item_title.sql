do $$
declare
  cname text;
begin
  select con.conname
  into cname
  from pg_constraint con
  where con.conrelid = 'public.day_items'::regclass
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%kind = ''todo''%';

  if cname is not null then
    execute format('alter table public.day_items drop constraint %I', cname);
  end if;
end $$;

update public.day_items
set name_snapshot = title
where kind = 'todo'
  and title is not null
  and name_snapshot is null;

alter table public.day_items
  drop column title;

alter table public.day_items
  alter column name_snapshot set not null;

alter table public.day_items
  add constraint day_items_kind_shape_check
  check (
    (
      kind = 'activity'
      and activity_id is not null
      and name_snapshot is not null
      and icon_snapshot is not null
      and type is not null
    )
    or
    (
      kind = 'todo'
      and activity_id is null
      and name_snapshot is not null
      and icon_snapshot is null
      and type is null
      and state in ('pending', 'done', 'skipped')
    )
  );
