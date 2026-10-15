# Feature 5 — Todos

**Status:** Locked for v1 (model revised)  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Activity actions](../04-activity-actions/FEATURE.md) · [Templates](../02-templates/FEATURE.md) · [Drag and drop](../06-drag-drop/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

**Todos** are captured as undated one-offs, then **placed** onto a **planned** day’s slot. Same pattern as activities: a **pile table** plus a **timeline placement**. **Done** and **Skip** are one field on the todo (list ↔ day): left to do, done, or decided not to do.

---

## Where it appears

- **Todos list** — capture, rename, Done/Skip, filter Open/Done/Skipped, delete, see assignment badge. *(Route / nav placement is parked.)*
- **Day screen** (date already planned): **+ Todo** on a slot; todo placements inside slots (tick + unassign)

Not on templates. Not on an empty/unplanned date.

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
| `state` | `pending` \| `done` \| `skipped` — one state for list and day. Check-style only (Done / Skip), never timed/count |
| timestamps | `created_at`, `updated_at` |

No date on this row. Assignment is a placement, not a column here.

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
| `type` | null (not `check`/`timed`/`count`). Actions are still Done/Skip like a **check** row. No `activity_id` |

- At most **one** placement per todo (unique on `todo_id`)  
- Assign = insert placement (or **move** by updating `day_plan_id` + `slot`)  
- Unassign = **delete the `day_item`**; the `todos` row stays  
- Unplan = delete the plan → CASCADE placements; **todos remain**  
- Thursday → Friday = move the placement; do not insert a second one  
- Day UI: icon + name like an activity; Done/Skip like a **check** item; join `todos` for live **state**  
- Done and Skip are mutually exclusive (same as check activities)  

### Schema vs current DB

New `todos` table (`name`, `icon`, `state`) + `todo_id` on `day_items` + unique one-placement-per-todo. Tighten `kind = 'todo'` check: `todo_id` required, `name_snapshot` + `icon_snapshot` required, no `activity_id` / `type`. **Do not** nullable-`day_plan_id` or put `user_id` on `day_items`.

---

## UI / interactions

### Todos list

- Quick add (title + icon, icon may default) → insert `todos` (`pending`). No `day_items`  
- Empty title blocked  
- Default filter **Open** (`pending`); controls to show **Done** and **Skipped**  
- Row: title, **Done / Skip / undo** (`todos.state`), badge when a placement exists (e.g. Thu · Afternoon)  
- Edit name and icon here only  
- Delete with confirm → delete `todos` (CASCADE off the day)  
- List does **not** pick a date/slot (assign is day-driven)

### Day — planned slot

- **+ Todo** → picker **or** type a new title  
  - New title (+ icon) → insert `todos` **and** a placement on this plan + slot (snapshots copied)  
  - Picker: todos with **no** placement **and** todos placed on **other** dates (move here). Include **done** and **skipped** (they land in that state). Hide todos **already on this date**  
- Row: **same look as an activity** (icon + name), check actions only (**Done / Skip / undo**) from `todos.state`, plus **Unassign** (deletes this `day_item`; todo **state stays**). No Start/Stop, no +1.  
- Day never deletes the `todos` row  
- Same-day slot change: **unassign**, then **+ Todo** into the other slot (cross-slot drag for todos is not this feature; today drag is within a slot only)

---

## Rules and edge cases

- **No recurrence** — one placement, one day at a time. Need it Friday too after Monday? New todo, or move the placement  
- **Not** on templates; apply never creates todos  
- **Assign only if the date is already planned.** Empty day stays “apply a template first”  
- Done or Skip on the list with no placement is allowed; if later assigned, it **arrives in that state**  
- **Done / Skip** on `todos`: list ↔ day, same box  
- Skip means **decided not to do** (still tracked), not only “not this calendar day”  
- Move Thursday → Friday: **state sticks** (skipped stays skipped)  
- Unassign / Unplan: placement gone; **skipped/done remain** on the pile row  
- **Unplan day:** CASCADE deletes todo **placements**; pile rows stay. Activities on that date go away with the plan  
- **Overwrite** apply template: replace activities; **keep** todo placements in their slots  
- **Ended day:** no extra todo rules  
- Thursday → Friday assign: **data only** (move placement). Do not navigate to Friday  

---

## Acceptance criteria

- [ ] Add “Meet client” in the Todos list → `todos` row only, shows under Open  
- [ ] Cannot + Todo on an empty/unplanned day  
- [ ] + Todo from Afternoon on a planned day: create lands in Afternoon; picker can attach an existing pile item  
- [ ] Pick a todo that sits on Thursday into Friday Afternoon → one placement, now Friday; UI stays on Friday  
- [ ] Tick on the list ticks the day row (when placed) and the reverse  
- [ ] Tick Done or Skip in the list while unassigned, then assign → lands in that state  
- [ ] Unassign on the day → back in the Open pile, badge gone; `todos` row still there  
- [ ] Delete in the list (confirm) removes the placement as well  
- [ ] Rename in the list updates the day row; day has no rename  
- [ ] Filter Open / Done / Skipped on the list  
- [ ] Applying a template does not create todos  
- [ ] Overwrite apply keeps existing todo placements  
- [ ] Unplan removes placements; todos are not deleted  
- [ ] Skip on the day marks skipped on the list; Skip on the list marks skipped on the day  
- [ ] Cannot Skip while Done and the reverse (undo first)  
- [ ] Move a skipped Thursday todo to Friday → still skipped  
- [ ] Unassign a skipped todo → still skipped in the pile  
- [ ] No recurrence controls  

---

## Out of scope (this feature)

- Recurring todos  
- Notes, subtasks, priorities, due times  
- Todos on templates  
- Assigning onto an unplanned date (no auto-creating `day_plans`)  
- Assign / date-picker from the Todos list  
- Cross-slot drag as the way to move a todo (see Drag-drop; v1 path is unassign + pick)  
- Nav / route for the Todos list (parked)  
- Ended-day locks specific to todos  
- Undated rows in `day_items`  
- UI mockup images  
