import { useQuery } from "@tanstack/react-query"
import type { Slot } from "@/features/templates/types/slots"
import { supabase } from "@/lib/supabase"
import type { Todo, TodoAssignment, TodoState } from "../types/todo"

type FetchedPlacement = {
  day_plan_id: string
  slot: Slot
  day_plans: { plan_date: string } | null
}

type FetchedTodo = {
  id: string
  name: string
  icon: string
  note: string | null
  state: TodoState
  priority: Todo["priority"]
  due_date: string | null
  created_at: string
  updated_at: string
  day_items: FetchedPlacement | FetchedPlacement[] | null
}

function firstPlacement(
  dayItems: FetchedTodo["day_items"]
): FetchedPlacement | undefined {
  if (!dayItems) return undefined
  return Array.isArray(dayItems) ? dayItems[0] : dayItems
}

function assignmentFromRow(row: FetchedTodo): TodoAssignment | null {
  const placement = firstPlacement(row.day_items)
  const planDate = placement?.day_plans?.plan_date
  if (!placement || !planDate) return null

  return {
    day_plan_id: placement.day_plan_id,
    plan_date: planDate,
    slot: placement.slot,
  }
}

function toTodo(row: FetchedTodo): Todo {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    note: row.note,
    state: row.state,
    priority: row.priority,
    due_date: row.due_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
    assignment: assignmentFromRow(row),
  }
}

async function fetchTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select(
      `
      id,
      name,
      icon,
      note,
      state,
      priority,
      due_date,
      created_at,
      updated_at,
      day_items (
        day_plan_id,
        slot,
        day_plans (
          plan_date
        )
      )
    `
    )
    .order("name")

  if (error) throw error

  const rows = (data ?? []) as unknown as FetchedTodo[]
  return rows.map(toTodo)
}

export function useFetchTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })
}
