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
import { activityTypeLabels } from "@/features/activity/types/activity"
import type { TemplateActivity } from "../../types/template"
import { DeleteTemplateActivityDialog } from "./delete-template-activity-dialog"

type TemplateActivityRowProps = {
  activity: TemplateActivity
}

function formatTarget(activity: TemplateActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

const TemplateActivityRow = ({ activity }: TemplateActivityRowProps) => {
  const target = formatTarget(activity)
  const icon = activity.activity?.icon

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          {icon ? <DynamicIcon name={icon} className="size-4" /> : null}
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
  )
}

export { TemplateActivityRow }
