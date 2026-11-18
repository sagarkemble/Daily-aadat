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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TodoMeta } from "@/features/todos/components/todo-meta"
import type { TodoState } from "@/features/todos/types/todo"
import { todoStateFromDayActivity } from "@/features/todos/lib/todo-state-from-day-activity"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { placementIconName } from "../lib/placement-icon"
import {
  CountControls,
  DoneCheckbox,
  TimedControls,
} from "./day-activity-controls"
import { activityIconWellClass } from "@/features/activity/lib/activity-style"
import { DayActivityDetailDialog } from "./day-activity-detail-dialog"
import {
  PLACEMENT_STATUS_BADGE_CLASS,
  PLACEMENT_STATUS_LABELS,
} from "../lib/placement-status"

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
  const iconName = placementIconName(activity)
  const todoState = (): TodoState => todoStateFromDayActivity(activity.state)
  const controls = skipped ? (
    <Badge variant="outline" className={PLACEMENT_STATUS_BADGE_CLASS.skipped}>
      {PLACEMENT_STATUS_LABELS.skipped}
    </Badge>
  ) : (
    <div className="flex items-center justify-center gap-2">
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
          showTarget
          round
        />
      ) : null}
      <DoneCheckbox
        activity={activity}
        disabled={disabled}
        onCommand={onCommand}
      />
    </div>
  )

  return (
    <div ref={ref} className={cn("aspect-square", isDragging && "opacity-50")}>
      <Card
        ref={sourceRef}
        size="sm"
        className="size-full cursor-pointer border border-border ring-0 transition-colors [--card-spacing:--spacing(5)] hover:bg-surface-hover-card"
        onClick={() => {
          if (!isDragging) setDetailOpen(true)
        }}
      >
        <CardHeader className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex w-full flex-col items-center gap-2">
            {iconName ? (
              <DynamicIcon
                name={iconName}
                size="md"
                variant="muted"
                className={cn(
                  activity.kind === "activity" &&
                    activityIconWellClass(activity.activity_id ?? activity.id),
                  skipped && "opacity-50 grayscale"
                )}
              />
            ) : null}
            <div className="flex w-full flex-col items-center gap-0.5">
              <CardTitle
                className={cn(
                  "w-full min-w-0 truncate",
                  skipped && "text-muted-foreground line-through"
                )}
              >
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
                <CardDescription className="w-full truncate">
                  {note}
                </CardDescription>
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
        disabled={disabled}
        onCommand={onCommand}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export { DayActivityCard }
