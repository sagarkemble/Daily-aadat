import {
  differenceInCalendarDays,
  format,
  isSameYear,
} from "date-fns"

import { calendarDayFromDate, dateFromCalendarDay } from "@/features/day-plan/lib/calendar-day"
import type { TodoState } from "../types/todo"

export type DueDateTone = "overdue" | "today" | "normal"

export type DueDateDisplay = {
  label: string
  tone: DueDateTone
}

const DUE_DATE_TONE_CLASS: Record<DueDateTone, string> = {
  overdue: "text-destructive",
  today: "text-primary",
  normal: "text-muted-foreground",
}

function dueDateTone(
  dueDate: string,
  state: TodoState,
  today: string
): DueDateTone {
  if (state !== "pending") return "normal"
  const diff = differenceInCalendarDays(
    dateFromCalendarDay(dueDate),
    dateFromCalendarDay(today)
  )
  if (diff < 0) return "overdue"
  if (diff === 0) return "today"
  return "normal"
}

function formatDueDateLabel(dueDate: string, today: string): string {
  const diff = differenceInCalendarDays(
    dateFromCalendarDay(dueDate),
    dateFromCalendarDay(today)
  )
  if (diff === -1) return "Yesterday"
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff >= 2 && diff <= 6) {
    return format(dateFromCalendarDay(dueDate), "EEE")
  }
  const date = dateFromCalendarDay(dueDate)
  const pattern = isSameYear(date, dateFromCalendarDay(today))
    ? "MMM d"
    : "MMM d, yyyy"
  return format(date, pattern)
}

function formatDueDate(
  dueDate: string | null,
  state: TodoState,
  referenceDate: Date = new Date()
): DueDateDisplay | null {
  if (!dueDate) return null
  const today = calendarDayFromDate(referenceDate)
  return {
    label: formatDueDateLabel(dueDate, today),
    tone: dueDateTone(dueDate, state, today),
  }
}

export { DUE_DATE_TONE_CLASS, formatDueDate, formatDueDateLabel }
