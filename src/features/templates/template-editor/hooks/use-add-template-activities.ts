import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { NewTemplateActivity } from "../../types/template"

async function addTemplateActivities(items: NewTemplateActivity[]) {
  const { error } = await supabase.from("template_items").insert(items)
  if (error) throw error
}

export function useAddTemplateActivities() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addTemplateActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
