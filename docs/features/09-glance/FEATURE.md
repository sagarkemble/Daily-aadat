# Feature 9 — Glance

**Status:** Locked for v1 (high-level overview only)  
**Product:** Daily Aadat  
**Related:** [End day](../08-end-day/FEATURE.md) · [Day plan](../03-day-plan/FEATURE.md) · [Week/Month calendar](../07-week-month/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Framing

**Glance is the analytical page / light dashboard** of Daily Aadat.

| Scope | Meaning |
|-------|--------|
| **v1 (this doc)** | High-level overview — enough to answer “what did I do this week/month?” |
| **Later (while building / post-v1)** | Go **deeper**: richer playfulness, more breakdowns, stronger visual dashboard. That work is **explicitly deferred**. Do not treat this file as the final analytics design. |

---

## Goal (v1)

Show a simple week/month summary from stored day data: timed hours, count averages, days ended, skips, todos done — clear numbers and short lists, not a heavy BI product.

---

## Where it appears

- **Glance** entry in nav (or from Day / End day)  
- Toggle **Week** | **Month**  
- Optional link from End day summary (“See this week”)  

Separate from Feature 7 calendar navigation (Week/Month there = pick dates; here = stats).

---

## What it shows (v1 — overview only)

Selected period: current week (**Mon–Sun**) or current calendar month, with prev/next period.

- **Days ended** — count in period  
- **Timed totals** — activities ranked by total duration (e.g. Gym 4h 20m)  
- **Count habits** — e.g. Water average vs target across days that included Water  
- **Skips** — total skip count (neutral copy, no shame)  
- **Todos done** — count in period  

**Presentation (v1):** numbers + short lists only. No heavy charts required.

---

## Future (explicitly out of v1 depth)

To be designed when building / iterating:

- Richer playful dashboard UX  
- Deeper breakdowns (trends, heatmaps, month-over-month)  
- Charts and visual polish beyond simple lists  

---

## Rules

- Built from saved day raw data (durations, counts, skips, dones)  
- No streaks, scores, or social comparisons in v1  
- Empty period → friendly empty state (“No days logged yet”)  

---

## Acceptance criteria (v1 overview)

- [ ] Glance Week shows total hours for timed activities that week  
- [ ] Water (or other count) average appears when data exists  
- [ ] Toggle/switch to Month updates the period  
- [ ] Prev/next period works  
- [ ] Empty period shows empty state  

---

## Out of scope (this locked v1 depth)

- Final deep analytics dashboard design  
- Charts / heatmaps / advanced playfulness (later)  
- UI mockup images  
- Replacing Week/Month calendar navigation  
