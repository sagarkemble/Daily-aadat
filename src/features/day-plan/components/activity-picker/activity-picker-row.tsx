import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/features/activity/types/activity"

type ActivityPickerRowProps = {
  activity: Activity
  onSelect: (activity: Activity) => void
  selected: boolean
  order: number
}

const ActivityPickerRow = ({
  activity,
  onSelect,
  selected,
  order,
}: ActivityPickerRowProps) => {
  return (
    <Item variant="outline" size="sm" onClick={() => onSelect(activity)}>
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <DynamicIcon name={activity.icon as IconName} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name}</ItemTitle>
      </ItemContent>
      {selected && (
        <Badge variant="outline" className="size-6">
          {order}
        </Badge>
      )}
    </Item>
  )
}

export { ActivityPickerRow }
