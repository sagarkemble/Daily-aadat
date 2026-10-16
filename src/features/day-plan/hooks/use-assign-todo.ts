import type { Slot } from "@/features/templates/types/slots"
import type { Todo } from "@/features/todos/types/todo"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { NewDayPlanTodo } from "../types/day-plan"

async function assignTodo({
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
  const dayItem: NewDayPlanTodo = {
    day_plan_id: dayPlanId,
    kind: "todo",
    todo_id: todo.id,
    activity_id: null,
    name_snapshot: todo.name,
    icon_snapshot: todo.icon,
    type: null,
    note_snapshot: null,
    slot,
    sort_order: slotOrder,
    state: "pending",
  }
  const { error } = await supabase.from("day_items").insert(dayItem)
  if (error) throw error
}

export function useAssignTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: assignTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
