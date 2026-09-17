import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { supabase } from "@/lib/supabase"
import type { Template } from "../types/template"

async function createTemplate(name: string) {
  const user = useAuthStore.getState().user
  if (!user) throw new Error("Not signed in")

  const { data, error } = await supabase
    .from("templates")
    .insert({
      name,
      user_id: user.id,
    })
    .select("id, user_id, name, created_at, updated_at")
    .single()

  if (error) throw error
  return data as Template
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
