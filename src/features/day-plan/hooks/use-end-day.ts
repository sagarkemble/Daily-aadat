import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function endDay(date: string) {
  const { data, error } = await supabase
    .from("day_plans")
    .update({
      status: "ended",
      ended_at: new Date().toISOString(),
    })
    .eq("plan_date", date)
  if (error) {
    throw error
  }
  return data
}

export function useEndDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: endDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
