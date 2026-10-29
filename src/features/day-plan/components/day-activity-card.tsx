import { useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DynamicIcon } from "@/components/dynamic-icon"
import { cn } from "@/lib/utils"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import type { TodoState } from "@/features/todos/types/todo"
import { todoStateFromDayActivity } from "@/features/todos/lib/todo-state-from-day-activity"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import {
  CheckControl,
  CountControls,
  TimedControls,
} from "./day-activity-controls"
import { DayActivityDetailDialog } from "./day-activity-detail-dialog"

type DayActivityCardProps = {
  id: string
  index: number
  group: string
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}

function DayActivityCard({
  id,
  index,
  group,
  activity,
  disabled,
  onCommand,
}: DayActivityCardProps) {
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
  const [detailOpen, setDetailOpen] = useState(false)
  const note = activity.note_snapshot?.trim()
  const skipped = activity.state === "skipped"
  const todoState = (): TodoState => todoStateFromDayActivity(activity.state)
  const controls = skipped ? null : activity.type === "timed" ? (
    <TimedControls
      activity={activity}
      disabled={disabled}
      onCommand={onCommand}
    />
  ) : activity.type === "count" ? (
    <CountControls
      activity={activity}
      disabled={disabled}
      onCommand={onCommand}
      showTarget
      round
    />
  ) : activity.kind === "todo" || activity.type === "check" ? (
    <CheckControl
      activity={activity}
      disabled={disabled}
      onCommand={onCommand}
    />
  ) : null

  return (
    <div ref={ref} className={cn("aspect-square", isDragging && "opacity-50")}>
      <Card
        ref={sourceRef}
        size="sm"
        className="size-full cursor-pointer border border-border ring-0 [--card-spacing:--spacing(5)]"
        onClick={() => {
          if (!isDragging) setDetailOpen(true)
        }}
      >
        <CardHeader className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex w-full flex-col items-center gap-2">
            {activity.icon_snapshot ? (
              <DynamicIcon
                name={activity.icon_snapshot}
                size="md"
                variant="muted"
              />
            ) : null}
            <div className="flex w-full flex-col items-center gap-0.5">
              <CardTitle className="w-full min-w-0 truncate">
                {activity.name_snapshot}
              </CardTitle>
              {activity.kind === "todo" && activity.priority ? (
                <TodoMeta
                  priority={activity.priority}
                  dueDate={activity.due_date}
                  state={todoState()}
                  muted={skipped || activity.state === "done"}
                  className="justify-center"
                />
              ) : null}
              {note ? (
                <CardDescription className="w-full truncate">{note}</CardDescription>
              ) : null}
            </div>
          </div>
          <div
            className="flex justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {controls}
          </div>
        </CardHeader>
      </Card>
      <DayActivityDetailDialog
        activity={activity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export { DayActivityCard }
