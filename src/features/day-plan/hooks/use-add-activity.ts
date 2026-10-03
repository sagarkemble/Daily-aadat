import { supabase } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import type { NewDayPlanActivity } from "../types/day-plan"

async function addActivities(activities: NewDayPlanActivity[]) {
  const { error } = await supabase.from("day_items").insert(activities)
  if (error) throw error
}
export function useAddActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
