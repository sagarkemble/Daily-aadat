import { useState } from "react"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { activityTypeLabels, type Activity } from "../types/activity"
import { ActivityDetailDialog } from "./activity-detail-dialog"

function activityTypeChip(activity: Activity): string {
  const typeLabel = activityTypeLabels[activity.suggested_type]
  if (
    activity.suggested_type === "count" &&
    activity.suggested_target != null
  ) {
    const unit = activity.suggested_unit?.trim()
    if (unit) return `${typeLabel} · ${activity.suggested_target} ${unit}`
    return `${typeLabel} · ${activity.suggested_target}`
  }
  return typeLabel
}

export function ActivityCard({ activity }: { activity: Activity }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Item
        variant="default"
        size="sm"
        render={<button type="button" />}
        className="cursor-pointer rounded-none border-0 border-b border-border px-2 text-left"
        onClick={() => setOpen(true)}
      >
        <ItemMedia variant="icon">
          <DynamicIcon
            name={activity.icon}
            size="sm"
            variant="muted"
            aria-hidden={true}
          />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="w-full min-w-0 truncate">
            {activity.name}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">{activityTypeChip(activity)}</Badge>
        </ItemActions>
      </Item>
      <ActivityDetailDialog
        activity={activity}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  )
}
