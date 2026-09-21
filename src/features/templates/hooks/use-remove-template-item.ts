import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

async function removeTemplateItem(itemId: string) {
  const { error } = await supabase
    .from("template_items")
    .delete()
    .eq("id", itemId)

  if (error) throw error
}

export function useRemoveTemplateItem(templateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeTemplateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", templateId] })
    },
  })
}
