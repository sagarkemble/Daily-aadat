import { supabase } from "@/lib/supabase"
import type { Activity } from "../types/activity"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const activitySelect =
  "id, name, icon, suggested_type, suggested_target, suggested_unit, note, source, user_id"

export async function updateActivities(activity: Activity) {
  const { data, error } = await supabase
    .from("activities")
    .update({
      name: activity.name,
      icon: activity.icon,
      suggested_type: activity.suggested_type,
      suggested_target: activity.suggested_target,
      suggested_unit: activity.suggested_unit,
      note: activity.note,
    })
    .eq("id", activity.id)
    .eq("source", "custom")
    .select(activitySelect)
    .single()

  if (error) {
    if (error.code === "23505") throw new Error("Activity already exists")
    throw error
  }
  return data as Activity
}

export function useUpdateActivities() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  })
}
