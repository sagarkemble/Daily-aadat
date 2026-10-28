import { useEffect, useRef, useState } from "react"

import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"

import { ActivityPickerDialog } from "@/features/activity/components/activity-picker/activity-picker-dialog"
import type { ActivityWithConfiguration } from "@/features/activity/types/activity"
import { toast } from "@/components/ui/toast"
import { SLOTS, TIMED_SLOTS, type Slot } from "@/features/templates/types/slots"
import { useChangeTodoState } from "@/features/todos/hooks/use-change-todo-state"
import type { TodoState } from "@/features/todos/types/todo"
import { useAddActivity } from "../hooks/use-add-activity"
import { useApplyActivityCommand } from "../hooks/use-apply-activity-command"
import { useFetchDayPlan } from "../hooks/use-fetch-day-plan"
import { useReorderDayPlanActivities } from "../hooks/use-reorder-day-plan-activities"
import { useUnassignTodo } from "../hooks/use-unassign-todo"
import {
  applyDayItemCommand,
  type DayItemCommand,
} from "../lib/day-item-command"
import type {
  DayBoard,
  DayPlanActivity,
  NewDayPlanActivity,
} from "../types/day-plan"
import { AddTodoDialog } from "./add-todo-dialog/add-todo-dialog"
import { DayPlanActions } from "./day-plan-actions"
import { DayRail } from "./day-rail"
import DaySlot from "./day-slot"
import { DayWide } from "./day-wide"

type DayPageProps = {
  date: string
}

function nextSortOrder(slotOrders: number[]) {
  if (slotOrders.length === 0) return 0
  return Math.max(...slotOrders) + 1
}

function todoStateFromDayItem(state: DayPlanActivity["state"]): TodoState {
  if (state === "running") {
    throw new Error("Todos cannot be running")
  }
  return state
}

const DayPage = ({ date }: DayPageProps) => {
  const { data, isLoading, error } = useFetchDayPlan(date)
  const [editing, setEditing] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSlot, setPickerSlot] = useState<Slot | undefined>()
  const [todoOpen, setTodoOpen] = useState(false)
  const { mutateAsync: addActivities, isPending: isAdding } = useAddActivity()
  const { mutate: applyCommand, isPending: isApplying } =
    useApplyActivityCommand()
  const { mutate: changeTodoState, isPending: isChangingTodo } =
    useChangeTodoState()
  const { mutate: unassignTodo, isPending: isUnassigning } = useUnassignTodo()
  const { mutateAsync: reorderActivities } = useReorderDayPlanActivities()
  const isPlanned = data != null
  const [board, setBoard] = useState<DayBoard | undefined>(data?.activities)
  const boardRef = useRef(board)
  boardRef.current = board
  const isDragging = useRef(false)
  const snapshot = useRef(board)

  useEffect(() => {
    if (!isPlanned) {
      setEditing(false)
    }
  }, [isPlanned])

  useEffect(() => {
    if (data && !isDragging.current) {
      setBoard(data.activities)
    }
  }, [data])

  if (error) return <div>Error: {error.message}</div>

  const busy = isApplying || isChangingTodo || isUnassigning

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

  function handleAddActivities(
    configured: ActivityWithConfiguration[],
    slot?: Slot
  ) {
    if (!slot || !data) return
    const sortOrderStart = nextSortOrder(
      (board?.[slot]?.activities ?? []).map((activity) => activity.slot_order)
    )
    const dayItems: NewDayPlanActivity[] = configured.map(
      (activity, index) => ({
        day_plan_id: data.id,
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

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <DayPlanActions
          date={date}
          isPlanned={isPlanned}
          editing={editing}
          onEditingChange={setEditing}
          onAddActivity={() => {
            setPickerSlot(undefined)
            setPickerOpen(true)
          }}
          isAddingActivity={isAdding}
          onAddTodo={
            isPlanned
              ? () => {
                  setTodoOpen(true)
                }
              : undefined
          }
        />
        <DragDropProvider
          onDragStart={() => {
            isDragging.current = true
            snapshot.current = boardRef.current
          }}
          onDragOver={(event) => {
            setBoard((current) => {
              if (!current) return current
              const lists = Object.fromEntries(
                SLOTS.map((slot) => [slot, current[slot].activities])
              )
              const nextLists = move(lists, event)
              return Object.fromEntries(
                SLOTS.map((slot) => [
                  slot,
                  {
                    ...current[slot],
                    activities: nextLists[slot] ?? current[slot].activities,
                  },
                ])
              ) as DayBoard
            })
          }}
          onDragEnd={(event) => {
            isDragging.current = false
            if (event.canceled) {
              setBoard(snapshot.current)
              return
            }

            const { source } = event.operation
            if (!isSortable(source)) return

            const next = boardRef.current
            if (!next) return

            const payload = SLOTS.flatMap((slot) =>
              (next[slot]?.activities ?? []).map((item, index) => ({
                ...item,
                slot,
                sort_order: index,
              }))
            )

            toast.promise(reorderActivities(payload), {
              loading: { title: "Reordering activities…" },
              success: { title: "Activities reordered" },
              error: { title: "Failed to reorder activities" },
            })
          }}
        >
          <DayWide
            items={board?.day_wide?.activities ?? []}
            isLoading={isLoading}
            editing={editing}
            dayPlanId={data?.id ?? ""}
            disabled={busy}
            onAddActivity={
              isPlanned
                ? () => {
                    setPickerSlot("day_wide")
                    setPickerOpen(true)
                  }
                : undefined
            }
            onCommand={onCommand}
            onUnassign={unassignTodo}
          />
          {TIMED_SLOTS.map((slot, index) => (
            <DaySlot
              key={slot}
              slot={slot}
              activities={board?.[slot]?.activities ?? []}
              startTime={board?.[slot]?.start_time ?? null}
              endTime={board?.[slot]?.end_time ?? null}
              dayPlanId={data?.id || ""}
              isLoading={isLoading}
              editing={editing}
              showConnector={index < TIMED_SLOTS.length - 1}
              disabled={busy}
              onAddActivity={
                isPlanned
                  ? () => {
                      setPickerSlot(slot)
                      setPickerOpen(true)
                    }
                  : undefined
              }
              onCommand={onCommand}
              onUnassign={unassignTodo}
            />
          ))}
        </DragDropProvider>
      </div>
      <DayRail date={date} board={board} isLoading={isLoading} />
      {isPlanned && data ? (
        <AddTodoDialog
          dayPlanId={data.id}
          nextSlotOrder={(slot) =>
            nextSortOrder(
              (board?.[slot]?.activities ?? []).map(
                (activity) => activity.slot_order
              )
            )
          }
          open={todoOpen}
          onOpenChange={setTodoOpen}
        />
      ) : null}
      {isPlanned ? (
        <ActivityPickerDialog
          requireSlot
          initialSlot={pickerSlot}
          open={pickerOpen}
          onOpenChange={(open) => {
            setPickerOpen(open)
            if (!open) setPickerSlot(undefined)
          }}
          onAdd={handleAddActivities}
          isPending={isAdding}
        />
      ) : null}
    </div>
  )
}

export { DayPage }
