import TodoPage from "@/features/todos/components/todo-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/todos")({
  component: RouteComponent,
})

function RouteComponent() {
  return <TodoPage />
}
