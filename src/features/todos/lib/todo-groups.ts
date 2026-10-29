import type { Todo } from "../types/todo"

type TodoGroup = "unassigned" | "assigned" | "done" | "skipped"

const TODO_GROUPS: TodoGroup[] = [
  "unassigned",
  "assigned",
  "done",
  "skipped",
]

const TODO_GROUP_LABELS: Record<TodoGroup, string> = {
  unassigned: "Unassigned",
  assigned: "Assigned",
  done: "Done",
  skipped: "Skipped",
}

function todoGroup(todo: Todo): TodoGroup {
  if (todo.state === "skipped") return "skipped"
  if (todo.state === "done") return "done"
  if (todo.assignment) return "assigned"
  return "unassigned"
}

export {
  TODO_GROUP_LABELS,
  TODO_GROUPS,
  todoGroup,
  type TodoGroup,
}
