# Feature 4 — Activity actions

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Activities](../01-activities/FEATURE.md)

UI mockups in [`ui/`](ui/) are **concept references**, not final design.

---

## Goal

Define how day-plan **activity placements** are completed: **check**, **timed** (start/stop), **count** (+1/−1), and **skip**.

**Type comes from the day/template placement** (chosen when the activity was added), not from a fixed library binding. Same catalog “Gym” may be check for one user and timed for another.

---

## Where it appears

- Activity rows on the **Day plan**  
- Not on the Activities catalog tab  
- Todo Done/Skip follows the same Done/Skip pattern but is owned by the Todos feature  

---

## Check

| | |
|--|--|
| States | `pending` → `done` or `skipped` |
| Done | Marks done; undo returns to pending |
| Skip | Marks skipped; undo returns to pending |
| Rule | Done and Skip are mutually exclusive |

---

## Timed

| | |
|--|--|
| States | `pending` → `running` → `done` (with duration); or `skipped` from pending |
| Start | Sets `running`, stores `startedAt`, shows **live elapsed** |
| Stop | Sets `done`, stores `stoppedAt` and `durationMs` |

### One session per item per day (no multi-lap)

For a given timed row on a given day, there is **one** Start→Stop pair only.

**Example:** Monday Gym — Start 6:05, Stop 7:20 → stored **1h 15m**. No second Start on that same Gym row the same day in v1.

### One timer at a time

Only one timed activity may be `running` on that day. Starting another **auto-stops** the current runner and saves its duration, then starts the new one.

### Skip / cancel while timed

- Skip from **pending** is allowed  
- While **running**: must **Stop** (keep duration) or **Cancel run** (discard session → back to pending) before Skip  
- Undo a completed timed item clears duration and returns to pending (with confirm)

---

## Count

| | |
|--|--|
| Display | `countValue / target` (target from **placement**, set when type was chosen as count) |
| +1 | Increments count |
| −1 | Decrements if `countValue > 0` (fix mistakes) |
| Over target | Allowed (e.g. 12/10) — does not auto-lock |
| Skip | Sets skipped; count controls frozen until undo skip |

No interval “drink every 15 min” notifications in v1.

---

## Skip (all activity types)

- Shows **Skipped** on the row  
- Does **not** change the template  
- Undo skip → pending (count keeps its value if any)  
- Skip is the live “not today.” **Delete** is Edit day only (row gone from this date). **Unplan day** clears the whole date.

---

## Ended day lock

After **End day** (see Day plan / End day features):

- No **Start**, **Stop**, **+1**, **−1**, **Done**, or **Skip**  
- Values remain visible (durations, counts, dones)  
- **Re-open to edit** (confirm) unlocks actions again  
- Soft CTAs may still show View summary / Plan tomorrow  

**Example:** User ends Monday with Water at 8/10. Buttons disabled. Next day they re-open Monday, tap +1 to 9/10, then can end again.

---

## Acceptance criteria

- [ ] Check: Done and undo; Skip and undo; not both at once  
- [ ] Timed: Start shows elapsed; Stop saves one duration; no second session same row same day  
- [ ] Starting Deep work while Gym runs auto-stops Gym and saves duration  
- [ ] Count: +1 and −1; can exceed target  
- [ ] Skip does not modify template  
- [ ] Ended day blocks actions until re-open confirm  

---

## UI references

| File | Screen |
|------|--------|
| [ui/daily-aadat-actions-check-count.png](ui/daily-aadat-actions-check-count.png) | Check Done/Skip · Count +1/−1 |
| [ui/daily-aadat-actions-timed.png](ui/daily-aadat-actions-timed.png) | Timed running · one timer |
| [ui/daily-aadat-actions-skip-ended.png](ui/daily-aadat-actions-skip-ended.png) | Skip · Ended day lock |

---

## Out of scope (this feature)

- Multi-lap / multiple sessions per timed item per day  
- Interval reminders for count habits  
- Final visual design  
