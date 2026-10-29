import type { DayBoard } from "../types/day-plan"

export function dayHasPlacements(board: DayBoard | undefined): boolean {
  if (!board) return false
  return Object.values(board).some((slot) => slot.activities.length > 0)
}
