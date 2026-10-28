import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

async function updateTodoNote({
  id,
  note,
}: {
  id: string
  note: string | null
}) {
  const { error } = await supabase.from("todos").update({ note }).eq("id", id)
  if (error) throw error
}

export function useUpdateTodoNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTodoNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
