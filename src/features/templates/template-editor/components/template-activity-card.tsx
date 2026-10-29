import { useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { activityTypeLabels } from "@/features/activity/types/activity"
import { cn } from "@/lib/utils"
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityDetailDialog } from "./template-activity-detail-dialog"

type TemplateActivityCardProps = {
  id: string
  index: number
  group: string
  activity: TemplateActivity
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
  const icon = activity.activity?.icon
  const [detailOpen, setDetailOpen] = useState(false)
  const note = activity.note?.trim()

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
            {icon ? (
              <DynamicIcon name={icon} size="md" variant="muted" />
            ) : null}
            <div className="flex w-full flex-col items-center gap-0.5">
              <CardTitle className="w-full min-w-0 truncate">
                {activity.activity?.name}
              </CardTitle>
              {note ? (
                <CardDescription className="w-full truncate">{note}</CardDescription>
              ) : null}
            </div>
          </div>
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
