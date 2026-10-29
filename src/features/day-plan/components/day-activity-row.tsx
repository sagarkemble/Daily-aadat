import { useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { DynamicIcon } from "@/components/dynamic-icon"
import { cn } from "@/lib/utils"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import type { TodoState } from "@/features/todos/types/todo"
import { todoStateFromDayActivity } from "@/features/todos/lib/todo-state-from-day-activity"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { placementIconName } from "../lib/placement-icon"
import { CountControls, TimedControls } from "./day-activity-controls"
import { DayActivityDetailDialog } from "./day-activity-detail-dialog"

type DayActivityRowProps = {
  id: string
  index: number
  group: string
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}

function formatCountProgress(activity: DayPlanActivity) {
  if (activity.target == null) return null
  const value = activity.count_value ?? 0
  const ofTarget = `${value} of ${activity.target}`
  if (!activity.unit) return ofTarget
  return `${ofTarget} ${activity.unit}`
}

function formatTimedTarget(activity: DayPlanActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

function todoStateFromActivity(state: DayPlanActivity["state"]): TodoState {
  return todoStateFromDayActivity(state)
}

export function DayActivityRow({
  id,
  index,
  group,
  activity,
  disabled,
  onCommand,
}: DayActivityRowProps) {
  const { ref, sourceRef, isDragging } = useSortable({
    id,
    index,
    group,
    type: "activity",
    accept: "activity",
    plugins: (defaults) => [
      ...defaults,
      Feedback.configure({ feedback: "clone" }),
    ],
  })
  const skipped = activity.state === "skipped"
  const iconName = placementIconName(activity)
  const target =
    activity.type === "count"
      ? formatCountProgress(activity)
      : formatTimedTarget(activity)
  const note = activity.note_snapshot?.trim()
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <div className="min-w-0">
      <div ref={ref} className={cn("min-w-0", isDragging && "opacity-50")}>
        <Item
          ref={sourceRef}
          variant="default"
          size="sm"
          className="min-w-0 cursor-pointer rounded-none px-3"
          onClick={() => {
            if (!isDragging) setDetailOpen(true)
          }}
        >
          <ItemMedia variant="icon">
            {iconName ? (
              <DynamicIcon
                name={iconName}
                size="md"
                variant="muted"
              />
            ) : null}
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="w-full min-w-0">
              {activity.name_snapshot}
            </ItemTitle>
            {activity.kind === "todo" && activity.priority ? (
              <TodoMeta
                priority={activity.priority}
                dueDate={activity.due_date}
                state={todoStateFromActivity(activity.state)}
                muted={skipped || activity.state === "done"}
              />
            ) : null}
            {target ? <ItemDescription>{target}</ItemDescription> : null}
            {note ? <ItemDescription>{note}</ItemDescription> : null}
          </ItemContent>
          <ItemActions
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            {skipped ? null : (
              <>
                {activity.type === "timed" ? (
                  <TimedControls
                    activity={activity}
                    disabled={disabled}
                    onCommand={onCommand}
                  />
                ) : null}
                {activity.type === "count" ? (
                  <CountControls
                    activity={activity}
                    disabled={disabled}
                    onCommand={onCommand}
                  />
                ) : null}
                {activity.kind === "todo" ? (
                  <Checkbox
                    checked={activity.state === "done"}
                    disabled={disabled}
                    onCheckedChange={() =>
                      onCommand(activity, { type: "update_todo" })
                    }
                  />
                ) : null}
                {activity.type === "check" ? (
                  <Checkbox
                    checked={activity.state === "done"}
                    disabled={disabled}
                    onCheckedChange={() =>
                      onCommand(activity, { type: "toggle_check" })
                    }
                  />
                ) : null}
              </>
            )}
          </ItemActions>
        </Item>
      </div>
      <DayActivityDetailDialog
        activity={activity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
