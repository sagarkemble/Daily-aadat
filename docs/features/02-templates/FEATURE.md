# Feature 2 — Templates

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [PROJECT.md](../../PROJECT.md) · [Feature 1 — Activities](../01-activities/FEATURE.md)

UI mockups in [`ui/`](ui/) are **concept references**, not final design.

---

## Goal

A **template** is a reusable day shape: activities placed in the five soft slots (Early morning → Night). The user applies a template to any date, then tweaks that day (skip, reorder, add todos) without changing the template.

Examples: **Home**, **College**.

---

## Where it appears

1. **Templates** manage screen — list, create, edit, rename, duplicate, delete  
2. **Apply template** sheet — from an empty day (“Let’s plan this day”) or Change template on a day  
3. **Onboarding** — builds the first template (usually named Home)  

---

## Data shape

| Field | Notes |
|-------|--------|
| `id` | Stable id |
| `name` | e.g. Home, College |
| `items[]` | Ordered template items |

**Template item**

| Field | Notes |
|-------|--------|
| Activity **placement snapshot** | `activityId`, `name`, `icon`, **`type` chosen at add**, `target`/`unit` if count |
| `slot` | `early_morning` \| `morning` \| `afternoon` \| `evening` \| `night` |
| `order` | Position within the slot |

No clock times on templates. Library `suggestedType` only pre-fills the configure step; **type is stored on the template item**.

---

## UI / interactions

### Templates list
- Rows/cards for each template (name + light meta, e.g. activity count)  
- **Create template**  
- Per template: **Edit**, **Rename**, **Duplicate**, **Delete**  
- Deleting the last template allowed with confirm (user can recreate / use empty days)

### Template editor
- Header: template name · Save / Done  
- Same **5 slots** as the Day screen  
- Rows: icon + name + type badge  
- **+ Activity** in a slot → Activities **picker** (multi-select, tap order); user **configures type** (check/timed/count) then add placements into that slot  
- Remove item from template (does **not** delete the activity from the Activities library)  
- Drag-drop reorder within a slot and across slots  

### Apply template (sheet on Day)
- List of templates → tap to apply  
- If the day already has items → **confirm overwrite**  
- Apply copies snapshots onto that **day plan** only  

---

## States

| State | Behaviour |
|-------|-----------|
| No templates | Empty list + Create; empty days stay empty until a template exists or user adds activities manually |
| Empty day | Soft CTA “Let’s plan this day” → Apply template |
| Day already planned | Change template / Apply requires overwrite confirm |
| After edit template | Already-applied days **unchanged**; new applies get the updated shape |

---

## Rules and edge cases

- Many templates supported (Home, College, …)  
- Editing a template does **not** rewrite past ended days or days already filled from an older apply  
- **Skip** on a day does **not** change the template  
- Day plan items remain independent snapshots after apply  
- Duplicate creates a full copy of items under a new name (e.g. Home copy → rename to College)  
- Same activity snapshot may appear in multiple slots on one template  

---

## Acceptance criteria

- [ ] Create Home; add Gym to Early morning **as timed**, Coffee to Morning **as check** via picker + type step  
- [ ] Apply Home to Monday → items appear in the correct slots with icons  
- [ ] Edit Home (add Study to Evening) → Monday unchanged; fresh apply to Tuesday includes Study  
- [ ] Duplicate Home and rename to College works  
- [ ] Apply onto a non-empty day asks overwrite confirm  
- [ ] Remove activity from template does not remove it from Activities library  
- [ ] Delete template with confirm works (including last template with warning)

---

## UI references

| File | Screen |
|------|--------|
| [ui/daily-aadat-templates-list.png](ui/daily-aadat-templates-list.png) | Templates list |
| [ui/daily-aadat-template-editor.png](ui/daily-aadat-template-editor.png) | Template editor (5 slots) |

---

## Out of scope (this feature)

- Final visual design  
- Auto-updating already-planned days when a template changes  
- Clock-based schedules inside templates  
- Sharing templates between users  
