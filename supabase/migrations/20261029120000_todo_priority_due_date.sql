alter table public.todos
  add column priority text not null default 'medium',
  add column due_date date;

alter table public.todos
  add constraint todos_priority_check
  check (priority in ('high', 'medium', 'low'));
