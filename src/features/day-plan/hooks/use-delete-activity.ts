import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteActivity(activityId: string) {
  const { error } = await supabase
    .from("day_items")
    .delete()
    .eq("id", activityId)
  if (error) {
    throw error
  }
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
