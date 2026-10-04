import { supabase } from "@/lib/supabase"
import type { TemplateActivity } from "../../types/template"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function reorderTemplateActivities(activities: TemplateActivity[]) {
  const { error } = await supabase.from("template_items").upsert(
    activities.map((activity) => ({
      id: activity.id,
      template_id: activity.template_id,
      activity_id: activity.activity_id,
      type: activity.type,
      target: activity.target,
      unit: activity.unit,
      slot: activity.slot,
      sort_order: activity.sort_order,
    })),
    { onConflict: "id" }
  )
  if (error) throw error
}

export function useReorderTemplateActivities() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reorderTemplateActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
