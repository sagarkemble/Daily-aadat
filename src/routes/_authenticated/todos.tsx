import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import TodoPage from "@/features/todos/components/todo-page"

const todoSearchSchema = z.object({
  q: z.string().optional(),
  status: z
    .array(z.enum(["unassigned", "assigned", "done"]))
    .optional(),
  priority: z.array(z.enum(["high", "medium", "low"])).optional(),
  sort: z
    .enum(["newest", "oldest", "name_asc", "name_desc", "priority"])
    .optional(),
})

export type TodoRouteSearch = z.infer<typeof todoSearchSchema>

export const Route = createFileRoute("/_authenticated/todos")({
  validateSearch: todoSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <TodoPage filters={search} />
}
