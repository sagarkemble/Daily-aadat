import { Badge } from "@/components/ui/badge"
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
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react"
import type { DayPlanActivity } from "../types/day-plan"
import type { DayItemCommand } from "../lib/day-item-command"
import { useEffect, useState } from "react"

type DayActivityRowProps = {
  activity: DayPlanActivity
  disabled?: boolean
  onCommand: (activity: DayPlanActivity, command: DayItemCommand) => void
  onDelete: (activityId: string) => void
}

function formatTarget(activity: DayPlanActivity) {
  if (activity.target == null) return null
  return [activity.target, activity.unit].filter(Boolean).join(" ")
}

export function DayActivityRow({
  activity,
  disabled,
  onCommand,
  onDelete,
}: DayActivityRowProps) {
  const target = formatTarget(activity)
  const skipped = activity.state === "skipped"

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          {activity.icon_snapshot ? (
            <DynamicIcon name={activity.icon_snapshot} className="size-4" />
          ) : null}
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name_snapshot}</ItemTitle>
        {target ? <ItemDescription>{target}</ItemDescription> : null}
      </ItemContent>
      <ItemActions>
        {skipped ? (
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onCommand(activity, { type: "unskip" })}
          >
            Unskip
          </Button>
        ) : (
          <>
            {activity.type === "check" ? (
              <Checkbox
                checked={activity.state === "done"}
                disabled={disabled}
                onCheckedChange={() =>
                  onCommand(activity, { type: "toggle_check" })
                }
              />
            ) : null}
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
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onCommand(activity, { type: "skip" })}
            >
              Skip
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          onClick={() => onDelete(activity.id)}
        >
          <TrashIcon />
        </Button>
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
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [running])
  const banked = activity.duration ?? 0
  const session =
    running && activity.started_at
      ? now - new Date(activity.started_at).getTime()
      : 0
  const displayedMs = banked + session

  // 3. Turn ms into "m:ss" right here
  const totalSec = Math.max(0, Math.floor(displayedMs / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  const label = `${m}:${String(s).padStart(2, "0")}`

  return (
    <>
      <Badge variant="outline">{label}</Badge>
      {running ? (
        <Button
          size="sm"
          disabled={disabled}
          onClick={() => onCommand(activity, { type: "stop" })}
        >
          Stop
        </Button>
      ) : (
        <Button
          size="sm"
          disabled={disabled}
          onClick={() => onCommand(activity, { type: "start" })}
        >
          Start
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => onCommand(activity, { type: "reset" })}
      >
        Reset
      </Button>
    </>
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
    <>
      <Button
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={() => onCommand(activity, { type: "decrement" })}
      >
        <MinusIcon />
      </Button>
      <Badge variant="secondary">{activity.count_value ?? 0}</Badge>
      <Button
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={() => onCommand(activity, { type: "increment" })}
      >
        <PlusIcon />
      </Button>
    </>
  )
}
