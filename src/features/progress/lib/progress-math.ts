import type {
  ProgressActivity,
  ProgressDay,
} from "../types/progress"

function tickedPlaced(
  days: ProgressDay[],
  activityId?: string | null
): { ticked: number; placed: number } {
  let ticked = 0
  let placed = 0
  for (const day of days) {
    for (const placement of day.placements) {
      if (placement.skipped) continue
      if (activityId && placement.activityId !== activityId) continue
      placed += 1
      if (placement.ticked) ticked += 1
    }
  }
  return { ticked, placed }
}

function dayCompletion(day: ProgressDay): number | null {
  const counted = day.placements.filter((placement) => !placement.skipped)
  if (counted.length === 0) return null
  const ticked = counted.filter((placement) => placement.ticked).length
  return ticked / counted.length
}

function completionLevel(ratio: number | null): 0 | 1 | 2 | 3 | 4 {
  if (ratio == null) return 0
  if (ratio >= 0.99) return 4
  if (ratio >= 0.75) return 3
  if (ratio >= 0.4) return 2
  if (ratio > 0) return 1
  return 1
}

function usedActivities(days: ProgressDay[]): ProgressActivity[] {
  const seen = new Map<string, ProgressActivity>()
  for (const day of days) {
    for (const placement of day.placements) {
      seen.set(placement.activityId, {
        id: placement.activityId,
        name: placement.name,
        icon: placement.icon,
      })
    }
  }
  return [...seen.values()]
}

function activityTickedDays(days: ProgressDay[], activityId: string) {
  return days.filter((day) =>
    day.placements.some(
      (placement) => placement.activityId === activityId && placement.ticked
    )
  ).length
}

function activityPlacedDays(days: ProgressDay[], activityId: string) {
  return days.filter((day) =>
    day.placements.some(
      (placement) =>
        placement.activityId === activityId && !placement.skipped
    )
  ).length
}

function daysInBounds(days: ProgressDay[], start: string, end: string) {
  return days.filter((day) => day.date >= start && day.date <= end)
}

export {
  activityPlacedDays,
  activityTickedDays,
  completionLevel,
  dayCompletion,
  daysInBounds,
  tickedPlaced,
  usedActivities,
}
