import type { ActivityType } from "@/features/activity/types/activity"
import type { Slot } from "@/features/templates/types/slots"

export type DayStatus = "empty" | "planned" | "in_progress" | "ended"
export type ItemState = "pending" | "done" | "skipped" | "running"
export type ItemKind = "activity" | "todo"
export type DaySlot = Slot | "unslotted"

export type DayPlanTemplate = {
  id: string
  name: string
}

export type DayPlan = {
  id: string
  user_id: string
  plan_date: string
  status: DayStatus
  template_id: string | null
  ended_at: string | null
  created_at: string
  updated_at: string
  templates: DayPlanTemplate | null
}

export type DayItem = {
  id: string
  day_plan_id: string
  kind: ItemKind
  activity_id: string | null
  title: string | null
  name_snapshot: string | null
  icon_snapshot: string | null
  type: ActivityType | null
  target: number | null
  unit: string | null
  slot: DaySlot
  sort_order: number
  state: ItemState
  started_at: string | null
  stopped_at: string | null
  duration_ms: number | null
  count_value: number
  created_at: string
  updated_at: string
}

export type DayPlanDetail = {
  plan: DayPlan | null
  items: DayItem[]
}
