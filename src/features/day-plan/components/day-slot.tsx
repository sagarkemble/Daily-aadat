import { ItemGroup } from "@/components/ui/item"
import { isTimedSlot, type Slot } from "@/features/templates/types/slots"
import type { DayPlanActivity } from "../types/day-plan"
import { useDeleteActivity } from "../hooks/use-delete-activity"
import { useApplyActivityCommand } from "../hooks/use-apply-activity-command"
import { useUnassignTodo } from "../hooks/use-unassign-todo"
import { useChangeTodoState } from "@/features/todos/hooks/use-change-todo-state"
import type { TodoState } from "@/features/todos/types/todo"
import {
  applyDayItemCommand,
  type DayItemCommand,
} from "../lib/day-item-command"
import { DayActivityRow } from "./day-activity-row"
import DayActivityRowSkeleton from "./day-activity-row-skeleton"
import { ReorderList } from "@/components/ui/reorder-list"
import { useReorderDayPlanActivities } from "../hooks/use-reorder-day-plan-activities"
import { toast } from "@/components/ui/toast"
import { SlotArt } from "./slot-art"
import { SlotAddControl } from "./slot-add-control"
import { DaySlotTimeFields } from "./day-slot-time-fields"
import { Card } from "@/components/ui/card"

type DaySlotProps = {
  slot: Slot
  activities: DayPlanActivity[]
  dayPlanId: string
  startTime?: string | null
  endTime?: string | null
  isLoading: boolean
  editing: boolean
}

function clockHeading(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return undefined
  return `${startTime.slice(0, 5)}–${endTime.slice(0, 5)}`
}

const VISIBLE_ROWS = 6
const ROW_HEIGHT_PX = 56

function nextSortOrder(activities: DayPlanActivity[]) {
  if (activities.length === 0) return 0
  return Math.max(...activities.map((activity) => activity.slot_order)) + 1
}

function todoStateFromDayItem(state: DayPlanActivity["state"]): TodoState {
  if (state === "running") {
    throw new Error("Todos cannot be running")
  }
  return state
}

const DaySlot = ({
  slot,
  activities,
  dayPlanId,
  startTime = null,
  endTime = null,
  isLoading,
  editing,
}: DaySlotProps) => {
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity()
  const { mutate: applyCommand, isPending: isApplying } =
    useApplyActivityCommand()
  const { mutate: changeTodoState, isPending: isChangingTodo } =
    useChangeTodoState()
  const { mutate: unassignTodo, isPending: isUnassigning } = useUnassignTodo()
  const { mutateAsync: reorderActivities } = useReorderDayPlanActivities()

  function onCommand(activity: DayPlanActivity, command: DayItemCommand) {
    const next = applyDayItemCommand(activity, command)
    if (activity.kind === "todo") {
      if (!activity.todo_id) {
        throw new Error("Todo placement is missing todo_id")
      }
      changeTodoState({
        id: activity.todo_id,
        state: todoStateFromDayItem(next.state),
      })
      return
    }
    applyCommand({ activityId: activity.id, activity: next })
  }

  function handleReorderFinish(newOrder: DayPlanActivity[]) {
    const newActivities = newOrder.map((activity, index) => ({
      ...activity,
      sort_order: index,
    }))

    toast.promise(reorderActivities(newActivities), {
      loading: { title: "Reordering activities…" },
      success: { title: "Activities reordered" },
      error: { title: "Failed to reorder activities" },
    })
  }

  const count = activities.length
  const busy = isDeleting || isApplying || isChangingTodo || isUnassigning
  const empty = !isLoading && count === 0

  return (
    <Card className="flex-row items-stretch gap-0 overflow-hidden py-0">
      <SlotArt slot={slot} clockLabel={clockHeading(startTime, endTime)}>
        {editing ? (
          <SlotAddControl
            slot={slot}
            dayPlanId={dayPlanId}
            nextSlotOrder={nextSortOrder(activities)}
            disabled={busy || dayPlanId === ""}
          />
        ) : null}
      </SlotArt>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        {isTimedSlot(slot) && dayPlanId !== "" ? (
          <DaySlotTimeFields
            dayPlanId={dayPlanId}
            slot={slot}
            startTime={startTime}
            endTime={endTime}
            disabled={isLoading}
          />
        ) : null}
        {isLoading ? (
          <ItemGroup className="gap-0 divide-y has-data-[size=sm]:gap-0">
            <DayActivityRowSkeleton />
            <DayActivityRowSkeleton />
          </ItemGroup>
        ) : empty ? null : (
          <div
            className="min-h-0 overflow-x-hidden overflow-y-auto"
            style={{ maxHeight: VISIBLE_ROWS * ROW_HEIGHT_PX }}
          >
            <ItemGroup className="min-w-0 gap-0 has-data-[size=sm]:gap-0">
              <ReorderList
                items={activities}
                getItemId={(activity) => activity.id}
                onReorderFinish={handleReorderFinish}
                className="min-w-0 gap-0 divide-y"
                itemClassName="min-w-0 bg-transparent"
                renderItem={(activity) => (
                  <DayActivityRow
                    activity={activity}
                    disabled={busy}
                    editing={editing}
                    onCommand={onCommand}
                    onDelete={deleteActivity}
                    onUnassign={unassignTodo}
                  />
                )}
              />
            </ItemGroup>
          </div>
        )}
      </div>
    </Card>
  )
}

export default DaySlot
