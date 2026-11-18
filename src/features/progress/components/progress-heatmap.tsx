import { useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  isFullCalendarYear,
  monthLabelsForWeeks,
  prettyRangeDate,
  weeksForCalendarYear,
  weeksForYear,
  yearWindow,
} from "../lib/progress-calendar"
import { completionLevel, dayCompletion } from "../lib/progress-math"
import type { DateBounds, ProgressDay } from "../types/progress"

const LEVEL_CLASS = [
  "border-input bg-muted",
  "border-success/40 bg-success/40",
  "border-success/70 bg-success/70",
  "border-success bg-success",
  "border-success bg-[color-mix(in_oklch,var(--success),oklch(0.78_0.2_145))]",
] as const

const FILTER_TICKED = LEVEL_CLASS[4]
const FILTER_NOT_TICKED =
  "border-transparent bg-[color-mix(in_oklch,var(--destructive)_28%,var(--muted))]"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const CELL =
  "size-4 shrink-0 rounded-xs border outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

function cellSummary(
  day: ProgressDay | undefined,
  filterId: string | null
) {
  if (filterId != null) {
    const placed = day?.placements.find(
      (placement) =>
        placement.activityId === filterId && !placement.skipped
    )
    if (!placed) return "Not placed"
    return placed.ticked ? "Ticked" : "Not ticked"
  }
  if (!day) return "No activities on this day"
  const counted = day.placements.filter((placement) => !placement.skipped)
  if (counted.length === 0) return "No activities on this day"
  const ticked = counted.filter((placement) => placement.ticked).length
  const noun = counted.length === 1 ? "activity" : "activities"
  return `${ticked} of ${counted.length} ${noun} completed`
}

type ProgressHeatmapProps = {
  today: string
  bounds: DateBounds
  daysByDate: Map<string, ProgressDay>
  filterId: string | null
  onYearClick: (year: string) => void
}

function ProgressHeatmap({
  today,
  bounds,
  daysByDate,
  filterId,
  onYearClick,
}: ProgressHeatmapProps) {
  const navigate = useNavigate()
  const selectedCalendarYear = isFullCalendarYear(bounds, today)
    ? bounds.start.slice(0, 4)
    : null
  const weeks = selectedCalendarYear
    ? weeksForCalendarYear(selectedCalendarYear, today)
    : weeksForYear(today)
  const monthLabels = monthLabelsForWeeks(weeks)
  const yearStart = selectedCalendarYear
    ? `${selectedCalendarYear}-01-01`
    : yearWindow(today).start
  const years = [
    ...new Set(
      weeksForYear(today).flatMap((week) =>
        week.map((date) => date.slice(0, 4))
      )
    ),
  ].reverse()

  function inFocus(date: string) {
    if (date > today || date < yearStart) return false
    return date >= bounds.start && date <= bounds.end
  }

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-start gap-3">
          <div className="flex shrink-0 flex-col gap-1">
            <span className="h-5" aria-hidden />
            {DAY_LABELS.map((label) => (
              <span
                key={label}
                className="flex h-4 w-10 items-center leading-none text-xs text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="flex min-w-max flex-col gap-1">
              <div className="flex gap-1">
                {monthLabels.map((label, i) => (
                  <span
                    key={`m-${weeks[i]?.[0] ?? i}`}
                    className="h-5 w-4 overflow-visible text-xs leading-none whitespace-nowrap text-muted-foreground"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <TooltipProvider delay={200}>
              <div className="flex gap-1">
                {weeks.map((week) => (
                  <div key={week[0]} className="flex flex-col gap-1">
                    {week.map((date) => {
                      const past = date >= yearStart && date <= today
                      const day = past ? daysByDate.get(date) : undefined
                      const focused = inFocus(date)
                      const ratio = day ? dayCompletion(day) : null
                      const activityPlacements =
                        filterId == null
                          ? []
                          : (day?.placements.filter(
                              (placement) =>
                                placement.activityId === filterId
                            ) ?? [])
                      const activityTicked = activityPlacements.some(
                        (placement) => placement.ticked
                      )
                      const activityNotTicked =
                        !activityTicked &&
                        activityPlacements.some(
                          (placement) => !placement.skipped
                        )
                      const level = day ? completionLevel(ratio) : 0
                      const fillClass = !past
                        ? "border-transparent bg-transparent"
                        : filterId != null
                          ? activityTicked
                            ? FILTER_TICKED
                            : activityNotTicked
                              ? FILTER_NOT_TICKED
                              : LEVEL_CLASS[0]
                          : day
                            ? LEVEL_CLASS[level]
                            : LEVEL_CLASS[0]
                      const summary = cellSummary(day, filterId)
                      if (!past) {
                        return (
                          <span
                            key={date}
                            className={cn(CELL, fillClass)}
                          />
                        )
                      }
                      return (
                        <Tooltip key={date}>
                          <TooltipTrigger
                            render={
                              <button
                                type="button"
                                aria-label={`${prettyRangeDate(date)}. ${summary}`}
                                className={cn(
                                  CELL,
                                  fillClass,
                                  !focused && "opacity-20"
                                )}
                                onClick={() =>
                                  void navigate({
                                    to: "/",
                                    search: { date },
                                  })
                                }
                              />
                            }
                          />
                          <TooltipContent className="flex flex-col gap-0.5 text-left">
                            <span className="font-medium">
                              {prettyRangeDate(date)}
                            </span>
                            <span>{summary}</span>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </div>
              </TooltipProvider>
              <div className="mt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                {filterId == null ? (
                  <>
                    Less
                    {LEVEL_CLASS.map((tone) => (
                      <span key={tone} className={cn(CELL, tone)} />
                    ))}
                    More
                  </>
                ) : (
                  <>
                    Not ticked
                    <span className={cn(CELL, FILTER_NOT_TICKED)} />
                    <span className={cn(CELL, FILTER_TICKED)} />
                    Ticked
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-12 shrink-0 flex-col gap-2">
            <span className="h-5" aria-hidden />
            {years.map((year) => (
              <Button
                key={year}
                type="button"
                variant="ghost"
                size="xs"
                aria-pressed={selectedCalendarYear === year}
                className={cn(
                  "h-auto px-0 tabular-nums",
                  selectedCalendarYear === year ||
                    (selectedCalendarYear == null &&
                      year === today.slice(0, 4))
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => onYearClick(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ProgressHeatmap }
