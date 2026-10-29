import { useEffect, useState } from "react"
import {
  AlarmClockIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
} from "lucide-react"

import { DynamicIcon } from "@/components/dynamic-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"

type ControlProps = {
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}

function TimedControls({ activity, disabled, onCommand }: ControlProps) {
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
  showTarget = false,
  round = false,
}: ControlProps & { showTarget?: boolean; round?: boolean }) {
  const value = activity.count_value ?? 0
  const label =
    showTarget && activity.target != null
      ? `${value} / ${activity.target}`
      : String(value)

  return (
    <div className={cn("flex items-center", round && "gap-2")}>
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(round && "rounded-full p-0")}
        disabled={disabled}
        aria-label="Decrease"
        onClick={() => onCommand(activity, { type: "decrement" })}
      >
        {round ? (
          <DynamicIcon name="minus" size="sm" variant="muted" />
        ) : (
          <MinusIcon />
        )}
      </Button>
      <span
        className={cn(
          "text-center text-sm tabular-nums",
          showTarget ? "min-w-10" : "min-w-6"
        )}
      >
        {label}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(round && "rounded-full p-0")}
        disabled={disabled}
        aria-label="Increase"
        onClick={() => onCommand(activity, { type: "increment" })}
      >
        {round ? (
          <DynamicIcon name="plus" size="sm" variant="muted" />
        ) : (
          <PlusIcon />
        )}
      </Button>
    </div>
  )
}

function CheckControl({
  activity,
  disabled,
  onCommand,
}: ControlProps) {
  const done = activity.state === "done"
  const command: DayItemCommand =
    activity.kind === "todo" ? { type: "update_todo" } : { type: "toggle_check" }

  return (
    <Button
      type="button"
      variant={done ? "secondary" : "outline"}
      size="sm"
      disabled={disabled}
      aria-pressed={done}
      onClick={() => onCommand(activity, command)}
    >
      {done ? "Undo" : "Done"}
    </Button>
  )
}

export { CheckControl, CountControls, TimedControls }
