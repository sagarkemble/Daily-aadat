import { useEffect, useState } from "react"
import { Feedback } from "@dnd-kit/dom"
import { useSortable } from "@dnd-kit/react/sortable"
import {
  AlarmClockIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
} from "lucide-react"

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
import { cn } from "@/lib/utils"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { DayActivityDetailDialog } from "./day-activity-detail-dialog"

type DayActivityRowProps = {
  id: string
  index: number
  group: string
  activity: DayPlanActivity
  disabled?: boolean
  editing?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
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
  id,
  index,
  group,
  activity,
  disabled,
  editing = false,
  onCommand,
  onUnassign,
}: DayActivityRowProps) {
  const { ref, sourceRef, isDragging } = useSortable({
    id,
    index,
    group,
    type: "activity",
    accept: "activity",
    plugins: (defaults) => [
      ...defaults,
      Feedback.configure({ feedback: "clone" }),
    ],
  })
  const skipped = activity.state === "skipped"
  const target =
    activity.type === "count"
      ? formatCountProgress(activity)
      : formatTimedTarget(activity)
  const note = activity.note_snapshot?.trim()
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <div className="min-w-0">
      <div ref={ref} className={cn("min-w-0", isDragging && "opacity-50")}>
        <Item
          ref={sourceRef}
          variant="default"
          size="sm"
          className="min-w-0 cursor-pointer rounded-none px-3"
          onClick={() => {
            if (!isDragging) setDetailOpen(true)
          }}
        >
          <ItemMedia variant="icon">
            {activity.icon_snapshot ? (
              <DynamicIcon
                name={activity.icon_snapshot}
                size="md"
                variant="muted"
              />
            ) : null}
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="w-full min-w-0">
              {activity.name_snapshot}
            </ItemTitle>
            {target ? <ItemDescription>{target}</ItemDescription> : null}
            {note ? <ItemDescription>{note}</ItemDescription> : null}
          </ItemContent>
          <ItemActions
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
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
          </ItemActions>
        </Item>
      </div>
      <DayActivityDetailDialog
        activity={activity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        editing={editing}
        onUnassign={onUnassign}
      />
    </div>
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
      <span className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
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
