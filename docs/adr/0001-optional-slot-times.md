# Optional slot times, copied from template to day

A slot is a named band, not a clock. A template may attach an optional start and end clock to a named slot. Apply copies those rows onto the day; the day then owns its copy. Empty means “morning is morning.” Labels only — they do not lock check, count, or timer. Stored in `template_slot_times` and `day_plan_slot_times`, never as a start/end on `day_plans`.
