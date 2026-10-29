import { supabase } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import type { NewDayPlanActivity } from "../types/day-plan"
import { ensureDayPlan } from "./ensure-day-plan"

async function addActivities({
  date,
  activities,
}: {
  date: string
  activities: Omit<NewDayPlanActivity, "day_plan_id">[]
}) {
  const dayPlanId = await ensureDayPlan(date)
  const rows: NewDayPlanActivity[] = activities.map((activity) => ({
    ...activity,
    day_plan_id: dayPlanId,
  }))
  const { error } = await supabase.from("day_items").insert(rows)
  if (error) throw error
}
export function useAddActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addActivities,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["day-plan", variables.date] })
    },
  })
}
