import { useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DynamicIcon } from "@/components/dynamic-icon"
import { cn } from "@/lib/utils"
import { activityTypeLabels } from "@/features/activity/types/activity"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { DayActivityDetailDialog } from "./day-activity-detail-dialog"

type DayActivityCardProps = {
  id: string
  index: number
  group: string
  activity: DayPlanActivity
  disabled?: boolean
  editing?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
  onUnassign: (activityId: string) => void
}

function kindLabel(activity: DayPlanActivity) {
  if (activity.kind === "todo") return "Todo"
  if (activity.type) return activityTypeLabels[activity.type]
  return "Activity"
}

function DayActivityCard({
  id,
  index,
  group,
  activity,
  disabled,
  editing = false,
  onCommand,
  onUnassign,
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

  return (
    <div ref={ref} className={cn("h-full", isDragging && "opacity-50")}>
      <Card
        ref={sourceRef}
        size="sm"
        className="h-full min-h-44 cursor-pointer border border-border ring-0"
        onClick={() => {
          if (!isDragging) setDetailOpen(true)
        }}
      >
        <CardHeader className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          {activity.icon_snapshot ? (
            <DynamicIcon
              name={activity.icon_snapshot}
              size="md"
              variant="muted"
            />
          ) : null}
          <CardTitle className="max-w-full truncate">
            {activity.name_snapshot}
          </CardTitle>
          {note ? (
            <CardDescription className="line-clamp-2">{note}</CardDescription>
          ) : null}
          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
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
            <Badge variant="outline">{kindLabel(activity)}</Badge>
          </div>
        </CardHeader>
      </Card>
      <DayActivityDetailDialog
        activity={activity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        editing={editing}
        onUnassign={onUnassign}
      />
    </div>
  )
}

export { DayActivityCard }
