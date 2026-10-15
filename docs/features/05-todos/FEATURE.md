# Feature 5 — Todos

**Status:** Locked for v1 (model revised)  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Activity actions](../04-activity-actions/FEATURE.md) · [Templates](../02-templates/FEATURE.md) · [Drag and drop](../06-drag-drop/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

**Todos** are captured as undated one-offs, then **moved** onto a **planned** day’s slot. One row, two views: a **Todos list** (pile) and the day timeline. Tick either side; same `state`. Not a second catalog, not a template item, not a copy.

---

## Where it appears

- **Todos list** — capture, rename, tick, filter Open/Done, delete, see assignment badge. *(Route / nav placement is parked.)*
- **Day screen** (date already planned): **+ Todo** on a slot; todo rows inside slots (tick + unassign)

Not on templates. Not on an empty/unplanned date.

---

## Data shape

A todo **is** a `day_items` row with `kind = 'todo'`. No separate `todos` table.

| Field | Notes |
|-------|--------|
| `id` | Stable id — same row in the list and on the day |
| `user_id` | Required so undated rows are owned (RLS cannot go through `day_plans`) |
| `day_plan_id` | **Nullable.** Null = in the pile (undated). Set = attached to that plan’s date |
| `kind` | `todo` |
| `name_snapshot` | Title (required). Rename only from the Todos list |
| `slot` | One of the 5 slots when attached; `unslotted` when `day_plan_id` is null |
| `order` | Position within the slot (when attached) |
| `state` | `pending` \| `done` — **no `skipped`**, no `running`, no check/timed/count `type` |

- Date lives on `day_plans.plan_date`, never on the todo row  
- Assigning **moves** this row (`day_plan_id` + `slot`); it does not insert a second item  
- At most **one** day at a time; putting it on Friday **leaves** Thursday  

Schema vs current DB: `day_plan_id` must become nullable; `user_id` added on `day_items`. Unplan must **detach** todos before the plan row is deleted (`ON DELETE CASCADE` would otherwise destroy them).

---

## UI / interactions

### Todos list

- Quick add (title) → new row, `day_plan_id` null, `slot = unslotted`, `state = pending`  
- Empty title blocked  
- Default filter **Open** (`pending`); control to show **Done**  
- Row: title, tick, assignment badge when attached (e.g. Thu · Afternoon)  
- Edit title here only  
- Delete with confirm → row gone everywhere (including off the day)  
- List does **not** pick a date/slot (assign is day-driven)

### Day — planned slot

- **+ Todo** → picker **or** type a new title  
  - New title → insert already attached to this `day_plan_id` + slot  
  - Picker: unassigned todos **and** todos on **other** dates (move here). Include **done** (they land done). Hide todos **already on this date**  
- Row: distinct from activities + title + **Done / undo** + **Unassign** (clears `day_plan_id`, `slot = unslotted`)  
- Day never deletes a todo  
- Same-day slot change: **unassign**, then **+ Todo** into the other slot (cross-slot drag for todos is not this feature; today drag is within a slot only)

---

## Rules and edge cases

- **No recurrence** — one row, one day at a time. Need it Friday too after Monday? New todo, or move it  
- **Not** on templates; apply never creates todos  
- **Assign only if the date is already planned** (a `day_plans` row exists). Empty day stays “apply a template first”  
- Tick on the list with no date is allowed; if later assigned, it **arrives done**  
- One `state`: list tick ↔ day tick  
- **Unplan day:** detach todos (back to the pile); delete that date’s **activities**; plan row can then go  
- **Overwrite** apply template: replace activities; **keep** attached todos in their slots  
- **Ended day:** no extra todo rules (End day constraints dropped for this feature)  
- Thursday → Friday assign: **data only** (move). Do not navigate to Friday  

---

## Acceptance criteria

- [ ] Add “Meet client” in the Todos list → undated, shows under Open  
- [ ] Cannot + Todo on an empty/unplanned day  
- [ ] + Todo from Afternoon on a planned day: create lands in Afternoon; picker can attach an existing pile item  
- [ ] Pick a todo that sits on Thursday into Friday Afternoon → leaves Thursday, sits on Friday; UI stays on Friday  
- [ ] Tick on the list ticks the day row (when attached) and the reverse  
- [ ] Tick in the list while unassigned, then assign → lands `done`  
- [ ] Unassign on the day → back in the Open pile, badge gone  
- [ ] Delete in the list (confirm) removes it from the day as well  
- [ ] Rename in the list updates the day row; day has no rename  
- [ ] Filter Open vs Done on the list  
- [ ] Applying a template does not create todos  
- [ ] Overwrite apply keeps existing attached todos  
- [ ] Unplan detaches todos; they are not deleted  
- [ ] No Skip, no recurrence controls  

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
- UI mockup images  
