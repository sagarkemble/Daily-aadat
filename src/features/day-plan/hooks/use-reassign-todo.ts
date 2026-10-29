import type { Slot } from "@/features/templates/types/slots"
import type { Todo } from "@/features/todos/types/todo"
import { TODO_ICON } from "@/features/todos/lib/todo-icon"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ensureDayPlan } from "./ensure-day-plan"
import { nextSlotSortOrder } from "./next-slot-sort-order"

async function reassignTodo({
  todo,
  date,
  slot,
  slotOrder,
}: {
  todo: Todo
  date: string
  slot: Slot
  slotOrder?: number
}) {
  const dayPlanId = await ensureDayPlan(date)
  const sortOrder =
    slotOrder ?? (await nextSlotSortOrder(dayPlanId, slot))
  const { error } = await supabase
    .from("day_items")
    .update({
      day_plan_id: dayPlanId,
      slot,
      sort_order: sortOrder,
      name_snapshot: todo.name,
      icon_snapshot: TODO_ICON,
    })
    .eq("todo_id", todo.id)
    .eq("kind", "todo")
  if (error) throw error
}

export function useReassignTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reassignTodo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["day-plan", variables.date] })
      queryClient.invalidateQueries({ queryKey: ["day-plan"] })
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
