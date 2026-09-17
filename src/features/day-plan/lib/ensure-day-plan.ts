import { supabase } from "@/lib/supabase"
import type { DayPlan } from "../types/day-plan"

const PLAN_COLUMNS =
  "id, user_id, plan_date, status, template_id, ended_at, created_at, updated_at"

export async function ensureDayPlan(
  userId: string,
  planDate: string
): Promise<DayPlan> {
  const { data, error } = await supabase
    .from("day_plans")
    .select(PLAN_COLUMNS)
    .eq("user_id", userId)
    .eq("plan_date", planDate)
    .maybeSingle()

  if (error) throw error
  if (data) return data as DayPlan

  const { data: created, error: insertError } = await supabase
    .from("day_plans")
    .insert({
      user_id: userId,
      plan_date: planDate,
      status: "empty",
    })
    .select(PLAN_COLUMNS)
    .single()

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: raced, error: refetchError } = await supabase
        .from("day_plans")
        .select(PLAN_COLUMNS)
        .eq("user_id", userId)
        .eq("plan_date", planDate)
        .single()
      if (refetchError) throw refetchError
      return raced as DayPlan
    }
    throw insertError
  }

  return created as DayPlan
}
