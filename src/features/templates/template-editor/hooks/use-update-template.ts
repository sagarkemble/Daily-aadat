import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { CreateTemplateInput } from "../../types/create-template-input"

type UpdateTemplateInput = CreateTemplateInput & { id: string }

async function updateTemplate({ id, name, description, icon }: UpdateTemplateInput) {
  const { error } = await supabase
    .from("templates")
    .update({ name, description, icon })
    .eq("id", id)

  if (error) throw error
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTemplate,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      queryClient.invalidateQueries({ queryKey: ["templates", variables.id] })
    },
  })
}
