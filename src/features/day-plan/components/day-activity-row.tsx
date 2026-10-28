import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { DynamicIcon } from "@/components/dynamic-icon"
import {
  AlarmClockIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { useEffect, useState } from "react"
import { DayActivityNote } from "./day-activity-note"

type DayActivityRowProps = {
  activity: DayPlanActivity
  disabled?: boolean
  editing?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
  onDelete: (activityId: string) => void
  onUnassign: (activityId: string) => void
}

function formatCountProgress(activity: DayPlanActivity) {
  if (activity.target == null) return null
  const value = activity.count_value ?? 0
  const ofTarget = `${value} of ${activity.target}`
  if (!activity.unit) return ofTarget
  return `${ofTarget} ${activity.unit}`
}

function formatTimedTarget(activity: DayPlanActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

export function DayActivityRow({
  activity,
  disabled,
  editing = false,
  onCommand,
  onDelete,
  onUnassign,
}: DayActivityRowProps) {
  const skipped = activity.state === "skipped"
  const description =
    activity.type === "count"
      ? formatCountProgress(activity)
      : formatTimedTarget(activity)

  return (
    <Item
      variant="default"
      size="sm"
      className="min-w-0 flex-nowrap rounded-none px-0"
    >
      <ItemMedia>
        {activity.icon_snapshot ? (
          <DynamicIcon
            name={activity.icon_snapshot}
            className="size-5 text-foreground"
          />
        ) : null}
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="min-w-0 w-full">
          {activity.name_snapshot}
        </ItemTitle>
        {description ? (
          <ItemDescription>{description}</ItemDescription>
        ) : null}
        {activity.kind === "activity" ? (
          <DayActivityNote
            itemId={activity.id}
            note={activity.note_snapshot}
          />
        ) : null}
      </ItemContent>
      <ItemActions className="shrink-0">
        {skipped ? (
          editing ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onCommand(activity, { type: "unskip" })}
            >
              Unskip
            </Button>
          ) : null
        ) : (
          <>
            {activity.type === "timed" ? (
              <TimedControls
                activity={activity}
                disabled={disabled}
                onCommand={onCommand}
              />
            ) : null}
            {activity.type === "count" ? (
              <CountControls
                activity={activity}
                disabled={disabled}
                onCommand={onCommand}
              />
            ) : null}
            {activity.kind === "todo" ? (
              <Checkbox
                checked={activity.state === "done"}
                disabled={disabled}
                onCheckedChange={() =>
                  onCommand(activity, { type: "update_todo" })
                }
              />
            ) : null}
            {activity.type === "check" ? (
              <Checkbox
                checked={activity.state === "done"}
                disabled={disabled}
                onCheckedChange={() =>
                  onCommand(activity, { type: "toggle_check" })
                }
              />
            ) : null}
            {editing ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => onCommand(activity, { type: "skip" })}
              >
                Skip
              </Button>
            ) : null}
          </>
        )}
        {editing && activity.kind === "todo" ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onUnassign(activity.id)}
          >
            Unassign
          </Button>
        ) : null}
        {editing && activity.kind !== "todo" ? (
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={() => onDelete(activity.id)}
          >
            <TrashIcon />
          </Button>
        ) : null}
      </ItemActions>
    </Item>
  )
}

function TimedControls({
  activity,
  disabled,
  onCommand,
}: {
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}) {
  const running = activity.state === "running"
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  const banked = activity.duration ?? 0
  const session =
    running && activity.started_at
      ? Date.now() - new Date(activity.started_at).getTime()
      : 0
  const displayedMs = banked + Math.max(0, session)

  const totalSec = Math.max(0, Math.floor(displayedMs / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  const label = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
        <AlarmClockIcon className="size-3.5" />
        {label}
      </span>
      <Button
        size="icon-sm"
        className="rounded-full"
        disabled={disabled}
        aria-label={running ? "Pause" : "Play"}
        onClick={() =>
          onCommand(activity, { type: running ? "stop" : "start" })
        }
      >
        {running ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label="Reset"
        onClick={() => onCommand(activity, { type: "reset" })}
      >
        <RotateCcwIcon />
      </Button>
    </div>
  )
}

function CountControls({
  activity,
  disabled,
  onCommand,
}: {
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}) {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label="Decrease"
        onClick={() => onCommand(activity, { type: "decrement" })}
      >
        <MinusIcon />
      </Button>
      <span className="min-w-6 text-center text-sm tabular-nums">
        {activity.count_value ?? 0}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label="Increase"
        onClick={() => onCommand(activity, { type: "increment" })}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
