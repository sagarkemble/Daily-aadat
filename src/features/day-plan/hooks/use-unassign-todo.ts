import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type UnassignTodoInput =
  | string
  | { dayItemId: string }
  | { todoId: string }

async function unassignTodo(input: UnassignTodoInput) {
  if (typeof input === "string") {
    const { error } = await supabase
      .from("day_items")
      .delete()
      .eq("id", input)
      .eq("kind", "todo")
    if (error) throw error
    return
  }

  if ("dayItemId" in input) {
    const { error } = await supabase
      .from("day_items")
      .delete()
      .eq("id", input.dayItemId)
      .eq("kind", "todo")
    if (error) throw error
    return
  }

  const { error } = await supabase
    .from("day_items")
    .delete()
    .eq("todo_id", input.todoId)
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
