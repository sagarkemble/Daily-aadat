import { CreateTodoDialog } from "./create-todo-dialog"

type TodoHeaderProps = {
  showCreate: boolean
}

export function TodoHeader({ showCreate }: TodoHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-lg font-medium">Todos</h1>
      {showCreate ? <CreateTodoDialog /> : null}
    </div>
  )
}
