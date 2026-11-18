import { addDays, format, startOfMonth, startOfWeek, subDays, subYears } from "date-fns"

import {
  calendarDayFromDate,
  dateFromCalendarDay,
} from "@/features/day-plan/lib/calendar-day"
import type { DateBounds, ProgressRange } from "../types/progress"

function mondayOf(date: string) {
  return calendarDayFromDate(
    startOfWeek(dateFromCalendarDay(date), { weekStartsOn: 1 })
  )
}

function addCalendarDays(date: string, amount: number) {
  return calendarDayFromDate(addDays(dateFromCalendarDay(date), amount))
}

function yearWindow(today: string): DateBounds {
  const start = mondayOf(
    calendarDayFromDate(subYears(dateFromCalendarDay(today), 1))
  )
  return { start, end: today }
}

function rangeBounds(today: string, range: ProgressRange): DateBounds {
  const todayDate = dateFromCalendarDay(today)
  if (range === "week") {
    return { start: calendarDayFromDate(subDays(todayDate, 6)), end: today }
  }
  if (range === "month") {
    return { start: calendarDayFromDate(startOfMonth(todayDate)), end: today }
  }
  return yearWindow(today)
}

function calendarYearBounds(year: string, today: string): DateBounds {
  const start = `${year}-01-01`
  const yearEnd = `${year}-12-31`
  return { start, end: yearEnd > today ? today : yearEnd }
}

function isFullCalendarYear(bounds: DateBounds, today: string) {
  const year = bounds.start.slice(0, 4)
  if (bounds.start !== `${year}-01-01`) return false
  const expected = calendarYearBounds(year, today)
  return bounds.end === expected.end
}

function weeksBetween(start: string, end: string) {
  const gridStart = mondayOf(start)
  const weeks: string[][] = []
  let cursor = gridStart
  let week: string[] = []
  while (cursor <= end || week.length > 0) {
    week.push(cursor)
    if (week.length === 7) {
      weeks.push(week)
      week = []
      if (cursor >= end) break
    }
    cursor = addCalendarDays(cursor, 1)
    if (cursor > end && week.length === 0) break
  }
  if (week.length) weeks.push(week)
  return weeks
}

function weeksForYear(today: string) {
  const { start, end } = yearWindow(today)
  return weeksBetween(start, end)
}

function weeksForCalendarYear(year: string, today: string) {
  const { start, end } = calendarYearBounds(year, today)
  return weeksBetween(start, end)
}

function monthLabelsForWeeks(weeks: string[][]) {
  let prev = ""
  return weeks.map((week) => {
    const key = week.find((date) => date.slice(0, 7) !== prev)
    if (!key) return ""
    const ym = key.slice(0, 7)
    if (ym === prev) return ""
    prev = ym
    return format(dateFromCalendarDay(key), "MMM")
  })
}

function prettyRangeDate(date: string) {
  return format(dateFromCalendarDay(date), "MMM d, yyyy")
}

export {
  calendarYearBounds,
  isFullCalendarYear,
  monthLabelsForWeeks,
  prettyRangeDate,
  rangeBounds,
  weeksForCalendarYear,
  weeksForYear,
  yearWindow,
}
