import type { ActivityType } from "@/features/activity/types/activity"
import type { DayPlanStatus } from "./day-plan-status"
import type { Slot } from "@/features/templates/types/slots"

export type State = "pending" | "done" | "skipped" | "running"

type DayPlan = {
  id: string
  plan_date: string
  status: DayPlanStatus
  template_id: string
  ended_at: string | null
  created_at: string
  updated_at: string
}

export type DayPlanActivity = {
  id: string
  day_plan_id: string
  kind: ActivityKind
  activity_id: string | null
  name_snapshot: string
  icon_snapshot: string | null
  type: ActivityType
  target: number | null
  unit: string | null
  slot: Slot
  slot_order: number
  state: State
  started_at: string | null
  stopped_at: string | null
  duration: number | null
  count_value: number | null
  created_at: string
  updated_at: string
  note_snapshot: string | null
}

export type SlotWithActivities = Record<Slot, DayPlanActivity[]>

export type DayPlanWithActivities = DayPlan & {
  activities: SlotWithActivities
}

export type FetchedDayPlan = DayPlan & {
  activities: DayPlanActivity[]
}

export type ActivityKind = "activity" | "todo"

export type { DayPlan }
