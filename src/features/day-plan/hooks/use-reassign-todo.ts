import type { Slot } from "@/features/templates/types/slots"
import type { Todo } from "@/features/todos/types/todo"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"

async function reassignTodo({
  todo,
  dayPlanId,
  slot,
  slotOrder,
}: {
  todo: Todo
  dayPlanId: string
  slot: Slot
  slotOrder: number
}) {
  const { error } = await supabase
    .from("day_items")
    .update({
      day_plan_id: dayPlanId,
      slot,
      sort_order: slotOrder,
      name_snapshot: todo.name,
      icon_snapshot: todo.icon,
    })
    .eq("todo_id", todo.id)
    .eq("kind", "todo")
  if (error) throw error
}

export function useReassignTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reassignTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
