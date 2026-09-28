import type { DayPlanStatus } from "./day-plan-status"

type DayPlan = {
  id: string
  plan_date: string
  status: DayPlanStatus
  template_id: string
  ended_at: string | null
  created_at: string
  updated_at: string
}

export type { DayPlan }
