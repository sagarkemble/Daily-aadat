import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { QuoteIcon, TargetIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  calendarDayFromDate,
  dateFromCalendarDay,
} from "../lib/calendar-day"
import { quoteForDate } from "../lib/quotes"
import { DayPlanActions } from "./day-plan-actions"

type DayRailProps = {
  date: string
  isPlanned: boolean
  editing: boolean
  onEditingChange: (editing: boolean) => void
}

function DayRail({
  date,
  isPlanned,
  editing,
  onEditingChange,
}: DayRailProps) {
  const navigate = useNavigate()
  const selected = dateFromCalendarDay(date)

  function handleDateChange(next: Date | undefined) {
    if (!next) {
      return
    }
    navigate({
      to: "/",
      search: { date: calendarDayFromDate(next) },
    })
  }

  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 lg:flex">
      <DayPlanActions
        date={date}
        isPlanned={isPlanned}
        editing={editing}
        onEditingChange={onEditingChange}
      />
      <Card size="sm">
        <CardHeader>
          <CardTitle>{format(selected, "MMMM yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateChange}
            required
            className="w-full bg-transparent p-0"
          />
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="size-4" />
            Today&apos;s focus
          </CardTitle>
          <CardDescription>Stay consistent</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pick the next slot. Finish it. Then the next.
          </p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QuoteIcon className="size-4" />
            Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{quoteForDate(date)}</p>
        </CardContent>
      </Card>
    </aside>
  )
}

export { DayRail }
