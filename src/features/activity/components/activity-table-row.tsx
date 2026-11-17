import { useState } from "react"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import { TableCell, TableRow } from "@/components/ui/table"
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

export function ActivityTableRow({ activity }: { activity: Activity }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <TableCell className="max-w-0 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <DynamicIcon
              name={activity.icon}
              size="sm"
              variant="muted"
              aria-hidden={true}
            />
            <span className="truncate font-medium">{activity.name}</span>
          </div>
        </TableCell>
        <TableCell className="px-4 py-2.5 text-right">
          <Badge variant="outline">{activityTypeChip(activity)}</Badge>
        </TableCell>
      </TableRow>
      <Dialog open={open} onOpenChange={setOpen}>
        <ActivityDetailDialog
          activity={activity}
          open={open}
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </>
  )
}
