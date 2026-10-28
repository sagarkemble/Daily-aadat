import { useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"

import { Badge } from "@/components/ui/badge"
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
import { activityTypeLabels } from "@/features/activity/types/activity"
import type { TemplateActivity } from "../../types/template"
import { TemplateActivityDetailDialog } from "./template-activity-detail-dialog"

type TemplateActivityRowProps = {
  id: string
  index: number
  group: string
  activity: TemplateActivity
}

function formatTarget(activity: TemplateActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

const TemplateActivityRow = ({
  id,
  index,
  group,
  activity,
}: TemplateActivityRowProps) => {
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
            {icon ? (
              <DynamicIcon name={icon} size="md" variant="muted" />
            ) : null}
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{activity.activity?.name}</ItemTitle>
            {target ? <ItemDescription>{target}</ItemDescription> : null}
            {note ? <ItemDescription>{note}</ItemDescription> : null}
          </ItemContent>
          <ItemActions>
            <Badge variant="outline">{activityTypeLabels[activity.type]}</Badge>
          </ItemActions>
        </Item>
      </div>
      <TemplateActivityDetailDialog
        activity={activity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export { TemplateActivityRow }
