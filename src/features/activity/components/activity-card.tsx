import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DynamicIcon } from "@/components/dynamic-icon"
import { activityTypeLabels, type Activity } from "../types/activity"
import { ActivityDetailDialog } from "./activity-detail-dialog"
import { cn } from "@/lib/utils"

function activityCardSubtitle(activity: Activity): string {
  const typeLabel = activityTypeLabels[activity.suggested_type]
  if (
    activity.suggested_type === "count" &&
    activity.suggested_target != null
  ) {
    const unit = activity.suggested_unit?.trim()
    if (unit) return `${typeLabel}, ${activity.suggested_target} ${unit}`
    return `${typeLabel}, ${activity.suggested_target}`
  }
  return typeLabel
}

function ActivityCardBody({ activity }: { activity: Activity }) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
        <DynamicIcon
          name={activity.icon}
          className="size-4"
          aria-hidden={true}
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">
          {activity.name}
        </span>
        <span className="block text-xs text-muted-foreground">
          {activityCardSubtitle(activity)}
        </span>
      </span>
    </>
  )
}

export function ActivityCard({ activity }: { activity: Activity }) {
  const [open, setOpen] = useState(false)
  const isCustom = activity.source === "custom"

  if (!isCustom) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-xs"
        )}
      >
        <ActivityCardBody activity={activity} />
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-xs transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        }
      >
        <ActivityCardBody activity={activity} />
      </DialogTrigger>
      <ActivityDetailDialog
        activity={activity}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  )
}
