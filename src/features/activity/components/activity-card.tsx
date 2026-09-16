import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ActivityIcon } from "./activity-icon"
import type { Activity } from "../types/activity"
import { ActivityDetailDialog } from "./activity-detail-dialog"

export function ActivityCard({ activity }: { activity: Activity }) {
  const [open, setOpen] = useState(false)

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
            className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-xs transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        }
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <ActivityIcon name={activity.icon} className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">
            {activity.name}
          </span>
          <span className="block text-xs text-muted-foreground capitalize">
            {activity.suggested_type}
          </span>
        </span>
      </DialogTrigger>
      <ActivityDetailDialog
        activity={activity}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  )
}
