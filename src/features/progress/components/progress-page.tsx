import { useMemo, useState } from "react"
import { CalendarIcon, ChartColumnIcon, ChevronDownIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { DynamicIcon } from "@/components/dynamic-icon"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  calendarDayFromDate,
  dateFromCalendarDay,
} from "@/features/day-plan/lib/calendar-day"
import { cn } from "@/lib/utils"
import { useFetchProgress } from "../hooks/use-fetch-progress"
import {
  calendarYearBounds,
  prettyRangeDate,
  rangeBounds,
  yearWindow,
} from "../lib/progress-calendar"
import {
  activityPlacedDays,
  activityTickedDays,
  dayCompletion,
  daysInBounds,
  tickedPlaced,
  usedActivities,
} from "../lib/progress-math"
import type { DateBounds, ProgressRange } from "../types/progress"
import { ProgressHeatmap } from "./progress-heatmap"
import { ProgressPageSkeleton } from "./progress-page-skeleton"

function ProgressPage() {
  const today = calendarDayFromDate(new Date())
  const [range, setRange] = useState<ProgressRange>("month")
  const [customRange, setCustomRange] = useState<DateBounds | null>(null)
  const [rangeOpen, setRangeOpen] = useState(false)
  const [filterId, setFilterId] = useState<string | null>(null)
  const bounds = customRange ?? rangeBounds(today, range)
  const yearStart = yearWindow(today).start
  const fetchStart = bounds.start < yearStart ? bounds.start : yearStart
  const { data, isPending, isError, error } = useFetchProgress(
    fetchStart,
    today
  )
  const daysByDate = useMemo(() => {
    const map = new Map(
      (data ?? []).map((day) => [day.date, day] as const)
    )
    return map
  }, [data])
  const days = daysInBounds(data ?? [], bounds.start, bounds.end)
  const used = usedActivities(days)
  const pickerValue: DateRange = {
    from: dateFromCalendarDay(bounds.start),
    to: dateFromCalendarDay(bounds.end),
  }
  const scored = days
    .map(dayCompletion)
    .filter((ratio): ratio is number => ratio != null)
  const avg =
    scored.length === 0
      ? null
      : Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 100)
  const daysLogged = days.filter((day) => day.placements.length > 0).length
  const tickPlace = tickedPlaced(days, filterId)

  function setRangeValue(next: string[]) {
    const picked = next[0]
    if (picked === "week" || picked === "month" || picked === "year") {
      setRange(picked)
      setCustomRange(null)
      setFilterId(null)
    }
  }

  function onPickRange(next: DateRange | undefined) {
    if (!next?.from) return
    const start = calendarDayFromDate(next.from)
    const end = calendarDayFromDate(next.to ?? next.from)
    setCustomRange({ start, end })
    setFilterId(null)
    if (next.to) setRangeOpen(false)
  }

  function onYearClick(year: string) {
    setCustomRange(calendarYearBounds(year, today))
    setFilterId(null)
  }

  if (isError) return <div>{error.message}</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <PageHeader title="Analytics" />
        <div className="flex flex-wrap items-center gap-3">
          <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
            <PopoverTrigger
              render={<Button variant="outline" className="tabular-nums" />}
            >
              <CalendarIcon data-icon="inline-start" />
              {prettyRangeDate(bounds.start)} - {prettyRangeDate(bounds.end)}
              <ChevronDownIcon data-icon="inline-end" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={pickerValue}
                onSelect={onPickRange}
                disabled={{ after: dateFromCalendarDay(today) }}
                defaultMonth={pickerValue.from}
              />
            </PopoverContent>
          </Popover>
          <ToggleGroup
            variant="outline"
            value={customRange ? [] : [range]}
            onValueChange={setRangeValue}
          >
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="year">Year</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {isPending ? (
        <ProgressPageSkeleton />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Days logged</CardDescription>
                <CardTitle className="font-heading text-3xl tabular-nums">
                  {daysLogged}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Ticked/placed</CardDescription>
                <CardTitle className="font-heading text-3xl tabular-nums">
                  {tickPlace.ticked} of {tickPlace.placed}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Average completion</CardDescription>
                <CardTitle className="font-heading text-3xl tabular-nums">
                  {avg == null ? "—" : `${avg}%`}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardDescription>Activities used</CardDescription>
                <CardTitle className="font-heading text-3xl tabular-nums">
                  {used.length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <ProgressHeatmap
            today={today}
            bounds={bounds}
            daysByDate={daysByDate}
            filterId={filterId}
            onYearClick={onYearClick}
          />

          {used.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ChartColumnIcon />
                </EmptyMedia>
                <EmptyTitle>No activities in this range</EmptyTitle>
                <EmptyDescription>
                  Open a day and place activities to see them here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium">Used in this range</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {used.map((activity) => {
                  const ticked = activityTickedDays(days, activity.id)
                  const placed = activityPlacedDays(days, activity.id)
                  const isOn = filterId === activity.id
                  return (
                    <button
                      key={activity.id}
                      type="button"
                      aria-pressed={isOn}
                      className="rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      onClick={() =>
                        setFilterId((id) =>
                          id === activity.id ? null : activity.id
                        )
                      }
                    >
                      <Card
                        size="sm"
                        className={cn(
                          "h-full hover:bg-surface-hover-card",
                          isOn && "bg-muted ring-2 ring-ring"
                        )}
                      >
                        <CardHeader className="flex flex-row items-center gap-3">
                          <DynamicIcon
                            name={activity.icon}
                            size="md"
                            variant="muted"
                          />
                          <CardTitle className="min-w-0 flex-1 truncate">
                            {activity.name}
                          </CardTitle>
                          <CardDescription className="text-xs tabular-nums">
                            {ticked}/{placed}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { ProgressPage }
