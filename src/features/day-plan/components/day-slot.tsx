import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import type { ActivityType } from "@/features/activity/types/activity"
import type { Slot } from "@/features/templates/types/slots"
import { SLOT_LABELS } from "@/features/templates/types/slots"
import type { DayPlanActivity } from "../types/day-plan"

type DaySlotProps = {
  slot: Slot
  activities: DayPlanActivity[]
}

const TYPE_LABELS: Record<ActivityType, string> = {
  check: "Check",
  timed: "Timed",
  count: "Count",
}

function formatTarget(activity: DayPlanActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

const DaySlot = ({ slot, activities }: DaySlotProps) => {
  const count = activities.length

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{SLOT_LABELS[slot]}</CardTitle>
        {count === 0 ? <CardDescription>No activities</CardDescription> : null}
        <CardAction>
          <Badge variant="secondary">{count}</Badge>
        </CardAction>
      </CardHeader>
      {count > 0 ? (
        <CardContent>
          <ItemGroup>
            {activities.map((activity) => {
              const target = formatTarget(activity)
              return (
                <Item key={activity.id} variant="outline" size="sm">
                  <ItemMedia variant="icon">
                    <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
                      {activity.icon_snapshot ? (
                        <ActivityIcon
                          name={activity.icon_snapshot}
                          className="size-4"
                        />
                      ) : null}
                    </span>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{activity.name_snapshot}</ItemTitle>
                    {target ? (
                      <ItemDescription>{target}</ItemDescription>
                    ) : null}
                  </ItemContent>
                  <Badge variant="outline">{TYPE_LABELS[activity.type]}</Badge>
                </Item>
              )
            })}
          </ItemGroup>
        </CardContent>
      ) : null}
    </Card>
  )
}

export default DaySlot
