# Feature 5 — Todos

**Status:** Locked for v1 (model revised)  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Activity actions](../04-activity-actions/FEATURE.md) · [Templates](../02-templates/FEATURE.md) · [Drag and drop](../06-drag-drop/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

**Todos** are captured as undated one-offs, then **placed** onto a day’s slot. The day row is created on the first activity or todo (template optional). Same pattern as activities: a **pile table** plus a **timeline placement**. **Done** is one field on the todo (list ↔ day): open or complete.

---

## Where it appears

- **Todos list** (`/todos`) — capture, rename, Done, filter Unassigned/Assigned/Done, delete, assignment badge (tap opens that day)
- **Day screen** (any date): **+ Todo** on each slot (beside **+ Activity**); todo placements inside slots (tick + unassign)

Not on templates. Assign from the day only (not from `/todos`). First placement on a date creates `day_plans` with `template_id` null if needed (`ensure_day_plan`).

---

## Data shape

Same seam as activities: identity in one table, slot/order on the day in another.

### `todos` (the pile)

| Field | Notes |
|-------|--------|
| `id` | Stable id — the todo the list talks about |
| `user_id` | Owner; RLS is `user_id = auth.uid()` |
| `name` | Title. Edit name / icon only from the Todos list |
| `icon` | Required. Same **preset icon set** as activities (no photo). Default e.g. `list-todo` on quick add |
| `state` | `pending` \| `done` — one state for list and day. Check-style only (Done), never timed/count |
| `priority` | `high` \| `medium` \| `low` — required; default `medium` |
| `due_date` | Optional calendar **deadline** (`date`, no time). Not the day the todo is placed on |
| timestamps | `created_at`, `updated_at` |

Assignment is a placement on `day_items`, not a column on `todos`. **Due date** and **assigned on** are independent (a todo may be due before the day it is placed on).

### `day_items` (timeline placement only)

`day_plan_id` stays **required**. Activities unchanged. For a todo row:

| Field | Notes |
|-------|--------|
| `kind` | `todo` |
| `todo_id` | FK → `todos(id)` `ON DELETE CASCADE` (delete in the list removes the placement) |
| `day_plan_id` | NOT NULL — this row is on a day |
| `slot` | One of the five slots (not `unslotted`; the pile is the `todos` table) |
| `sort_order` | Order **among activities and todos in that slot** |
| `name_snapshot` / `icon_snapshot` | Copy of `todos.name` / `todos.icon` so the day row looks like an activity row. Update both when the list edits name/icon |
| `state` | Unused for todos (leave `pending`). Live state is `todos.state`. Not `running` |
| `type` | null (not `check`/`timed`/`count`). Actions are Done only like a **check** row. No `activity_id` |

- At most **one** placement per todo (unique on `todo_id`)  
- Assign = insert placement (or **move** by updating `day_plan_id` + `slot`)  
- Unassign = **delete the `day_item`**; the `todos` row stays  
- Unplan = delete the plan → CASCADE placements; **todos remain**  
- Thursday → Friday = move the placement; do not insert a second one  
- Same-day Morning → Evening = **move** the placement (`slot` update), not a second row  
- Day UI: icon + name like an activity; **Done** from `todos.state`; join `todos` for live **state**, **note**, **priority**, and **due_date** (not snapshotted on `day_items`)  

### Final schema (locked — migration not applied until we say so)

**`todos`** (new)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `user_id` | uuid | not null → `users(id)` on delete cascade |
| `name` | text | not null, `length(trim(name)) > 0` |
| `icon` | text | not null (Lucide kebab-case, same as activities; no DB enum) |
| `state` | text | not null default `'pending'`, check `pending \| done` |
| `priority` | text | not null default `'medium'`, check `high \| medium \| low` |
| `due_date` | date | null — deadline only |
| `created_at` | timestamptz | not null default `now()` |
| `updated_at` | timestamptz | not null default `now()`, `set_updated_at` trigger |

- Indexes: `(user_id)`, `(user_id, state)`  
- RLS: select/insert/update/delete where `user_id = auth.uid()`  

**`day_items`** (alter only)

| Change | Detail |
|--------|--------|
| Add `todo_id` | uuid null → `todos(id)` **on delete cascade** |
| Unique | one row per `todo_id` where `kind = 'todo'` |
| Index | `todo_id` |
| Kind check | **Activity:** `todo_id` is null; rest unchanged. **Todo:** `todo_id` not null; `activity_id` null; `name_snapshot` + `icon_snapshot` not null; `type` null; `note_snapshot` null; `slot` in the five slots (not `unslotted`); `state = 'pending'`; not `running` |
| RLS extra | insert/update: if `todo_id` set, that todo’s `user_id` must be `auth.uid()` (and you still own the plan) |

Unchanged: `day_plan_id` not null + on delete cascade; no `user_id` on `day_items`; activity rows; `ended` columns.

---

## UI / interactions

### Todos list

- Table on desktop (columns: done checkbox, Title + note, Priority, Due, Assigned on); two-line rows on phone  
- Groups (sections of one table): **Unassigned** (open, no placement), **Assigned** (open, placed), **Done**. Done collapsed by default; header click only collapses/expands  
- Toolbar: search (name + note), **Status** filter = the three groups (multi-select, all on), **Priority** filter (multi-select, all on). Filters and search live in the URL  
- Leading checkbox = **Done** (no bulk select)  
- **+ Day** on an unassigned row → popover: calendar + slot (default Day-wide) + **Assign**. Uses `ensure_day_plan` (existing template on that date is kept)  
- **Mon · Morning** on an assigned row → same popover pre-filled to **move**, plus **Open day** link  
- Row click → detail popup: priority, due date, note, **Unassign** (if placed), **Delete**. No trash buttons on the row  
- Create via the **Create** dialog (no quick-add row)  
- Delete with confirm → delete `todos` (CASCADE off the day)

### Day — planned slot

- **+ Todo** sits beside **+ Activity** on that slot (any date; first placement ensures the day row). Ended day: no extra todo lock  
- One popup: **create** (name + icon) at the top, then the pile. Simple **name search**. Pick **one** todo at a time (not multi-add like activities)  
- New title (+ icon) → insert `todos` (`pending`) **and** a placement on this plan + slot (snapshots copied)  
- Picker tabs (default **Unassigned**):  
  - **Unassigned** — Open (`pending`) todos with **no** placement. Tap = add here (no confirm)  
  - **Assigned** — Open todos that already have a placement **except this slot**. Row shows **Wed · Afternoon**. Tap = confirm, then **move** here  
- Hide only the todo **already in this slot**. Show other slots on **this** date (Thursday Morning when adding to Thursday Evening) and other dates  
- **Confirm before every move** (other day or other slot on this day), e.g. “Walk the dog is on Wednesday Afternoon. Move it here?” Stay on the day you are planning. Cancel = no change  
- Picker is **Open only**. Done todos do not appear in **+ Todo** (keeps the list small). They stay on the Todos page and on the day if already placed. To place one later: undo Done so it is open, then pick it  
- Row: **same look as an activity** (icon + name), **Done / undo** from `todos.state`. No Start/Stop, no +1, no rename on the day  
- Day never deletes the `todos` row  
- Same-day slot change is **move via + Todo** (confirm), not unassign-then-readd. Cross-slot **drag** for todos is not this feature (see Drag-drop; v1 drag is within a slot only)

---

## Rules and edge cases

- **No recurrence** — one placement, one day at a time. Need it Friday too after Monday? New todo, or move the placement  
- **Not** on templates; apply never creates todos  
- Assign onto any date, from the day (**+ Todo**) or from the Todos table (**+ Day**). First placement creates the day row with no template  
- Done on the list with no placement is allowed. Those rows stay on the Todos page; **+ Todo** will not offer them until they are open again  
- **Done** on `todos`: list ↔ day, same field  
- Move Thursday → Friday (or Morning → Evening): **state sticks**. Picker moves are open-only, so this is pending-in, pending-out unless you tick after placing  
- Unassign / Unplan: placement gone; **done state remains** on the pile row  
- **Unplan day:** CASCADE deletes todo **placements**; pile rows stay. Activities on that date go away with the plan  
- **Overwrite** apply template: replace activities; **keep** todo placements in their slots  
- **Ended day:** no extra todo rules (if you can still + Activity, you can still + Todo)  
- Thursday → Friday assign: **data only** (move placement). Do not navigate to Friday. Badge tap on the Todos list **does** navigate to that day  

---

## Acceptance criteria

- [ ] Add “Meet client” in the Todos list → `todos` row only, shows under Open  
- [ ] Can + Todo on a date with no template (creates day plan on first placement)  
- [ ] + Todo from Afternoon on a planned day: create lands in Afternoon; Unassigned tab attaches an existing Open pile item (one at a time)  
- [ ] Picker: Unassigned / Assigned tabs; Unassigned opens first; name search; create form in the same popup  
- [ ] Assigned tab shows date · slot; hides the todo already in **this** slot; still shows other slots on this date  
- [ ] Pick a todo on Thursday into Friday Afternoon → confirm, then one placement, now Friday; UI stays on Friday  
- [ ] Pick a todo on Thursday Morning into Thursday Evening → confirm, then it sits in Evening only  
- [ ] Done todos do not appear in + Todo; undo Done, then they do  
- [ ] Badge **Thu · Afternoon** on the list; tap opens that day  
- [ ] Tick on the list ticks the day row (when placed) and the reverse  
- [ ] Unassign on the day (not trash) → back in the Open pile, badge gone; `todos` row still there  
- [ ] Delete in the list (confirm) removes the placement as well  
- [ ] Rename in the list updates the day row; day has no rename  
- [ ] Status filter (Unassigned / Assigned / Done), Priority filter, and search; all kept in the URL  
- [ ] + Day assigns an unassigned todo to any date and slot from the table; Mon · Morning moves it  
- [ ] Applying a template does not create todos  
- [ ] Overwrite apply keeps existing todo placements  
- [ ] Unplan removes placements; todos are not deleted  
- [ ] No recurrence controls  

---

## Out of scope (this feature)

- Recurring todos  
- Subtasks, due times  
- Bulk select, quick-add row, inline cell editing, column-header sort, row menu  
- Due-date shortcuts (Today / Tomorrow / Next week), Clear done / archive  
- Todos on templates  
- ~~Assigning onto an unplanned date (no auto-creating `day_plans`)~~ — superseded by `ensure_day_plan` (ADR 0003)  
- Cross-slot **drag** as the way to move a todo (see Drag-drop; v1 path is **+ Todo** picker + confirm)  
- Done todos in the **+ Todo** picker (show them only after they are open again)  
- Ended-day locks specific to todos  
- Undated rows in `day_items`  
- UI mockup images  
