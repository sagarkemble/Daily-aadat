import { useMemo } from "react"
import { ListTodoIcon } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useIsMobile } from "@/hooks/use-mobile"
import { useFetchTodos } from "../hooks/use-fetch-todos"
import {
  filterTodos,
  type TodoListFilters,
} from "../lib/filter-todos"
import { CreateTodoDialog } from "./create-todo-dialog"
import { EmptyTodos } from "./empty-todos"
import { TodoListSkeleton } from "./todo-list-skeleton"
import { TodoMobileList } from "./todo-mobile-list"
import { TodoTable } from "./todo-table"
import { TodoToolbar } from "./todo-toolbar"

type TodoPageProps = {
  filters: TodoListFilters
}

const TodoPage = ({ filters }: TodoPageProps) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { data, isPending, isError, error } = useFetchTodos()
  const filteredTodos = useMemo(
    () => filterTodos(data ?? [], filters),
    [data, filters]
  )

  if (isError) return <div>{error.message}</div>

  function clearFilters() {
    void navigate({ to: "/todos", search: {} })
  }

  const allTodos = data ?? []
  const showFilteredEmpty =
    !isPending && allTodos.length > 0 && filteredTodos.length === 0

  return (
    <div className="flex flex-col gap-4">
      <TodoToolbar filters={filters} />
      {isPending ? (
        <TodoListSkeleton mobile={isMobile} />
      ) : allTodos.length === 0 ? (
        <EmptyTodos
          title="No todos yet"
          description="Capture something undated, then place it on any day."
          icon={<ListTodoIcon />}
        >
          <CreateTodoDialog />
        </EmptyTodos>
      ) : showFilteredEmpty ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodoIcon />
            </EmptyMedia>
            <EmptyTitle>No todos match</EmptyTitle>
            <EmptyDescription>
              Try changing status, priority, or search.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : isMobile ? (
        <TodoMobileList todos={filteredTodos} sort={filters.sort} />
      ) : (
        <TodoTable todos={filteredTodos} sort={filters.sort} />
      )}
    </div>
  )
}

export default TodoPage
