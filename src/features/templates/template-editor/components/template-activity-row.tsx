import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { DynamicIcon } from "@/components/dynamic-icon"
import type { ActivityType } from "@/features/activity/types/activity"
import type { TemplateActivity } from "../../types/template"
import { Loader2, Trash } from "lucide-react"
import { useDeleteTemplateActivity } from "../hooks/use-delete-template-activity"

type TemplateActivityRowProps = {
  activity: TemplateActivity
}

const TYPE_LABELS: Record<ActivityType, string> = {
  check: "Check",
  timed: "Timed",
  count: "Count",
}

function formatTarget(activity: TemplateActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

const TemplateActivityRow = ({ activity }: TemplateActivityRowProps) => {
  const { mutate: deleteActivity, isPending } = useDeleteTemplateActivity(
    activity.id
  )
  const target = formatTarget(activity)
  const icon = activity.activity?.icon
  function handleDelete() {
    deleteActivity(activity.id)
  }

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
      <Trash className="size-4" onClick={handleDelete} />
      {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
      <Badge variant="outline">{TYPE_LABELS[activity.type]}</Badge>
    </Item>
  )
}

export { TemplateActivityRow }
