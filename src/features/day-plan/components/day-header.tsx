import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DayStatus } from "../types/day-plan"

type DayHeaderProps = {
  heading: string
  isToday: boolean
  templateName: string
  status: DayStatus
  locked: boolean
  isEditing: boolean
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onApply: () => void
  onEdit: () => void
  onUnplan: () => void
  onEnd: () => void
  onReopen: () => void
}

const STATUS_LABEL: Record<DayStatus, string | null> = {
  empty: null,
  planned: "Planned",
  in_progress: "In progress",
  ended: "Ended",
}

export function DayHeader({
  heading,
  isToday,
  templateName,
  status,
  locked,
  isEditing,
  onPrev,
  onNext,
  onToday,
  onApply,
  onEdit,
  onUnplan,
  onEnd,
  onReopen,
}: DayHeaderProps) {
  const statusLabel = STATUS_LABEL[status]
  const canShape = !locked && status !== "empty"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onPrev}
            aria-label="Previous day"
          >
            <ChevronLeftIcon />
          </Button>
          <h1 className="min-w-40 text-center text-lg font-semibold">
            {heading}
          </h1>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onNext}
            aria-label="Next day"
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {!isToday ? (
            <Button type="button" variant="outline" size="sm" onClick={onToday}>
              Today
            </Button>
          ) : null}
          {locked ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReopen}
            >
              Re-open
            </Button>
          ) : isEditing ? (
            <Button type="button" size="sm" onClick={onEdit}>
              Done
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEnd}
              disabled={status === "empty"}
            >
              End day
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg border bg-background px-2.5 py-1 text-sm hover:bg-muted disabled:opacity-50"
          disabled={locked}
          onClick={onApply}
        >
          {templateName}
        </button>
        {statusLabel ? (
          <span className="text-xs text-muted-foreground">{statusLabel}</span>
        ) : null}
        {canShape && !isEditing ? (
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            Edit day
          </Button>
        ) : null}
        {canShape ? (
          <Button type="button" variant="ghost" size="sm" onClick={onUnplan}>
            Unplan day
          </Button>
        ) : null}
      </div>
    </div>
  )
}
