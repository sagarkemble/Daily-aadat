export type ActivityType = "check" | "timed" | "count"
export type ActivitySource = "predefined" | "custom"

export const activityTypeLabels: Record<ActivityType, string> = {
  check: "Check",
  timed: "Timed",
  count: "Count",
}

export const activityTypeItems: {
  label: string
  value: ActivityType
}[] = [
  { label: activityTypeLabels.check, value: "check" },
  { label: activityTypeLabels.timed, value: "timed" },
  { label: activityTypeLabels.count, value: "count" },
]

export type Activity = {
  id: string
  user_id: string | null
  name: string
  icon: string
  suggested_type: ActivityType
  suggested_target: number | null
  suggested_unit: string | null
  source: ActivitySource
}
