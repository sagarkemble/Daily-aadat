import { DynamicIcon } from "@/components/dynamic-icon"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { activityIconWellClass } from "@/features/activity/lib/activity-style"
import {
  activityTypeLabels,
  type Activity,
} from "@/features/activity/types/activity"
import { cn } from "@/lib/utils"

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
    <Item
      variant="outline"
      size="sm"
      render={<button type="button" aria-pressed={selected} />}
      onClick={() => onSelect(activity)}
      className={cn(
        "w-full text-left",
        selected && "border-primary/50 bg-accent hover:bg-accent"
      )}
    >
      <ItemMedia variant="icon">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            activityIconWellClass(activity.id)
          )}
        >
          <DynamicIcon name={activity.icon} />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className={cn(selected && "text-foreground")}>
          {activity.name}
        </ItemTitle>
        <ItemDescription>
          {activityTypeLabels[activity.suggested_type]}
        </ItemDescription>
      </ItemContent>
      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
          selected
            ? "border-foreground bg-foreground text-background"
            : "border-input text-muted-foreground"
        )}
      >
        {selected ? order : null}
      </span>
    </Item>
  )
}

export { ActivityPickerRow }
