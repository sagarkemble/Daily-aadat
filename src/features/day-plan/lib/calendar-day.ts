import { format, parse } from "date-fns"

/** ISO calendar day (yyyy-MM-dd) in the user's local timezone. */
function calendarDayFromDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/** Local midnight for an ISO calendar day string. */
function dateFromCalendarDay(calendarDay: string): Date {
  return parse(calendarDay, "yyyy-MM-dd", new Date())
}

export { calendarDayFromDate, dateFromCalendarDay }
