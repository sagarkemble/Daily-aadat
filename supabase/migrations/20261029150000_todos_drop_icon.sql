-- Todos no longer store icons; day placements use a fixed list-todo glyph.

update public.day_items
set icon_snapshot = 'list-todo'
where kind = 'todo';

alter table public.todos
  drop column icon;
