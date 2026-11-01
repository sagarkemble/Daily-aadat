import type { TodoPriority } from "../types/todo"

const TODO_PRIORITY_LABELS: Record<TodoPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

const TODO_PRIORITY_ORDER: Record<TodoPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

/** Medium is the default priority; dot uses warning token. High/low are exceptions. */
const TODO_PRIORITY_DOT_CLASS: Record<TodoPriority, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/50",
}

export {
  TODO_PRIORITY_DOT_CLASS,
  TODO_PRIORITY_LABELS,
  TODO_PRIORITY_ORDER,
}
