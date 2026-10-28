import { useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicIcon } from "@/components/dynamic-icon"
import { cn } from "@/lib/utils"
import { activityTypeLabels } from "@/features/activity/types/activity"
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityDetailDialog } from "./template-activity-detail-dialog"

type TemplateActivityCardProps = {
  id: string
  index: number
  group: string
  activity: TemplateActivity
}

function formatTarget(activity: TemplateActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

function TemplateActivityCard({
  id,
  index,
  group,
  activity,
}: TemplateActivityCardProps) {
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
  const target = formatTarget(activity)
  const icon = activity.activity?.icon
  const [detailOpen, setDetailOpen] = useState(false)
  const note = activity.note?.trim()
  const description = note || target

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
          {icon ? (
            <DynamicIcon name={icon} size="md" variant="muted" />
          ) : null}
          <CardTitle className="max-w-full truncate">
            {activity.activity?.name}
          </CardTitle>
          {description ? (
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          ) : null}
          <Badge variant="outline">{activityTypeLabels[activity.type]}</Badge>
        </CardHeader>
      </Card>
      <TemplateActivityDetailDialog
        activity={activity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export { TemplateActivityCard }
