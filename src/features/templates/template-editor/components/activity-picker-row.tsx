import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { DynamicIcon } from "@/components/dynamic-icon"
import {
  activityTypeLabels,
  type Activity,
} from "@/features/activity/types/activity"

type ActivityPickerRowProps = {
  order: number
  activity: Activity
  selected: boolean
  onSelectActivity: (activity: Activity) => void
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
  const description = formatTarget(activity)

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
          <DynamicIcon name={activity.icon} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name}</ItemTitle>
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      {selected ? <Badge variant="secondary">{order}</Badge> : null}
      <Badge variant="outline">
        {activityTypeLabels[activity.suggested_type]}
      </Badge>
    </Item>
  )
}

export { ActivityPickerRow }
