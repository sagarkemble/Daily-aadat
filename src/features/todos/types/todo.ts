import type { Slot } from "@/features/templates/types/slots"

type TodoState = "pending" | "done" | "skipped"

type TodoAssignment = {
  day_plan_id: string
  plan_date: string
  slot: Slot
}

type Todo = {
  id: string
  name: string
  icon: string
  note: string | null
  state: TodoState
  created_at: string
  updated_at: string
  assignment: TodoAssignment | null
}

export type { Todo, TodoState, TodoAssignment }
