import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { TodoPriority } from "../types/todo"

export type UpdateTodoInput = {
  id: string
  note?: string | null
  priority?: TodoPriority
  due_date?: string | null
}

async function updateTodo(input: UpdateTodoInput) {
  const { id, ...fields } = input
  const patch: Record<string, string | null> = {}
  if (fields.note !== undefined) patch.note = fields.note
  if (fields.priority !== undefined) patch.priority = fields.priority
  if (fields.due_date !== undefined) patch.due_date = fields.due_date

  if (Object.keys(patch).length === 0) return

  const { error } = await supabase.from("todos").update(patch).eq("id", id)
  if (error) throw error
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
    },
  })
}
