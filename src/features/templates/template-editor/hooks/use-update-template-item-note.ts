import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"

async function updateTemplateItemNote({
  id,
  note,
}: {
  id: string
  note: string | null
}) {
  const { error } = await supabase
    .from("template_items")
    .update({ note })
    .eq("id", id)
  if (error) throw error
}

export function useUpdateTemplateItemNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTemplateItemNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
