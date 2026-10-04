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
import { DayActivityRow } from "./day-activity-row"
import DayActivityRowSkeleton from "./day-activity-row-skeleton"
import { ReorderList } from "@/components/ui/reorder-list"
import { useReorderDayPlanActivities } from "../hooks/use-reorder-day-plan-activities"
import { toast } from "@/components/ui/toast"

type DaySlotProps = {
  slot: Slot
  activities: DayPlanActivity[]
  dayPlanId: string
  isLoading: boolean
}

function nextSortOrder(activities: DayPlanActivity[]) {
  if (activities.length === 0) return 0
  return Math.max(...activities.map((activity) => activity.slot_order)) + 1
}

const DaySlot = ({ slot, activities, dayPlanId, isLoading }: DaySlotProps) => {
  const { mutate: addActivities, isPending: isAdding } = useAddActivity()
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity()
  const { mutate: applyCommand, isPending: isApplying } =
    useApplyActivityCommand()
  const { mutate: reorderActivities, isPending: isReordering } =
    useReorderDayPlanActivities()
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

  function onCommand(activity: DayPlanActivity, command: DayItemCommand) {
    const next = applyDayItemCommand(activity, command)
    applyCommand({ activityId: activity.id, activity: next })
  }

  function handleReorderFinish(newOrder: React.ReactElement[]) {
    const newActivities = newOrder.map((item, index) => {
      return {
        ...(item.props as { activity: DayPlanActivity }).activity,
        sort_order: index,
      }
    })

    console.log(newActivities)

    reorderActivities(newActivities, {
      onSuccess: () => {
        toast.add({
          title: "Activities reordered",
          description: "The activities have been reordered successfully",
        })
      },
      onError: () => {
        toast.add({
          title: "Failed to reorder activities",
          description: "The activities could not be reordered",
        })
      },
    })
  }

  const count = activities.length
  const busy = isDeleting || isApplying

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{SLOT_LABELS[slot]}</CardTitle>
        {count === 0 && !isLoading ? (
          <CardDescription>No activities</CardDescription>
        ) : null}
        <CardAction>
          <ActivityPickerDialog
            onAdd={handleAddActivities}
            isPending={isAdding}
          />
          <Badge variant="secondary">{count}</Badge>
        </CardAction>
      </CardHeader>
      {isLoading ? (
        <CardContent>
          <ItemGroup>
            <DayActivityRowSkeleton />
            <DayActivityRowSkeleton />
          </ItemGroup>
        </CardContent>
      ) : count > 0 ? (
        <CardContent>
          <ItemGroup>
            <ReorderList
              onReorderFinish={handleReorderFinish}
              className="rounded-lg"
            >
              {activities.map((activity) => (
                <DayActivityRow
                  key={activity.id}
                  activity={activity}
                  disabled={busy}
                  onCommand={onCommand}
                  onDelete={deleteActivity}
                />
              ))}
            </ReorderList>
          </ItemGroup>
        </CardContent>
      ) : null}
    </Card>
  )
}

export default DaySlot
