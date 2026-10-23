# No day status machine

A date either has a `day_plans` row or it does not. We dropped `empty | planned | in_progress | ended` and `ended_at`. What you did that day is the placements (counts, done, duration). Past days stay editable. Analytics filter by `plan_date`, not by an ended flag.
