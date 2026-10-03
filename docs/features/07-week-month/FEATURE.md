# Feature 7 — Week / Month calendar

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [PROJECT.md](../../PROJECT.md) · [Day plan](../03-day-plan/FEATURE.md)

UI mockups in [`ui/`](ui/) are **concept references**, not final design.

---

## Goal

Secondary **calendar ladder** so the user can jump to any date and plan ahead (including next month / month after). **Home stays the Day plan (Today).** Week and Month are for navigation and date picking — not a full agenda dashboard.

```text
Today (Day home)
    → Week (compact calendar)
        → Month (grid)
            → tap date → that Day plan
```

---

## Where it appears

- From Day header: open **Week**  
- From Week: prev/next week · open **Month**  
- From Month: prev/next month · tap date → Day  
- Always available: jump back to **Today**  

---

## Week

- One week at a time  
- **Week starts Monday**  
- Prev / next week  
- Each day cell: date number + **status dot**  
  - `empty` · `planned` · `in_progress` · `ended` (from day plan status)  
- **Today** visually highlighted  
- Tap a day → open that date’s Day plan  
- Control to open **Month**  

---

## Month

- Month grid (Mon–Sun columns to match week start)  
- Prev / next month (far ahead / back allowed)  
- Status dots on days that have data  
- Tap any date → Day plan (empty days show “Let’s plan this day”)  
- **No** full activity lists inside cells in v1 — month is for **picking a date**  
- Controls: back to Week · Today  

---

## Rules and edge cases

- Not the app home  
- Planning happens on the Day screen after a date is chosen  
- Status dots derive from each day’s `status`  
- **Glance** (week/month stats) is a separate feature — not part of these screens  
- No dragging items between dates on the calendar in v1  

---

## Acceptance criteria

- [ ] From Today open Week; tap Wednesday → Wednesday Day plan  
- [ ] Open Month, go to next month, tap a date → Day plan for that date  
- [ ] Status dots reflect empty / planned / in_progress / ended  
- [ ] Today is highlighted on Week (and Month when visible)  
- [ ] Can return to Today from Week and Month  
- [ ] Empty future day opens Day with plan CTA  

---

## UI references

| File | Screen |
|------|--------|
| [ui/daily-aadat-week-calendar.png](ui/daily-aadat-week-calendar.png) | Week view |
| [ui/daily-aadat-month-calendar.png](ui/daily-aadat-month-calendar.png) | Month view |

---

## Out of scope (this feature)

- Google/Apple calendar sync  
- Agenda text inside calendar cells  
- Drag between dates on the grid  
- Multi-user calendars  
- Glance analytics (Feature 9)  
