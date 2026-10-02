import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ItemGroup } from "@/components/ui/item"
import type { Slot } from "@/features/templates/types/slots"
import { SLOT_LABELS } from "@/features/templates/types/slots"
import type { DayPlanActivity } from "../types/day-plan"
import ActivityPickerDialog from "./activity-picker/activity-picker-dialog"
import { useDeleteActivity } from "../hooks/use-delete-activity"
import { useApplyActivityCommand } from "../hooks/use-apply-activity-command"
import {
  applyDayItemCommand,
  type DayItemCommand,
} from "../lib/day-item-command"
import { DayItemRow } from "./day-item-row"

type DaySlotProps = {
  slot: Slot
  activities: DayPlanActivity[]
  dayPlanId: string
}

function nextSortOrder(activities: DayPlanActivity[]) {
  if (activities.length === 0) return 0
  return Math.max(...activities.map((activity) => activity.slot_order)) + 1
}

const DaySlot = ({ slot, activities, dayPlanId }: DaySlotProps) => {
  const { mutate: deleteActivity, isPending: isDeleting } =
    useDeleteActivity()
  const { mutate: applyCommand, isPending: isApplying } =
    useApplyActivityCommand()

  function run(activity: DayPlanActivity, command: DayItemCommand) {
    const next = applyDayItemCommand(activity, command)
    applyCommand({ activityId: activity.id, activity: next })
  }

  const count = activities.length
  const busy = isDeleting || isApplying

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{SLOT_LABELS[slot]}</CardTitle>
        {count === 0 ? <CardDescription>No activities</CardDescription> : null}
        <CardAction>
          <ActivityPickerDialog
            slot={slot}
            dayPlanId={dayPlanId}
            sortOrderStart={nextSortOrder(activities)}
          />
          <Badge variant="secondary">{count}</Badge>
        </CardAction>
      </CardHeader>
      {count > 0 ? (
        <CardContent>
          <ItemGroup>
            {activities.map((activity) => (
              <DayItemRow
                key={activity.id}
                activity={activity}
                disabled={busy}
                onCommand={run}
                onDelete={deleteActivity}
              />
            ))}
          </ItemGroup>
        </CardContent>
      ) : null}
    </Card>
  )
}

export default DaySlot
