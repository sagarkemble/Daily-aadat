alter table public.day_items
  add column note_snapshot text,
  add column note text;

-- optional: copy catalog notes onto days already planned
update public.day_items di
set note_snapshot = a.note
from public.activities a
where di.kind = 'activity'
  and di.activity_id = a.id
  and di.note_snapshot is null
  and a.note is not null;