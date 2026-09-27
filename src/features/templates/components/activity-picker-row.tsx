import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import type { Activity, ActivityType } from "@/features/activity/types/activity"

type ActivityPickerRowProps = {
  order: number
  activity: Activity
  selected: boolean
  onSelectActivity: (activity: Activity) => void
}

const TYPE_LABELS: Record<ActivityType, string> = {
  check: "Check",
  timed: "Timed",
  count: "Count",
}

function formatTarget(activity: Activity) {
  if (activity.suggested_target == null) return null
  return [activity.suggested_target, activity.suggested_unit]
    .filter(Boolean)
    .join(" ")
}

const ActivityPickerRow = ({
  order,
  activity,
  selected,
  onSelectActivity,
}: ActivityPickerRowProps) => {
  const target = formatTarget(activity)
  const description = target ?? activity.note

  return (
    <Item
      variant={selected ? "muted" : "outline"}
      size="sm"
      render={<button type="button" />}
      onClick={() => onSelectActivity(activity)}
      aria-pressed={selected}
    >
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <ActivityIcon name={activity.icon} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name}</ItemTitle>
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      {selected ? <Badge variant="secondary">{order}</Badge> : null}
      <Badge variant="outline">{TYPE_LABELS[activity.suggested_type]}</Badge>
    </Item>
  )
}

export { ActivityPickerRow }
