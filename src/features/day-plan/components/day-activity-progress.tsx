import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  SkipForwardIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { DONE_CHECKBOX_CLASS } from "@/lib/done-checkbox-class"
import { cn } from "@/lib/utils"
import type { DayItemCommand } from "../lib/day-item-command"
import type { DayPlanActivity } from "../types/day-plan"
import { formatElapsed, useTimedElapsedMs } from "../hooks/use-timed-elapsed"

type DayActivityProgressProps = {
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (command: DayItemCommand) => void
}

function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-4",
        className
      )}
    >
      {children}
    </div>
  )
}

function Readout({
  value,
  caption,
}: {
  value: string
  caption?: string | null
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-heading text-3xl font-medium tracking-tight tabular-nums">
        {value}
      </span>
      {caption ? (
        <span className="text-sm text-muted-foreground">{caption}</span>
      ) : null}
    </div>
  )
}

function TimedProgress({
  activity,
  disabled,
  onCommand,
}: DayActivityProgressProps) {
  const running = activity.state === "running"
  const elapsedMs = useTimedElapsedMs(activity)
  const goalMs = activity.target != null ? activity.target * 60_000 : null
  const percent = goalMs ? Math.min(100, (elapsedMs / goalMs) * 100) : null

  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <Readout
          value={formatElapsed(elapsedMs)}
          caption={activity.target != null ? `of ${activity.target} min` : null}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled || (elapsedMs === 0 && !running)}
            aria-label="Reset timer"
            onClick={() => onCommand({ type: "reset" })}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            disabled={disabled}
            onClick={() => onCommand({ type: running ? "stop" : "start" })}
          >
            {running ? (
              <PauseIcon data-icon="inline-start" />
            ) : (
              <PlayIcon data-icon="inline-start" />
            )}
            {running ? "Pause" : elapsedMs > 0 ? "Resume" : "Start"}
          </Button>
        </div>
      </div>
      {percent != null ? (
        <Progress value={percent} aria-label="Time progress" />
      ) : null}
    </Panel>
  )
}

function CountProgress({
  activity,
  disabled,
  onCommand,
}: DayActivityProgressProps) {
  const value = activity.count_value ?? 0
  const percent =
    activity.target != null && activity.target > 0
      ? Math.min(100, (value / activity.target) * 100)
      : null
  const caption = [
    activity.target != null ? `of ${activity.target}` : null,
    activity.unit,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <Readout value={String(value)} caption={caption || null} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={disabled || value === 0}
            aria-label="Decrease"
            onClick={() => onCommand({ type: "decrement" })}
          >
            <MinusIcon />
          </Button>
          <Button
            size="icon"
            disabled={disabled}
            aria-label="Increase"
            onClick={() => onCommand({ type: "increment" })}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
      {percent != null ? (
        <Progress value={percent} aria-label="Count progress" />
      ) : null}
    </Panel>
  )
}

function CheckProgress({
  activity,
  disabled,
  onCommand,
}: DayActivityProgressProps) {
  const done = activity.state === "done"
  const command: DayItemCommand =
    activity.kind === "todo"
      ? { type: "update_todo" }
      : { type: "toggle_check" }
  const checkboxId = `${activity.id}-done`

  return (
    <Panel className="flex-row items-center justify-between">
      <Field orientation="horizontal" data-disabled={disabled || undefined}>
        <Checkbox
          id={checkboxId}
          checked={done}
          disabled={disabled}
          onCheckedChange={() => onCommand(command)}
          className={DONE_CHECKBOX_CLASS}
        />
        <FieldLabel htmlFor={checkboxId}>
          {done ? "Done" : "Not done yet"}
        </FieldLabel>
      </Field>
    </Panel>
  )
}

function SkippedProgress({ disabled, onCommand }: DayActivityProgressProps) {
  return (
    <Panel className="flex-row items-center justify-between border-dashed bg-transparent">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SkipForwardIcon className="size-4" />
        Skipped for today
      </div>
      <Button
        variant="outline"
        disabled={disabled}
        onClick={() => onCommand({ type: "unskip" })}
      >
        Unskip
      </Button>
    </Panel>
  )
}

function DayActivityProgress(props: DayActivityProgressProps) {
  const { activity } = props
  if (activity.state === "skipped") return <SkippedProgress {...props} />
  return (
    <div className="flex flex-col gap-3">
      {activity.type === "timed" ? <TimedProgress {...props} /> : null}
      {activity.type === "count" ? <CountProgress {...props} /> : null}
      <CheckProgress {...props} />
    </div>
  )
}

export { DayActivityProgress }
