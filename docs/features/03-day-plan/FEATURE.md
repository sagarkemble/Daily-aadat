# Feature 3 — Day plan

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [PROJECT.md](../../PROJECT.md) · [Activities](../01-activities/FEATURE.md) · [Templates](../02-templates/FEATURE.md)

UI mockups in [`ui/`](ui/) are **concept references**, not final design.

---

## Goal

The **Day plan** is the app home. One screen for a chosen calendar date: plan and live in the same place. Default date = **today**. User applies a template, skips/reorders, adds activities and todos, and completes items via check / start–stop / count.

---

## Where it appears

1. **Today** — default route after splash / onboarding (home)  
2. **Any date** — opened from Week or Month (same UI, different `date`)  
3. Soft entry from empty-day CTA and from End day → “Plan tomorrow?”  

---

## Data shape

### Day plan

| Field | Notes |
|-------|--------|
| `date` | Calendar day |
| `templateId` / `templateName` | Optional; set when a template was applied |
| `status` | `empty` \| `planned` \| `in_progress` \| `ended` |
| `items[]` | Activities and todos on this day |

### Day item

| Field | Notes |
|-------|--------|
| `kind` | `activity` \| `todo` |
| Snapshot (activity) | `activityId`, `name`, `icon`, **`type` (per placement)**, count `target`/`unit` if count |
| `title` (todo) | Free text |
| `slot` | One of the 5 slots, or `unslotted` for todos not placed |
| `order` | Position within slot / todos list |
| `state` | `pending` \| `done` \| `skipped` \| `running` (timed only) |
| Timed | `startedAt`, `stoppedAt`, `durationMs` — **v1: one session per item per day** |
| Count | `countValue` toward `target` |

---

## UI / interactions

### Header
- Brand / date label (Today vs e.g. Tuesday 10 Sep)  
- Template name or “No template” · change / apply  
- **Edit day** · **Unplan day** (when the date has items and is not ended)  
- Link to **Week**  
- **End day** (when not already ended)  
- If viewing another date: clear control to jump back to **Today**  

### Body — five slots
Early morning · Morning · Afternoon · Evening · Night  

| Item type | Actions |
|-----------|---------|
| Check activity | Done · Skip |
| Timed activity | Start · Stop (+ live elapsed) |
| Count activity | +1 · show progress (e.g. 6/10) |
| Todo in slot | Done · Skip |

- **+ Activity** in a slot → Activities picker (multi-select, tap order) → **choose tracking type** for each → placements added to that slot  
- **+ Todo** → create one-off; place in slot or leave under **Todos**  
- **Todos** section for unslotted one-offs  
- Drag-drop reorder within/across slots happens in **Edit day** (see below and Feature 6)  

### Edit day
Same screen, not a separate route. Live Done / Start / +1 stay on the default view.

- **Edit day** (when status is `planned` or `in_progress`) → editor like the template editor: drag to rearrange, trash to **delete** a row, `+ Activity` still works  
- Delete removes that snapshot from **this date only** — not Skip, and not the template / catalog  
- **Done** exits edit mode and returns to live actions  
- Ended day: re-open first; Edit day is locked until then  

### Unplan day
Wipe this date back to an empty canvas so a different template can be applied (College → clear → Home).

- **Unplan day** (when the day has items and is not ended) → confirm  
- Deletes **all** day items on that date (activities and todos)  
- Sets status `empty`, clears `template_id`  
- Does **not** change any template  
- Distinct from **apply overwrite** (replace activities in one step) and from **End day** (lock and keep history)  

### Empty day
- Soft card: **Let’s plan this day** → **Apply template** sheet  

### Apply template sheet
- List templates (Home, College, …)  
- Tap to apply  
- If day already has items → **overwrite confirm**   

### Ended day
- List shows final states (done / skipped / durations / counts)  
- No Start / +1 until re-opened  
- Soft actions: **View summary** (End day feature) · **Plan tomorrow?**  
- **Re-open to edit** allowed with confirm  

---

## States

| Status | Meaning |
|--------|---------|
| `empty` | No items; show plan CTA |
| `planned` | Has items; none started/completed yet |
| `in_progress` | At least one done, skipped, running, or count &gt; 0 |
| `ended` | User ended the day (or all settled + end flow) |

---

## Rules and edge cases

- Plan **anytime** — not night-only  
- Skip on a day does **not** change the template (row stays, marked skipped)  
- Delete in Edit day removes the row from this date only  
- Unplan day clears the date; templates are unchanged  
- Same activity OK in different slots; once per slot  
- Viewing another date uses the same Day UI  
- Ended days are viewable; editing requires **re-open confirm**  
- Detailed End day summary / Glance owned by later features; Day only exposes entry points  

---

## Acceptance criteria

- [ ] Open app → land on Today with 5 slots  
- [ ] Empty day shows “Let’s plan this day” → apply Home → items in correct slots with icons  
- [ ] Check Done, timed Start/Stop with elapsed, count +1 work on the day  
- [ ] Skip marks item skipped; template unchanged  
- [ ] Edit day: reorder within a slot and delete a row; template unchanged  
- [ ] Unplan day (confirm) clears all items → empty CTA; can apply a different template  
- [ ] Open another date from Week → same Day UI; can return to Today  
- [ ] End day moves status to ended; re-open requires confirm  
- [ ] Overwrite confirm when applying template onto a non-empty day  

---

## UI references

| File | Screen |
|------|--------|
| [ui/daily-aadat-day-empty.png](ui/daily-aadat-day-empty.png) | Empty day + plan CTA |
| [ui/daily-aadat-day-apply-template.png](ui/daily-aadat-day-apply-template.png) | Apply template sheet |
| [ui/daily-aadat-day-live.png](ui/daily-aadat-day-live.png) | Live / mixed states |
| [ui/daily-aadat-day-ended.png](ui/daily-aadat-day-ended.png) | Ended day |

---

## Out of scope (this feature)

- Final visual design  
- Full End day summary copy/layout (Feature: End day)  
- Week/Month calendar chrome (Feature: Calendar ladder)  
- Deep drag-drop edge-case spec (Feature: Drag-drop)  
- Multi-session timed tracking per activity per day  
