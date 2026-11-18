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
import { Checkbox } from "@/components/ui/checkbox"
import { DONE_CHECKBOX_CLASS } from "@/lib/done-checkbox-class"
import { cn } from "@/lib/utils"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { formatElapsed, useTimedElapsedMs } from "../hooks/use-timed-elapsed"

type ControlProps = {
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
}

function TimedControls({ activity, disabled, onCommand }: ControlProps) {
  const running = activity.state === "running"
  const label = formatElapsed(useTimedElapsedMs(activity))

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
        <AlarmClockIcon className="size-3.5" />
        {label}
      </span>
      <Button
        size="icon-sm"
        variant="outline"
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
        className={cn(round && "p-0")}
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
        className={cn(round && "p-0")}
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

function DoneCheckbox({ activity, disabled, onCommand }: ControlProps) {
  const command: DayItemCommand =
    activity.kind === "todo"
      ? { type: "update_todo" }
      : { type: "toggle_check" }

  return (
    <Checkbox
      checked={activity.state === "done"}
      disabled={disabled}
      onCheckedChange={() => onCommand(activity, command)}
      className={DONE_CHECKBOX_CLASS}
      aria-label="Done"
    />
  )
}

export { CountControls, DoneCheckbox, TimedControls }
