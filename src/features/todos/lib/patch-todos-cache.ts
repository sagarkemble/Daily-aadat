import type { QueryClient } from "@tanstack/react-query"

import { todosQueryKey } from "@/lib/query-keys"
import type { Todo, TodoState } from "../types/todo"

function snapshotTodos(queryClient: QueryClient) {
  return queryClient.getQueryData<Todo[]>(todosQueryKey)
}

function restoreTodos(
  queryClient: QueryClient,
  previous: Todo[] | undefined
) {
  if (previous === undefined) return
  queryClient.setQueryData(todosQueryKey, previous)
}

function patchTodoState(
  queryClient: QueryClient,
  id: string,
  state: TodoState
) {
  queryClient.setQueryData<Todo[]>(todosQueryKey, (todos) => {
    if (!todos) return todos
    return todos.map((todo) => (todo.id === id ? { ...todo, state } : todo))
  })
}

export { snapshotTodos, restoreTodos, patchTodoState }
