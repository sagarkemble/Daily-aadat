import { useMemo } from "react"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { sortTodos, type TodoListSort } from "../lib/sort-todos"
import type { Todo } from "../types/todo"
import { TodoTableRow } from "./todo-table-row"

type TodoTableProps = {
  todos: Todo[]
  sort?: TodoListSort
}

function TodoTable({ todos, sort }: TodoTableProps) {
  const sorted = useMemo(() => sortTodos(todos, sort), [todos, sort])

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 px-4">
              <span className="sr-only">Complete</span>
            </TableHead>
            <TableHead className="px-4">Title</TableHead>
            <TableHead className="w-28 px-4">Priority</TableHead>
            <TableHead className="w-28 px-4">Due</TableHead>
            <TableHead className="w-36 px-4">Assigned on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((todo) => (
            <TodoTableRow key={todo.id} todo={todo} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { TodoTable }
