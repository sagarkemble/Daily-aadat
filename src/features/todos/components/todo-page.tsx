import { ListTodoIcon } from "lucide-react"
import { useFetchTodos } from "../hooks/use-fetch-todos"
import { CreateTodoDialog } from "./create-todo-dialog"
import { EmptyTodos } from "./empty-todos"
import { TodoHeader } from "./todo-header"
import { TodoList } from "./todo-list"
import { TodoListSkeleton } from "./todo-list-skeleton"

const TodoPage = () => {
  const { data, isPending, isError, error } = useFetchTodos()

  if (isError) return <div>{error.message}</div>

  const todos = data ?? []
  const showCreate = !isPending && todos.length > 0

  return (
    <div className="flex flex-col gap-4">
      <TodoHeader showCreate={showCreate} />
      {isPending ? (
        <TodoListSkeleton />
      ) : todos.length === 0 ? (
        <EmptyTodos
          title="No todos yet"
          description="Capture something undated, then place it on a planned day."
          icon={<ListTodoIcon />}
        >
          <CreateTodoDialog />
        </EmptyTodos>
      ) : (
        <TodoList todos={todos} />
      )}
    </div>
  )
}

export default TodoPage
