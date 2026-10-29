import type { Todo, TodoPriority } from "../types/todo"
import { todoGroup, type TodoGroup } from "./todo-groups"

const ALL_TODO_GROUPS: TodoGroup[] = [
  "unassigned",
  "assigned",
  "done",
  "skipped",
]

const ALL_TODO_PRIORITIES: TodoPriority[] = ["high", "medium", "low"]

type TodoListFilters = {
  q?: string
  status?: TodoGroup[]
  priority?: TodoPriority[]
}

function filterTodos(todos: Todo[], filters: TodoListFilters): Todo[] {
  const statusSet = new Set(
    filters.status?.length ? filters.status : ALL_TODO_GROUPS
  )
  const prioritySet = new Set(
    filters.priority?.length ? filters.priority : ALL_TODO_PRIORITIES
  )
  const query = filters.q?.trim().toLowerCase() ?? ""

  return todos.filter((todo) => {
    if (!statusSet.has(todoGroup(todo))) return false
    if (!prioritySet.has(todo.priority)) return false
    if (query === "") return true
    const inName = todo.name.toLowerCase().includes(query)
    const inNote = (todo.note ?? "").toLowerCase().includes(query)
    return inName || inNote
  })
}

function filtersAreDefault(filters: TodoListFilters): boolean {
  const hasQuery = Boolean(filters.q?.trim())
  const hasStatus = Boolean(filters.status?.length)
  const hasPriority = Boolean(filters.priority?.length)
  return !hasQuery && !hasStatus && !hasPriority
}

export {
  ALL_TODO_GROUPS,
  ALL_TODO_PRIORITIES,
  filterTodos,
  filtersAreDefault,
  type TodoListFilters,
}
