import { format } from "date-fns"
import { dateFromCalendarDay } from "@/features/day-plan/lib/calendar-day"
import { SLOT_LABELS } from "@/features/templates/types/slots"
import type { TodoAssignment } from "../types/todo"

export function formatTodoAssignment(assignment: TodoAssignment) {
  const weekday = format(dateFromCalendarDay(assignment.plan_date), "EEE")
  return `${weekday} · ${SLOT_LABELS[assignment.slot]}`
}
