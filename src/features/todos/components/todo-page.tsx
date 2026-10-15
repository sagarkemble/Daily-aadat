import TodoHeader from "./todo-header"
import TodoList from "./todo-list"

const TodoPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <TodoHeader />
      <TodoList />
    </div>
  )
}

export default TodoPage
