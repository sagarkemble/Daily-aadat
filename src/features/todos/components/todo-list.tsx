import { ItemGroup } from "@/components/ui/item"
import { toast } from "@/components/ui/toast"
import { useChangeTodoState } from "../hooks/use-change-todo-state"
import { useDeleteTodo } from "../hooks/use-delete-todo"
import type { Todo, TodoState } from "../types/todo"
import { TodoListItem } from "./todo-list-item"

type TodoListProps = {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  const { mutateAsync: changeTodoState, isPending: isChanging } =
    useChangeTodoState()
  const { mutateAsync: deleteTodo, isPending: isDeleting } = useDeleteTodo()
  const disabled = isChanging || isDeleting

  function handleChangeTodoState(todo: Todo, state: TodoState) {
    toast.promise(changeTodoState({ id: todo.id, state }), {
      loading: "Updating todo state...",
      success: "Todo state updated",
      error: "Failed to update todo state",
    })
  }

  function handleDeleteTodo(todo: Todo) {
    toast.promise(deleteTodo(todo.id), {
      loading: "Deleting todo...",
      success: "Todo deleted",
      error: "Failed to delete todo",
    })
  }

  return (
    <ItemGroup>
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          disabled={disabled}
          isDeleting={isDeleting}
          onUpdateTodoState={handleChangeTodoState}
          onDeleteTodo={handleDeleteTodo}
        />
      ))}
    </ItemGroup>
  )
}
