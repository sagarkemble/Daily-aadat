# A day can exist without a template

A `day_plans` row with `template_id` null is a normal day: activities and todos can be placed on it directly. The row is created on the first placement (activity, todo, or template apply), through one database function, `ensure_day_plan(date)`. Opening a date never writes. Before this, only applying a template created the row, so todos could not land on a date with no template.

## Considered Options

- **Key placements by `plan_date` with no `day_plans` parent.** Rejected: the date still needs a home for the applied template and slot times, so the same row would come back under another name, plus a migration of every placement and RLS policy.
- **Create the row when a date is opened.** Rejected: browsing the date menu would leave rows for every date viewed.

## Consequences

- Unplan with **send todos to pile** (or no todos on the date) deletes the row; placements cascade away. Unplan with **keep todos** deletes activity placements and slot times, sets `template_id` null, and keeps the row so the stickers keep their parent.
- Removing placements one at a time never deletes the row. A row with zero placements is an empty day; the UI decides "empty" from placements, not row presence.
- Applying a template to a date that already has activities asks merge or start fresh. Merge keeps duplicates and the template's slot times replace the date's. Todos are never touched by apply.
