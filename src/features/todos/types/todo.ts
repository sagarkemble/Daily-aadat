type TodoState = "pending" | "done" | "skipped"

type Todo = {
  id: string
  name: string
  icon: string
  state: TodoState
  created_at: string
  updated_at: string
}

export type { Todo, TodoState }
