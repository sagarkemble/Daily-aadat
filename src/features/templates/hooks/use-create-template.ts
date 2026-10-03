import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { supabase } from "@/lib/supabase"
import type { Template } from "../types/template"
import type { CreateTemplateInput } from "../types/create-template-input"

async function createTemplate(input: CreateTemplateInput) {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { error } = await supabase.from("templates").insert({
    name: input.name,
    icon: input.icon,
    description: input.description,
    user_id: user.id,
  })

  if (error) throw error
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })
}
