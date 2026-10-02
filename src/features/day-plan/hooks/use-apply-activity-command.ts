import { supabase } from "@/lib/supabase"
import type { DayPlanActivity } from "../types/day-plan"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function applyActivityCommand({
  activityId,
  activity,
}: {
  activityId: string
  activity: DayPlanActivity
}) {
  const { data, error } = await supabase
    .from("day_items")
    .update({
      state: activity.state,
      started_at: activity.started_at,
      stopped_at: activity.stopped_at,
      duration_ms: activity.duration,
      count_value: activity.count_value,
    })
    .eq("id", activityId)
  if (error) {
    throw error
  }
  return data
}

export function useApplyActivityCommand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyActivityCommand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
