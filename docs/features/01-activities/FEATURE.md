# Feature 1 — Activities

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [PROJECT.md](../../PROJECT.md)

UI mockups in `[ui/](ui/)` are **concept references**, not final design.

---

## Goal

Activities are reusable **names + icons** in a shared catalog. Users browse them on an **Activities** tab, create custom ones, and pick them when adding to a **day** or **template**.

**Tracking type is NOT locked to the library.** Check / timed / count is chosen **when adding** the activity to a day or template (so you can tick Gym; your friend can Start/Stop the same Gym).

---

## Where it appears

1. **Activities tab** — top-level nav (with Today / Week); browse all activities
2. **Picker sheet** — from Day `+ Activity` or Template `+ Activity`; adds into the **slot where + was tapped**
3. **Onboarding** — same catalog when building the first template

---

## Data shape

### Library activity (catalog)

| Field                      | Required           | Notes                                                  |
| -------------------------- | ------------------ | ------------------------------------------------------ |
| `id`                       | Yes                | Stable id                                              |
| `name`                     | Yes                | Display name                                           |
| `icon`                     | Yes                | Key from a **preset icon set** (no photo upload in v1) |
| `suggestedType`            | Yes                | Default suggestion only: `check`                       |
| `suggestedTarget` / `unit` | If suggested count | e.g. Water → 10 glasses                                |
| `source`                   | Yes                | `predefined`                                           |
| `note`                     | Optional           | One short line for detail popup                        |

### Placement (day item / template item) — where type lives

| Field             | Notes                                          |
| ----------------- | ---------------------------------------------- |
| Snapshot          | `activityId`, `name`, `icon`                   |
| `type`            | Chosen at add time: `check`                    |
| `target` / `unit` | If type is count (user-set or from suggestion) |

**Not in v1:** photo uploads, per-activity colors, long descriptions, activity-level reminders.

---

## UI / interactions

### Activities tab

- Search by name
- Grouped lists: **Predefined** · **Your activities**
- Row: **icon + name** (+ optional faint “usually timed” from suggestedType)
- Tap row → **detail popup**
- **+ Create activity** → name, icon, **suggested** type (for convenience only); if suggested count → suggested target + unit

### Detail popup

- Icon, name, suggested type, optional note
- Custom: Edit name / icon / note / suggested type · Delete
- Predefined: view only (suggested type fixed as a hint)

### Picker sheet (Day / Template) — type chosen here

1. Search (stays pinned at the top) / **multi-select** activities (icon + name). Tap order is the add order (1, 2, 3…). Tap again to deselect (numbers compact). Rearrange later on the day/template.  
2. If the name is not in the catalog → **Create custom** from the picker (name + icon + suggested type), then it joins the current selection.  
3. **Configure tracking** for each selected item (in that same order): Check / Timed / Count — **pre-filled with** `suggestedType`**, user can change**  
4. If Count → set target (+ unit)  
5. Add **placement snapshots** into the slot where `+` was pressed, in tap order; sheet closes  

Create custom from picker: name + icon, then same configure-tracking step for **this** placement (and save library entry with that as suggestedType).

---

## States

| State                 | Behaviour                                                                       |
| --------------------- | ------------------------------------------------------------------------------- |
| No custom activities  | Only Predefined section                                                         |
| Empty search          | Offer “Create custom with this name?”                                           |
| After add from picker | Sheet closes; item visible in target slot with icon **and chosen type actions** |
| Delete custom         | Removed from library; **past day/template placements keep their snapshot**      |

---

## Rules and edge cases

- Add lands in the **slot where + was pressed**
- Same library activity may appear in **different slots**; **once per slot** (same activity id)
- **Type is per placement**, not per library row — you and a friend can both use Gym with different types
- On a **pending** day/template item, user may **change type** (e.g. check ↔ timed) before completing; if timed already has a session or count > 0, changing type needs confirm / reset
- Duplicate custom names blocked (case-insensitive)
- Predefined not deletable

---

## Predefined catalog (v1)

Full seed list (draft): [PREDEFINED-ACTIVITIES.md](../../docs/data/PREDEFINED-ACTIVITIES.md).

Standardize on **shared daily names**, not brands or one-off tasks. Zoom / Jira / “banana” stay **custom**. Suggested type is a hint only: **C** = check, **T** = timed, **N** = count.

### Morning / body / hygiene

| Name          | Suggested | Notes        |
| ------------- | --------- | ------------ |
| Wake up       | C         | Start of day |
| Make bed      | C         |              |
| Brush teeth   | C         |              |
| Bath / shower | C         |              |
| Skincare      | C         |              |
| Get dressed   | C         |              |
| Pack bag      | C         |              |
| Take medicine | C         |              |
| Take vitamins | C         |              |

### Phone / digital

| Name                | Suggested | Notes               |
| ------------------- | --------- | ------------------- |
| Check phone         | C         | Intentionally light |
| Charge phone        | C         |                     |
| Put phone away      | C         | Focus block         |
| Limit social scroll | C         | Soft boundary       |
| Inbox zero pass     | T         | Short email pass    |

### Movement / health

| Name       | Suggested | Notes                          |
| ---------- | --------- | ------------------------------ |
| Gym        | T         |                                |
| Walk       | T         |                                |
| Run        | T         |                                |
| Stretch    | T         |                                |
| Yoga       | T         |                                |
| Sports     | T         |                                |
| Steps goal | N         | defaultTarget 8000, unit steps |

### Food / drink

| Name                   | Suggested | Notes                          |
| ---------------------- | --------- | ------------------------------ |
| Coffee                 | C         |                                |
| Tea                    | C         |                                |
| Pre-workout            | C         |                                |
| Breakfast              | C         |                                |
| Lunch                  | C         |                                |
| Dinner                 | C         |                                |
| Snacks                 | C         |                                |
| Black coffee (evening) | C         |                                |
| Water                  | N         | defaultTarget 10, unit glasses |
| Cook meal              | T         |                                |

### Home / chores

| Name         | Suggested | Notes      |
| ------------ | --------- | ---------- |
| PC setup     | C         | Desk ready |
| Clean desk   | C         |            |
| Tidy room    | C         |            |
| Laundry      | C         |            |
| Dishes       | C         |            |
| Groceries    | C         |            |
| House chores | T         |            |

### Work / study

| Name              | Suggested | Notes                |
| ----------------- | --------- | -------------------- |
| Deep work         | T         |                      |
| Client work       | T         |                      |
| Study             | T         |                      |
| College class     | T         |                      |
| Meeting           | T         |                      |
| Commute           | T         |                      |
| Side project      | T         |                      |
| Learning / course | T         |                      |
| Read              | T         | Pages optional later |

### Social / rest / evening

| Name         | Suggested | Notes            |
| ------------ | --------- | ---------------- |
| Call family  | C         |                  |
| Call friend  | C         |                  |
| Movie / show | T         |                  |
| Wind-down    | C         |                  |
| Journal      | C         |                  |
| Meditate     | T         |                  |
| Nap          | T         |                  |
| Sleep prep   | C         | No screens, etc. |

Users can still **create custom** anything missing (e.g. “Bring phone charger”, “Feed pet”).

---

## Acceptance criteria

- [ ] Activities tab lists Predefined + Your activities with icons
- [ ] Search filters the list
- [ ] Tap opens detail popup with icon, name, suggested type, note
- [ ] Create custom with icon + suggested type works
- [ ] Predefined cannot be deleted; custom can
- [ ] From Day, `+` under Afternoon → pick Gym → **choose Check or Timed** → Gym appears with matching actions  
- [ ] Multi-select Coffee then Fruit then Bath → they land in that tap order; can rearrange after
- [ ] From picker, create a missing custom name; it can be selected and added to the slot
- [ ] Same library Gym can be check on one user’s template and timed on another’s
- [ ] Water as count asks for target; progress shows on day row
- [ ] Deleting a custom activity does not wipe past day placements

---

## UI references

| File                                                                                 | Screen          |
| ------------------------------------------------------------------------------------ | --------------- |
| [ui/daily-aadat-activities-tab.png](ui/daily-aadat-activities-tab.png)               | Activities tab  |
| [ui/daily-aadat-activity-detail-popup.png](ui/daily-aadat-activity-detail-popup.png) | Detail popup    |
| [ui/daily-aadat-create-activity.png](ui/daily-aadat-create-activity.png)             | Create activity |
| [ui/daily-aadat-activity-picker-day.png](ui/daily-aadat-activity-picker-day.png)     | Picker from Day |

---

## Out of scope (this feature)

- Final visual design / brand polish
- Photo uploads
- Activity-level push reminders
- Live-binding library edits into past days
