import type { DayStatus, ItemState } from "../types/day-plan"

type StatusSource = {
  state: ItemState
  count_value: number
}

export function deriveDayStatus(items: StatusSource[]): DayStatus {
  if (items.length === 0) return "empty"
  const live = items.some(
    (item) => item.state !== "pending" || item.count_value > 0
  )
  return live ? "in_progress" : "planned"
}

export function pendingCount(items: StatusSource[]): number {
  return items.filter((item) => item.state === "pending").length
}
