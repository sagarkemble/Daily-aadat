import { supabase } from "@/lib/supabase"
import { deriveDayStatus } from "./day-status"

export async function syncDayPlanStatus(
  planId: string,
  options?: { force?: "ended" | "in_progress" }
) {
  if (options?.force === "ended") {
    const { error } = await supabase
      .from("day_plans")
      .update({
        status: "ended",
        ended_at: new Date().toISOString(),
      })
      .eq("id", planId)
    if (error) throw error
    return
  }

  if (options?.force === "in_progress") {
    const { error } = await supabase
      .from("day_plans")
      .update({
        status: "in_progress",
        ended_at: null,
      })
      .eq("id", planId)
    if (error) throw error
    return
  }

  const { data: plan, error: planError } = await supabase
    .from("day_plans")
    .select("status")
    .eq("id", planId)
    .single()

  if (planError) throw planError
  if (plan.status === "ended") return

  const { data: items, error: itemsError } = await supabase
    .from("day_items")
    .select("state, count_value")
    .eq("day_plan_id", planId)

  if (itemsError) throw itemsError

  const next = deriveDayStatus(items ?? [])
  if (next === plan.status) return

  const { error } = await supabase
    .from("day_plans")
    .update({
      status: next,
      ended_at: null,
    })
    .eq("id", planId)

  if (error) throw error
}
