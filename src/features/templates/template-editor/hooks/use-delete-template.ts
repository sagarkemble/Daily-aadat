import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

async function deleteTemplate(templateId: string) {
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", templateId)

  if (error) throw error
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      navigate({ to: "/templates" })
    },
  })
}
