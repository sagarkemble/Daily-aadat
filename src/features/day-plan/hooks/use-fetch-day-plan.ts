import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import type { DayPlan } from "../types/day-plan"

async function fetchDayPlan(date: string) {
  const { data, error } = await supabase
    .from("day_plans")
    .select("*")
    .eq("plan_date", date)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as DayPlan | null
}

function useFetchDayPlan(date: string) {
  return useQuery({
    queryKey: ["day-plan", date],
    queryFn: () => fetchDayPlan(date),
  })
}

export { useFetchDayPlan }
