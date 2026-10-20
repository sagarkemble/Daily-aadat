import { ItemGroup } from "@/components/ui/item"
import type { Slot } from "@/features/templates/types/slots"
import type { DayPlanActivity, NewDayPlanActivity } from "../types/day-plan"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import { useAddActivity } from "../hooks/use-add-activity"
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
import { Card } from "@/components/ui/card"

type DaySlotProps = {
  slot: Slot
  activities: DayPlanActivity[]
  dayPlanId: string
  isLoading: boolean
}

const VISIBLE_ROWS = 6
const ROW_HEIGHT_PX = 52

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

const DaySlot = ({ slot, activities, dayPlanId, isLoading }: DaySlotProps) => {
  const { mutateAsync: addActivities, isPending: isAdding } = useAddActivity()
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivity()
  const { mutate: applyCommand, isPending: isApplying } =
    useApplyActivityCommand()
  const { mutate: changeTodoState, isPending: isChangingTodo } =
    useChangeTodoState()
  const { mutate: unassignTodo, isPending: isUnassigning } = useUnassignTodo()
  const { mutateAsync: reorderActivities } = useReorderDayPlanActivities()
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
    toast.promise(addActivities(dayItems), {
      loading: { title: "Adding activities…" },
      success: { title: "Activities added" },
      error: { title: "Failed to add activities" },
    })
  }

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
      <SlotArt slot={slot} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        {empty ? null : (
          <div className="flex justify-end">
            <SlotAddControl
              slot={slot}
              dayPlanId={dayPlanId}
              nextSlotOrder={nextSortOrder(activities)}
              empty={false}
              disabled={busy || dayPlanId === ""}
              isAddingActivity={isAdding}
              onAddActivities={handleAddActivities}
            />
          </div>
        )}
        {isLoading ? (
          <ItemGroup>
            <DayActivityRowSkeleton />
            <DayActivityRowSkeleton />
          </ItemGroup>
        ) : empty ? (
          <SlotAddControl
            slot={slot}
            dayPlanId={dayPlanId}
            nextSlotOrder={nextSortOrder(activities)}
            empty
            disabled={dayPlanId === ""}
            isAddingActivity={isAdding}
            onAddActivities={handleAddActivities}
          />
        ) : (
          <div
            className="min-h-0 overflow-y-auto"
            style={{ maxHeight: VISIBLE_ROWS * ROW_HEIGHT_PX }}
          >
            <ItemGroup>
              <ReorderList
                items={activities}
                getItemId={(activity) => activity.id}
                onReorderFinish={handleReorderFinish}
                className="rounded-lg"
                renderItem={(activity) => (
                  <DayActivityRow
                    activity={activity}
                    disabled={busy}
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
