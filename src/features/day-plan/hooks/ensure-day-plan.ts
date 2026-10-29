import { supabase } from "@/lib/supabase"

export async function ensureDayPlan(date: string): Promise<string> {
  const { data, error } = await supabase.rpc("ensure_day_plan", {
    p_plan_date: date,
  })
  if (error) throw error
  if (typeof data !== "string") {
    throw new Error("ensure_day_plan did not return a plan id")
  }
  return data
}
