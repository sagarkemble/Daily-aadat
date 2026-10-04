import { supabase } from "@/lib/supabase"
import type { DayPlanActivity } from "../types/day-plan"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type ReorderedDayPlanActivity = DayPlanActivity & {
  sort_order: number
}

async function reorderDayPlanActivities(
  activities: ReorderedDayPlanActivity[]
) {
  const results = await Promise.all(
    activities.map((activity) =>
      supabase
        .from("day_items")
        .update({ sort_order: activity.sort_order })
        .eq("id", activity.id)
    )
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) throw failed.error
}

export function useReorderDayPlanActivities() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reorderDayPlanActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
