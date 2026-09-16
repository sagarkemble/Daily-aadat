import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Activity } from "../types/activity"
import { supabase } from "@/lib/supabase"

const activitySelect =
  "id, name, icon, suggested_type, suggested_target, suggested_unit, note, source, user_id"

export async function deleteActivities(id: string) {
  const { data, error } = await supabase
    .from("activities")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id)
    .eq("source", "custom")
    .select(activitySelect)
    .single()

  if (error) throw error
  return data as Activity
}

export function useDeleteActivities() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
    },
  })
}
