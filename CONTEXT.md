# Daily Aadat

A personal day planner for repeating daily structure. No streaks.

## Language

**Activity**:
A reusable catalog item with a name, icon, and optional note. It is not a row on a Tuesday.
_Avoid_: habit, task

**Day**:
One calendar date for one person. It has placements. It has no empty/planned/ended machine. What you did that date is the placements themselves (how many, which are done, how long).
_Avoid_: day status, in progress, ended day

**Slot**:
One of five fixed time-of-day bands: early morning, morning, afternoon, evening, night. The names do not change. A slot is the band, not the clock.
_Avoid_: unslotted, group, tag, window

**Slot time**:
Optional start clock and end clock on a named slot (not on the day). Empty means the slot is only a name. Set on a template, copied onto the day when applied. After apply, the day's copy can change without changing the template. A label only: it does not lock check, count, or timer.
_Avoid_: window, slot window, schedule, timetable, punch clock, day start

**Day-wide**:
A placement that belongs to the date and has no slot. Example: counting water for that date.
_Avoid_: global activity, unslotted, all-day slot

**Placement**:
One instance of an activity or a placed todo on a day. An activity placement snapshots name, icon, and note (the day's copy can change without changing catalog or template). A todo placement is a sticker: name, icon, note, and state live on the Todo. Edit on the day, the pile updates; edit in the pile, the day shows it.
_Avoid_: activity (when you mean the Tuesday row), day item (in speech; fine in code later)

**Note**:
Longer text than the name. Explains which Zoom, which meeting, which todo. For activities: default on the Activity, may be set on a template placement, copied onto the day placement. For todos: one note on the Todo, same as state — one life, not a per-day copy.
_Avoid_: description (fine in UI copy; template already has its own playlist blurb), comment, journal

**Todo**:
An undated pile item. Name, icon, note, and state live here. It is not part of a template. Placing it on a day makes a sticker in a slot, not day-wide.
_Avoid_: task, unslotted

**Template**:
A named day shape: placements in the five slots, day-wide placements, and optional slot times.
_Avoid_: routine, schedule
