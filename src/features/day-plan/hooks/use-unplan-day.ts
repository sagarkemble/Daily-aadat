import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type UnplanDayMode = "keepTodos" | "sendToPile"

async function unplanDay({
  date,
  mode,
}: {
  date: string
  mode: UnplanDayMode
}) {
  const { data: plan, error: fetchError } = await supabase
    .from("day_plans")
    .select("id")
    .eq("plan_date", date)
    .maybeSingle()
  if (fetchError) throw fetchError
  if (!plan) return

  if (mode === "sendToPile") {
    const { error } = await supabase
      .from("day_plans")
      .delete()
      .eq("plan_date", date)
    if (error) throw error
    return
  }

  const { error: deleteActivitiesError } = await supabase
    .from("day_items")
    .delete()
    .eq("day_plan_id", plan.id)
    .eq("kind", "activity")
  if (deleteActivitiesError) throw deleteActivitiesError

  const { error: deleteTimesError } = await supabase
    .from("day_plan_slot_times")
    .delete()
    .eq("day_plan_id", plan.id)
  if (deleteTimesError) throw deleteTimesError

  const { error: updateError } = await supabase
    .from("day_plans")
    .update({ template_id: null })
    .eq("id", plan.id)
  if (updateError) throw updateError
}

export function useUnplanDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unplanDay,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["day-plan", variables.date] })
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
