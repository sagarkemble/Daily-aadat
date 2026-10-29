# Daily Aadat

A personal day planner for repeating daily structure. No streaks.

## Language

**Activity**:
A reusable catalog item with a name and icon. It is not a row on a Tuesday.
_Avoid_: habit, task

**Day**:
One calendar date for one person. It has placements. It has no empty/planned/ended machine. What you did that date is the placements themselves (how many, which are done, how long). A template is optional: placements can exist with none applied.
_Avoid_: day status, in progress, ended day, unplanned (when you mean no template), planned (when you mean the date has placements)

**Slot**:
One of six named bands: Day-wide, early morning, morning, afternoon, evening, night. Day-wide is listed first. A slot is the band, not the clock.
_Avoid_: unslotted, group, tag, window, five slots

**Slot time**:
Optional start clock and end clock on a time-of-day slot (not Day-wide, not on the day). Empty means the slot is only a name. Set on a template, copied onto the day when applied. After apply, the day's copy can change without changing the template. A label only: it does not lock check, count, or timer.
_Avoid_: window, slot window, schedule, timetable, punch clock, day start

**Day-wide**:
A named slot that belongs to the date, not a time of day. It is still a slot. Shown above the five time-of-day bands. Example: counting water for that date.
_Avoid_: no slot, unslotted, global activity, all-day as if it were not a slot

**Placement**:
One instance of an activity or a placed todo on a day. An activity placement snapshots name, icon, and note (the day's copy can change without changing catalog or template). A todo placement is a sticker: name, note, and state live on the Todo; on the day it shows a fixed list-todo glyph. Edit on the day, the pile updates; edit in the pile, the day shows it.
_Avoid_: activity (when you mean the Tuesday row), day item (in speech; fine in code later)

**Note**:
Longer text than the name. Explains which Zoom, which meeting, which todo. For activities: set on a template placement, copied onto the day placement. For todos: one note on the Todo, same as state — one life, not a per-day copy.
_Avoid_: description (fine in UI copy; template already has its own playlist blurb), comment, journal

**Todo**:
A pile item. Name, note, state, priority, and optional due date live here. It is not part of a template. Placing it on a day makes a sticker in any of the six slots, including Day-wide (always shown with the list-todo icon on the day).
_Avoid_: task, unslotted

**Due date**:
The calendar day a todo should be finished by. A deadline only: it does not place the todo on that day, and the day it is placed on may be later. Overdue is a due date in the past on a todo that is not done.
_Avoid_: deadline time, scheduled date, assigned on (that is the placement's day)

**Priority**:
How much a todo matters: high, medium, or low. Every todo has one; medium unless chosen.
_Avoid_: urgency, importance, none

**Unplan**:
Clearing a date's activities, applied template, and slot times. Todos on that date either stay as stickers or go back to the pile; the person chooses. Pile todos and templates are never deleted.
_Avoid_: reset, delete day, end day

**Merge**:
Applying a template to a date that already has activities, keeping them and adding the template's alongside (duplicates allowed). The alternative is start fresh: drop the date's activities, then apply. Todos stay either way.
_Avoid_: overwrite, replace, sync

**Template**:
A named day shape: placements in the six slots (Day-wide first) and optional slot times on the time-of-day bands. Applying it copies that shape onto a date. A date can hold placements with no template applied.
_Avoid_: routine, schedule, unplanned day (that is a date with no template, not a status)
