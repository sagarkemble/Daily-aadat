import { useMemo } from "react"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { sortFilteredTodos } from "../lib/sort-todos"
import type { Todo } from "../types/todo"
import { TodoTableRow } from "./todo-table-row"

type TodoTableProps = {
  todos: Todo[]
}

function TodoTable({ todos }: TodoTableProps) {
  const sorted = useMemo(() => sortFilteredTodos(todos), [todos])

  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">Done</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="w-28">Priority</TableHead>
          <TableHead className="w-28">Due</TableHead>
          <TableHead className="w-36">Assigned on</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((todo) => (
          <TodoTableRow key={todo.id} todo={todo} />
        ))}
      </TableBody>
    </Table>
  )
}

export { TodoTable }
