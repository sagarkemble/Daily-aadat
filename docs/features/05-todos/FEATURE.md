# Feature 5 — Todos

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Activity actions](../04-activity-actions/FEATURE.md) · [Templates](../02-templates/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

**Todos** are one-off items for a **specific date** — exceptions and unplanned work (e.g. “Meet client in Kolhapur”). They sit beside template activities so the whole day can read as one timeline when dropped into a slot.

---

## Where it appears

- Day screen: **+ Todo**, **Todos** catch-all section, todo rows inside slots  
- Always attached to the **date currently open** (including far-ahead dates from Week/Month)  

---

## Data shape

| Field | Notes |
|-------|--------|
| `id` | Stable id |
| `date` | Calendar day |
| `title` | Required text |
| `slot` | One of the 5 slots, or `unslotted` |
| `order` | Position within slot / Todos list |
| `state` | `pending` \| `done` \| `skipped` |

- No check / timed / count types — todos are **Done / Skip only**  
- No optional note / description in v1 (title only)  

---

## UI / interactions

- **+ Todo** → quick add (title); defaults to **unslotted**, unless opened from inside a slot (then that slot)  
- Row: visually distinct from activities (e.g. “Todo” badge or different row style) + title + **Done** / **Skip**  
- Edit title; Delete with confirm  
- Drag into a slot or back to Todos (see Drag-drop feature; behaviour required on Day)  

---

## Rules and edge cases

- **No recurrence in v1** — a todo exists on one date only; it does not auto-repeat. Need it again Friday? Add a new todo on Friday.  
- Todos are **not** part of templates; applying a template does not create todos  
- Done / Skip / undo same mutual-exclusion rules as check activities  
- Ended day: locked until re-open (same as activity actions)  
- Empty title blocked  
- When applying a template with **overwrite** on a non-empty day: replace template-driven **activities**; **keep existing todos by default**  
- **Unplan day** is the explicit wipe: it clears activities **and** todos on that date  

---

## Acceptance criteria

- [ ] Add “Meet client” on Monday → appears under Todos (unslotted)  
- [ ] + Todo from Afternoon → lands in Afternoon  
- [ ] Done / Skip / undo work  
- [ ] Edit title and delete with confirm work  
- [ ] Applying a template does not create todos  
- [ ] Overwrite apply keeps existing todos by default  
- [ ] No repeat/recurrence controls on todos  

---

## Out of scope (this feature)

- Recurring todos  
- Notes, subtasks, priorities, due times  
- Global todo inbox not tied to a date  
- UI mockup images  
