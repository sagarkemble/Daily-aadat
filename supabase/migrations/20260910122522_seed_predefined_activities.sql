-- Predefined catalog: user_id null, source = 'predefined'
-- icon = Lucide icon name in kebab-case (frontend maps key → component)

insert into public.activities (
  name,
  icon,
  suggested_type,
  suggested_target,
  suggested_unit,
  note,
  source
)
values
  -- Morning / body / hygiene
  ('Wake up', 'sunrise', 'check', null, null, null, 'predefined'),
  ('Make bed', 'bed-double', 'check', null, null, null, 'predefined'),
  ('Brush teeth', 'brush', 'check', null, null, null, 'predefined'),
  ('Floss', 'sparkles', 'check', null, null, null, 'predefined'),
  ('Bath / shower', 'shower-head', 'check', null, null, null, 'predefined'),
  ('Skincare', 'sparkles', 'check', null, null, null, 'predefined'),
  ('Get dressed', 'shirt', 'check', null, null, null, 'predefined'),
  ('Pack bag', 'briefcase', 'check', null, null, null, 'predefined'),
  ('Take medicine', 'pill', 'check', null, null, null, 'predefined'),
  ('Take vitamins', 'tablets', 'check', null, null, null, 'predefined'),
  ('Puja / prayer', 'flame', 'check', null, null, 'Faith / morning ritual', 'predefined'),

  -- Phone / digital
  ('Check phone', 'smartphone', 'check', null, null, null, 'predefined'),
  ('Charge phone', 'battery-charging', 'check', null, null, null, 'predefined'),
  ('Put phone away', 'phone-off', 'check', null, null, 'Focus block', 'predefined'),
  ('Limit social scroll', 'timer', 'check', null, null, null, 'predefined'),
  ('Inbox zero pass', 'mail', 'timed', null, null, 'Email / messages', 'predefined'),
  ('Shutdown laptop', 'power', 'check', null, null, 'End of work', 'predefined'),

  -- Movement / health
  ('Gym', 'dumbbell', 'timed', null, null, null, 'predefined'),
  ('Home workout', 'house', 'timed', null, null, null, 'predefined'),
  ('Walk', 'footprints', 'timed', null, null, null, 'predefined'),
  ('Run', 'person-standing', 'timed', null, null, null, 'predefined'),
  ('Cycle', 'bike', 'timed', null, null, null, 'predefined'),
  ('Stretch', 'stretch-horizontal', 'timed', null, null, null, 'predefined'),
  ('Yoga', 'leaf', 'timed', null, null, null, 'predefined'),
  ('Sports', 'trophy', 'timed', null, null, null, 'predefined'),
  ('Steps goal', 'footprints', 'count', 8000, 'steps', null, 'predefined'),

  -- Food / drink
  ('Coffee', 'coffee', 'check', null, null, null, 'predefined'),
  ('Tea', 'cup-soda', 'check', null, null, null, 'predefined'),
  ('Pre-workout', 'flask-conical', 'check', null, null, null, 'predefined'),
  ('Breakfast', 'egg', 'check', null, null, null, 'predefined'),
  ('Lunch', 'utensils', 'check', null, null, null, 'predefined'),
  ('Dinner', 'utensils', 'check', null, null, null, 'predefined'),
  ('Snacks', 'cookie', 'check', null, null, null, 'predefined'),
  ('Eat fruit', 'apple', 'check', null, null, 'Banana, apple, etc.', 'predefined'),
  ('Black coffee (evening)', 'coffee', 'check', null, null, null, 'predefined'),
  ('Water', 'droplets', 'count', 10, 'glasses', null, 'predefined'),
  ('Cook meal', 'chef-hat', 'timed', null, null, null, 'predefined'),
  ('Meal prep', 'salad', 'timed', null, null, null, 'predefined'),

  -- Home / chores
  ('PC setup', 'monitor', 'check', null, null, 'Desk ready', 'predefined'),
  ('Clean desk', 'brush-cleaning', 'check', null, null, null, 'predefined'),
  ('Tidy room', 'sofa', 'check', null, null, null, 'predefined'),
  ('Laundry', 'washing-machine', 'check', null, null, null, 'predefined'),
  ('Dishes', 'utensils', 'check', null, null, null, 'predefined'),
  ('Groceries', 'shopping-cart', 'check', null, null, null, 'predefined'),
  ('House chores', 'house', 'timed', null, null, null, 'predefined'),
  ('Take out trash', 'trash', 'check', null, null, null, 'predefined'),
  ('Water plants', 'flower-2', 'check', null, null, null, 'predefined'),
  ('Feed pet', 'paw-print', 'check', null, null, null, 'predefined'),

  -- Work / study
  ('Deep work', 'laptop', 'timed', null, null, 'Focus / coding block', 'predefined'),
  ('Client work', 'handshake', 'timed', null, null, null, 'predefined'),
  ('Study', 'book-open', 'timed', null, null, null, 'predefined'),
  ('College class', 'graduation-cap', 'timed', null, null, null, 'predefined'),
  ('Meeting', 'users', 'timed', null, null, 'In-person / other', 'predefined'),
  ('Zoom meeting', 'video', 'timed', null, null, null, 'predefined'),
  ('Google Meet', 'video', 'timed', null, null, null, 'predefined'),
  ('Standup', 'audio-lines', 'check', null, null, 'Short daily team sync', 'predefined'),
  ('Plan workday', 'calendar-check', 'check', null, null, null, 'predefined'),
  ('Admin / tickets', 'clipboard-list', 'timed', null, null, 'Generic tickets', 'predefined'),
  ('Jira', 'kanban', 'timed', null, null, null, 'predefined'),
  ('Design / planning', 'pencil-ruler', 'timed', null, null, 'Generic design', 'predefined'),
  ('ER diagram', 'git-fork', 'timed', null, null, null, 'predefined'),
  ('Database schema', 'database', 'timed', null, null, null, 'predefined'),
  ('Follow-ups', 'list-checks', 'timed', null, null, 'Follow-up tables / CRM notes', 'predefined'),
  ('Commute', 'car', 'timed', null, null, null, 'predefined'),
  ('Side project', 'rocket', 'timed', null, null, null, 'predefined'),
  ('Learning / course', 'library', 'timed', null, null, null, 'predefined'),
  ('Read', 'book', 'timed', null, null, null, 'predefined'),

  -- Social / rest / evening
  ('Call family', 'phone', 'check', null, null, null, 'predefined'),
  ('Call friend', 'phone-call', 'check', null, null, null, 'predefined'),
  ('Family time', 'heart', 'timed', null, null, null, 'predefined'),
  ('Watch TV', 'tv', 'timed', null, null, null, 'predefined'),
  ('Watch series', 'clapperboard', 'timed', null, null, null, 'predefined'),
  ('Movie / show', 'film', 'timed', null, null, 'Films', 'predefined'),
  ('Listen to podcast', 'headphones', 'timed', null, null, null, 'predefined'),
  ('Break / rest', 'pause', 'timed', null, null, null, 'predefined'),
  ('Wind-down', 'moon', 'check', null, null, null, 'predefined'),
  ('Journal', 'notebook-pen', 'check', null, null, null, 'predefined'),
  ('Diary', 'book-heart', 'check', null, null, null, 'predefined'),
  ('Meditate', 'leaf', 'timed', null, null, null, 'predefined'),
  ('Nap', 'bed-double', 'timed', null, null, null, 'predefined'),
  ('Sleep prep', 'moon-star', 'check', null, null, null, 'predefined');
