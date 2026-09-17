import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { cn } from "cn"
import { GripVerticalIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActivityIcon } from "@/features/activity/components/activity-icon"
import { formatDuration } from "../lib/format-duration"
import type { DayItem } from "../types/day-plan"
import type { DayItemAction } from "../hooks/use-day-item-action"

type DayItemRowProps = {
  item: DayItem
  locked: boolean
  isEditing?: boolean
  now: number
  isPending?: boolean
  onAction: (action: DayItemAction) => void
  onUndoTimed: (item: DayItem) => void
  onRemove?: (itemId: string) => void
}

export function DayItemRow({
  item,
  locked,
  isEditing = false,
  now,
  isPending = false,
  onAction,
  onUndoTimed,
  onRemove,
}: DayItemRowProps) {
  const name = item.name_snapshot ?? item.title ?? "Untitled"
  const icon = item.icon_snapshot ?? "circle-dashed"
  const disabled = locked || isPending
  const skipped = item.state === "skipped"
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !isEditing })

  const elapsedMs =
    item.state === "running" && item.started_at
      ? now - new Date(item.started_at).getTime()
      : (item.duration_ms ?? 0)

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-background p-2.5",
        isDragging && "relative z-10 opacity-80 shadow-md"
      )}
    >
      {isEditing ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          aria-label={`Reorder ${name}`}
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="size-4" />
        </Button>
      ) : null}
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <ActivityIcon name={icon} className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {subtitle(item, elapsedMs)}
        </p>
      </div>
      {isEditing ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isPending}
          onClick={() => onRemove?.(item.id)}
          aria-label={`Remove ${name}`}
        >
          <Trash2Icon className="size-4" />
        </Button>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          {skipped ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled}
              onClick={() => onAction({ type: "undo", item })}
            >
              Undo skip
            </Button>
          ) : item.type === "check" ? (
            <CheckActions item={item} disabled={disabled} onAction={onAction} />
          ) : item.type === "timed" ? (
            <TimedActions
              item={item}
              disabled={disabled}
              onAction={onAction}
              onUndoTimed={onUndoTimed}
            />
          ) : item.type === "count" ? (
            <CountActions item={item} disabled={disabled} onAction={onAction} />
          ) : null}
        </div>
      )}
    </div>
  )
}

function subtitle(item: DayItem, elapsedMs: number) {
  if (item.state === "skipped") return "Skipped"
  if (item.type === "timed") {
    if (item.state === "running")
      return `Running · ${formatDuration(elapsedMs)}`
    if (item.state === "done") return formatDuration(elapsedMs)
    return "Timed"
  }
  if (item.type === "count") {
    const target = item.target ?? 0
    const unit = item.unit ? ` ${item.unit}` : ""
    return `${item.count_value}/${target}${unit}`
  }
  if (item.state === "done") return "Done"
  return "Check"
}

function CheckActions({
  item,
  disabled,
  onAction,
}: {
  item: DayItem
  disabled: boolean
  onAction: (action: DayItemAction) => void
}) {
  if (item.state === "done") {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAction({ type: "undo", item })}
      >
        Undo
      </Button>
    )
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        disabled={disabled}
        onClick={() => onAction({ type: "done", item })}
      >
        Done
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAction({ type: "skip", item })}
      >
        Skip
      </Button>
    </>
  )
}

function TimedActions({
  item,
  disabled,
  onAction,
  onUndoTimed,
}: {
  item: DayItem
  disabled: boolean
  onAction: (action: DayItemAction) => void
  onUndoTimed: (item: DayItem) => void
}) {
  if (item.state === "running") {
    return (
      <>
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          onClick={() => onAction({ type: "stop", item })}
        >
          Stop
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() => onAction({ type: "cancel-run", item })}
        >
          Cancel
        </Button>
      </>
    )
  }

  if (item.state === "done") {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onUndoTimed(item)}
      >
        Undo
      </Button>
    )
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        disabled={disabled}
        onClick={() => onAction({ type: "start", item })}
      >
        Start
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAction({ type: "skip", item })}
      >
        Skip
      </Button>
    </>
  )
}

function CountActions({
  item,
  disabled,
  onAction,
}: {
  item: DayItem
  disabled: boolean
  onAction: (action: DayItemAction) => void
}) {
  return (
    <>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        disabled={disabled || item.count_value <= 0}
        onClick={() => onAction({ type: "decrement", item })}
        aria-label="Decrease count"
      >
        <MinusIcon />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onAction({ type: "increment", item })}
        aria-label="Increase count"
      >
        <PlusIcon />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={disabled}
        onClick={() => onAction({ type: "skip", item })}
      >
        Skip
      </Button>
    </>
  )
}
