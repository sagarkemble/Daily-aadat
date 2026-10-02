import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function unplanDay(date: string) {
  const { error } = await supabase
    .from("day_plans")
    .delete()
    .eq("plan_date", date)
  if (error) throw error
}

export function useUnplanDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unplanDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
