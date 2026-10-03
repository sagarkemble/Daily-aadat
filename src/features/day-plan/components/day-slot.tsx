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
import type { DayPlanActivity, NewDayPlanActivity } from "../types/day-plan"
import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import { useAddActivity } from "../hooks/use-add-activity"
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
  const { mutate: addActivities, isPending: isAdding } = useAddActivity()
  const { mutate: deleteActivity, isPending: isDeleting } =
    useDeleteActivity()
  const { mutate: applyCommand, isPending: isApplying } =
    useApplyActivityCommand()

  function handleAddActivities(configured: ActivityWithConfiguration[]) {
    const sortOrderStart = nextSortOrder(activities)
    const dayItems: NewDayPlanActivity[] = configured.map(
      (activity, index) => ({
        day_plan_id: dayPlanId,
        kind: "activity",
        activity_id: activity.id,
        name_snapshot: activity.name,
        icon_snapshot: activity.icon,
        type: activity.type,
        target: activity.type === "count" ? activity.target : null,
        unit: activity.type === "count" ? activity.unit : null,
        slot,
        sort_order: sortOrderStart + index,
        state: "pending",
        note_snapshot: null,
      })
    )
    addActivities(dayItems)
  }

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
            onAdd={handleAddActivities}
            isPending={isAdding}
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
