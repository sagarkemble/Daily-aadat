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

/** Semantic dot colours for priority (not raw palette). */
const TODO_PRIORITY_DOT_CLASS: Record<TodoPriority, string> = {
  high: "bg-destructive",
  medium: "bg-chart-2",
  low: "bg-muted-foreground",
}

export {
  TODO_PRIORITY_DOT_CLASS,
  TODO_PRIORITY_LABELS,
  TODO_PRIORITY_ORDER,
}
