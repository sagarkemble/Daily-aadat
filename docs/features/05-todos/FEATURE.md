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

- **Todos list** (`/todos`) — capture, rename, Done/Skip, filter Open/Done/Skipped, delete, assignment badge (tap opens that day)
- **Day screen** (date already planned): **+ Todo** on each slot (beside **+ Activity**); todo placements inside slots (tick + unassign)

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
- Same-day Morning → Evening = **move** the placement (`slot` update), not a second row  
- Day UI: icon + name like an activity; Done/Skip like a **check** item; join `todos` for live **state**  
- Done and Skip are mutually exclusive (same as check activities)  

### Final schema (locked — migration not applied until we say so)

**`todos`** (new)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `user_id` | uuid | not null → `users(id)` on delete cascade |
| `name` | text | not null, `length(trim(name)) > 0` |
| `icon` | text | not null (Lucide kebab-case, same as activities; no DB enum) |
| `state` | text | not null default `'pending'`, check `pending \| done \| skipped` |
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

- Quick add (title + icon, icon may default) → insert `todos` (`pending`). No `day_items`  
- Empty title blocked  
- Default filter **Open** (`pending`); controls to show **Done** and **Skipped**  
- Row: title, **Done / Skip / undo** (`todos.state`), badge when a placement exists (e.g. **Thu · Afternoon**)  
- Badge is a **link**: tap opens **that calendar day** (no scroll-to-slot). No badge when unassigned  
- Edit name and icon here only. Day is for Done / Skip / Unassign / moving  
- Delete with confirm → delete `todos` (CASCADE off the day)  
- List does **not** pick a date/slot (assign is day-driven)

### Day — planned slot

- **+ Todo** sits beside **+ Activity** on that slot. Empty/unplanned date: no **+ Todo**. Ended day: no extra todo lock  
- One popup: **create** (name + icon) at the top, then the pile. Simple **name search**. Pick **one** todo at a time (not multi-add like activities)  
- New title (+ icon) → insert `todos` (`pending`) **and** a placement on this plan + slot (snapshots copied)  
- Picker tabs (default **Unassigned**):  
  - **Unassigned** — Open (`pending`) todos with **no** placement. Tap = add here (no confirm)  
  - **Assigned** — Open todos that already have a placement **except this slot**. Row shows **Wed · Afternoon**. Tap = confirm, then **move** here  
- Hide only the todo **already in this slot**. Show other slots on **this** date (Thursday Morning when adding to Thursday Evening) and other dates  
- **Confirm before every move** (other day or other slot on this day), e.g. “Walk the dog is on Wednesday Afternoon. Move it here?” Stay on the day you are planning. Cancel = no change  
- Picker is **Open only**. Done / Skipped do not appear in **+ Todo** (keeps the list small). They stay on the Todos page and on the day if already placed. To place one later: Unskip / untick so it is Open, then pick it  
- Row: **same look as an activity** (icon + name), check actions only (**Done / Skip / undo**) from `todos.state`, plus **Unassign** (label, not trash — deletes this `day_item`; todo **state stays**). No Start/Stop, no +1, no rename on the day  
- Day never deletes the `todos` row  
- Same-day slot change is **move via + Todo** (confirm), not unassign-then-readd. Cross-slot **drag** for todos is not this feature (see Drag-drop; v1 drag is within a slot only)

---

## Rules and edge cases

- **No recurrence** — one placement, one day at a time. Need it Friday too after Monday? New todo, or move the placement  
- **Not** on templates; apply never creates todos  
- **Assign only if the date is already planned.** Empty day stays “apply a template first”  
- Done or Skip on the list with no placement is allowed. Those rows stay on the Todos page; **+ Todo** will not offer them until they are Open again  
- **Done / Skip** on `todos`: list ↔ day, same box  
- Skip means **decided not to do** (still tracked), not only “not this calendar day”  
- Move Thursday → Friday (or Morning → Evening): **state sticks**. Picker moves are Open-only, so this is pending-in, pending-out unless you tick after placing  
- Unassign / Unplan: placement gone; **skipped/done remain** on the pile row  
- **Unplan day:** CASCADE deletes todo **placements**; pile rows stay. Activities on that date go away with the plan  
- **Overwrite** apply template: replace activities; **keep** todo placements in their slots  
- **Ended day:** no extra todo rules (if you can still + Activity, you can still + Todo)  
- Thursday → Friday assign: **data only** (move placement). Do not navigate to Friday. Badge tap on the Todos list **does** navigate to that day  

---

## Acceptance criteria

- [ ] Add “Meet client” in the Todos list → `todos` row only, shows under Open  
- [ ] Cannot + Todo on an empty/unplanned day  
- [ ] + Todo from Afternoon on a planned day: create lands in Afternoon; Unassigned tab attaches an existing Open pile item (one at a time)  
- [ ] Picker: Unassigned / Assigned tabs; Unassigned opens first; name search; create form in the same popup  
- [ ] Assigned tab shows date · slot; hides the todo already in **this** slot; still shows other slots on this date  
- [ ] Pick a todo on Thursday into Friday Afternoon → confirm, then one placement, now Friday; UI stays on Friday  
- [ ] Pick a todo on Thursday Morning into Thursday Evening → confirm, then it sits in Evening only  
- [ ] Done / Skipped todos do not appear in + Todo; Unskip / untick, then they do  
- [ ] Badge **Thu · Afternoon** on the list; tap opens that day  
- [ ] Tick on the list ticks the day row (when placed) and the reverse  
- [ ] Unassign on the day (not trash) → back in the Open pile, badge gone; `todos` row still there  
- [ ] Delete in the list (confirm) removes the placement as well  
- [ ] Rename in the list updates the day row; day has no rename  
- [ ] Filter Open / Done / Skipped on the list  
- [ ] Applying a template does not create todos  
- [ ] Overwrite apply keeps existing todo placements  
- [ ] Unplan removes placements; todos are not deleted  
- [ ] Skip on the day marks skipped on the list; Skip on the list marks skipped on the day  
- [ ] Cannot Skip while Done and the reverse (undo first)  
- [ ] Unassign a skipped todo → still skipped in the pile  
- [ ] No recurrence controls  

---

## Out of scope (this feature)

- Recurring todos  
- Notes, subtasks, priorities, due times  
- Todos on templates  
- Assigning onto an unplanned date (no auto-creating `day_plans`)  
- Assign / date-picker from the Todos list (badge **opens** a day; it does not assign)  
- Cross-slot **drag** as the way to move a todo (see Drag-drop; v1 path is **+ Todo** picker + confirm)  
- Done / Skipped in the **+ Todo** picker (show them only after they are Open again)  
- Ended-day locks specific to todos  
- Undated rows in `day_items`  
- UI mockup images  
