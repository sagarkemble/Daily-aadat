import type { Slot } from "@/features/templates/types/slots"
import type { Todo } from "@/features/todos/types/todo"
import { supabase } from "@/lib/supabase"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TODO_ICON } from "@/features/todos/lib/todo-icon"
import type { NewDayPlanTodo } from "../types/day-plan"
import { ensureDayPlan } from "./ensure-day-plan"
import { nextSlotSortOrder } from "./next-slot-sort-order"

async function assignTodo({
  date,
  todo,
  slot,
  slotOrder,
}: {
  date: string
  todo: Todo
  slot: Slot
  slotOrder?: number
}) {
  const dayPlanId = await ensureDayPlan(date)
  const sortOrder =
    slotOrder ?? (await nextSlotSortOrder(dayPlanId, slot))
  const dayItem: NewDayPlanTodo = {
    day_plan_id: dayPlanId,
    kind: "todo",
    todo_id: todo.id,
    activity_id: null,
    name_snapshot: todo.name,
    icon_snapshot: TODO_ICON,
    type: null,
    note_snapshot: null,
    slot,
    sort_order: sortOrder,
    state: "pending",
  }
  const { error } = await supabase.from("day_items").insert(dayItem)
  if (error) throw error
}

export function useAssignTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: assignTodo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["day-plan", variables.date] })
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
