import type { Slot } from "@/features/templates/types/slots"

type TodoState = "pending" | "done" | "skipped"

type TodoPriority = "high" | "medium" | "low"

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
  priority: TodoPriority
  due_date: string | null
  created_at: string
  updated_at: string
  assignment: TodoAssignment | null
}

export type { Todo, TodoState, TodoAssignment, TodoPriority }
