-- Todos: pending | done only (skip removed; activities still use skipped on day_items).

update public.todos
set state = 'pending'
where state = 'skipped';

alter table public.todos
  drop constraint if exists todos_state_check;

alter table public.todos
  add constraint todos_state_check
  check (state in ('pending', 'done'));
