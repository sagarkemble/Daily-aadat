import { TODO_PRIORITY_ORDER } from "./todo-priority"
import type { Todo } from "../types/todo"
import { calendarDayFromDate, dateFromCalendarDay } from "@/features/day-plan/lib/calendar-day"
import { TODO_GROUPS, todoGroup } from "./todo-groups"

function dueSortKey(todo: Todo): number {
  if (!todo.due_date) return Number.MAX_SAFE_INTEGER
  return dateFromCalendarDay(todo.due_date).getTime()
}

function isOpen(todo: Todo) {
  return todo.state === "pending"
}

function compareOpenTodos(a: Todo, b: Todo, today: string) {
  const aOverdue =
    a.due_date &&
    dateFromCalendarDay(a.due_date) < dateFromCalendarDay(today)
  const bOverdue =
    b.due_date &&
    dateFromCalendarDay(b.due_date) < dateFromCalendarDay(today)
  if (aOverdue && !bOverdue) return -1
  if (!aOverdue && bOverdue) return 1

  const dueDiff = dueSortKey(a) - dueSortKey(b)
  if (dueDiff !== 0) return dueDiff

  const priorityDiff =
    TODO_PRIORITY_ORDER[a.priority] - TODO_PRIORITY_ORDER[b.priority]
  if (priorityDiff !== 0) return priorityDiff

  return a.name.localeCompare(b.name)
}

function sortTodosForList(todos: Todo[]): Todo[] {
  const today = calendarDayFromDate(new Date())
  const open = todos.filter(isOpen).sort((a, b) => compareOpenTodos(a, b, today))
  const rest = todos.filter((t) => !isOpen(t))
  return [...open, ...rest]
}

function sortTodosByUpdatedDesc(a: Todo, b: Todo): number {
  return b.updated_at.localeCompare(a.updated_at)
}

function sortTodosInGroup(
  group: "unassigned" | "assigned" | "done" | "skipped",
  todos: Todo[]
): Todo[] {
  if (group === "done" || group === "skipped") {
    return [...todos].sort(sortTodosByUpdatedDesc)
  }
  const today = calendarDayFromDate(new Date())
  return [...todos].sort((a, b) => compareOpenTodos(a, b, today))
}

function sortFilteredTodos(todos: Todo[]): Todo[] {
  const buckets = Object.fromEntries(
    TODO_GROUPS.map((group) => [group, [] as Todo[]])
  )
  for (const todo of todos) {
    buckets[todoGroup(todo)].push(todo)
  }
  return TODO_GROUPS.flatMap((group) => sortTodosInGroup(group, buckets[group]))
}

export { sortFilteredTodos, sortTodosForList, sortTodosInGroup }
