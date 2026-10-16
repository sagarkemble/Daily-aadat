import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { TodoState } from "../types/todo"

async function changeTodoState({
  id,
  state,
}: {
  id: string
  state: TodoState
}) {
  const { data, error } = await supabase
    .from("todos")
    .update({ state })
    .eq("id", id)
  if (error) throw error
  return data
}

export function useChangeTodoState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: changeTodoState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
