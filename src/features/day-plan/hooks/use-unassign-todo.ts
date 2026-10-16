import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function unassignTodo(dayItemId: string) {
  const { error } = await supabase
    .from("day_items")
    .delete()
    .eq("id", dayItemId)
    .eq("kind", "todo")
  if (error) throw error
}

export function useUnassignTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unassignTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
