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
import { DeleteTemplateActivityDialog } from "./delete-template-activity-dialog"

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
  const { ref, isDragging } = useSortable({
    id,
    index,
    group,
    type: "activity",
    accept: "activity",
  })
  const target = formatTarget(activity)
  const icon = activity.activity?.icon

  return (
    <div ref={ref} className={cn(isDragging && "opacity-50")}>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
            {icon ? <DynamicIcon name={icon} /> : null}
          </span>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{activity.activity?.name}</ItemTitle>
          {target ? <ItemDescription>{target}</ItemDescription> : null}
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">{activityTypeLabels[activity.type]}</Badge>
          <DeleteTemplateActivityDialog
            activityId={activity.id}
            name={activity.activity?.name}
          />
        </ItemActions>
      </Item>
    </div>
  )
}

export { TemplateActivityRow }
