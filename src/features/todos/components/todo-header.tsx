import { CreateTodoDialog } from "./create-todo-dialog"

const TodoHeader = () => {
  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-lg font-medium">Todos</h1>
      <CreateTodoDialog />
    </div>
  )
}

export default TodoHeader
