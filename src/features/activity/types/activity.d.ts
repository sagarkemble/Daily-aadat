export type ActivityType = "check" | "timed" | "count"
export type ActivitySource = "predefined" | "custom"

export type Activity = {
  id: string
  user_id: string | null
  name: string
  icon: string
  suggested_type: ActivityType
  suggested_target: number | null
  suggested_unit: string | null
  note: string | null
  source: ActivitySource
}
