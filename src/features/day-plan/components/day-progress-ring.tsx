import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { DayCompletion } from "../lib/day-completion"

const SIZE = 160
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type DayProgressRingProps = {
  completion: DayCompletion
  isLoading?: boolean
}

function DayProgressRing({ completion, isLoading }: DayProgressRingProps) {
  const { done, total } = completion
  const progress = total === 0 ? 0 : done / total
  const offset = CIRCUMFERENCE * (1 - progress)
  const taskLabel = total === 1 ? "task" : "tasks"

  if (isLoading) {
    return (
      <Card size="sm" className="aspect-square w-full">
        <CardContent className="flex flex-1 items-center justify-center">
          <Skeleton className="size-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm" className="aspect-square w-full">
      <CardContent className="flex flex-1">
        <div
          className="relative size-full"
          role="img"
          aria-label={`${done} of ${total} ${taskLabel} done`}
        >
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="size-full -rotate-90"
            aria-hidden
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              className="stroke-muted"
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              className="stroke-primary transition-[stroke-dashoffset] duration-500"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <p className="text-xs font-medium text-muted-foreground">Done</p>
            <p className="font-heading text-3xl leading-none font-medium tabular-nums">
              {done}
            </p>
            <p className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">
              of {total} {taskLabel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { DayProgressRing }
